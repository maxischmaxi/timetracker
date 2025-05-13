package main

import (
	"context"
	"time"

	"connectrpc.com/connect"
	customerv1 "github.com/maxischmaxi/ljtime-api/customer/v1"
	jobv1 "github.com/maxischmaxi/ljtime-api/job/v1"
	"github.com/maxischmaxi/ljtime-api/job/v1/jobv1connect"
	projectv1 "github.com/maxischmaxi/ljtime-api/project/v1"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type JobServer struct {
	jobv1connect.UnimplementedJobServiceHandler
}

type DbJob struct {
	Id          bson.ObjectID `bson:"_id"`
	ProjectId   bson.ObjectID `bson:"project_id"`
	Description string        `bson:"description"`
	JobType     int32         `bson:"job_type"`
	CreatedAt   int64         `bson:"created_at"`
	UpdatedAt   int64         `bson:"updated_at"`
	Hours       int64         `bson:"hours"`
	Minutes     int64         `bson:"minutes"`
	Date        string        `bson:"date"`
}

func (s *JobServer) GetJobById(ctx context.Context, collection *mongo.Collection, id string) (*jobv1.Job, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbJob DbJob
	if err := collection.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbJob); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return &jobv1.Job{
		Id:          dbJob.Id.Hex(),
		ProjectId:   dbJob.ProjectId.Hex(),
		Description: dbJob.Description,
		CreatedAt:   dbJob.CreatedAt,
		Type:        jobv1.JobType(dbJob.JobType),
		UpdatedAt:   dbJob.UpdatedAt,
		Hours:       dbJob.Hours,
		Minutes:     dbJob.Minutes,
		Date:        dbJob.Date,
	}, nil
}

func (s *JobServer) GetJobs(ctx context.Context, req *connect.Request[jobv1.GetJobsRequest]) (*connect.Response[jobv1.GetJobsResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)

	var dbJobs []DbJob
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var dbJob DbJob
		if err := cursor.Decode(&dbJob); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbJobs = append(dbJobs, dbJob)
	}

	jobs := make([]*jobv1.Job, len(dbJobs))
	for i, dbJob := range dbJobs {
		jobs[i] = &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		}
	}

	return connect.NewResponse(&jobv1.GetJobsResponse{
		Jobs: jobs,
	}), nil
}

func (s *JobServer) GetJobsByProject(ctx context.Context, req *connect.Request[jobv1.GetJobsByProjectRequest]) (*connect.Response[jobv1.GetJobsByProjectResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	projectId := req.Msg.ProjectId

	objId, err := bson.ObjectIDFromHex(projectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbJobs []DbJob
	cursor, err := collection.Find(ctx, bson.M{"project_id": objId})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var dbJob DbJob
		if err := cursor.Decode(&dbJob); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbJobs = append(dbJobs, dbJob)
	}

	jobs := make([]*jobv1.Job, len(dbJobs))
	for i, dbJob := range dbJobs {
		jobs[i] = &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		}
	}

	return connect.NewResponse(&jobv1.GetJobsByProjectResponse{
		Jobs: jobs,
	}), nil
}

func (s *JobServer) GetJob(ctx context.Context, req *connect.Request[jobv1.GetJobRequest]) (*connect.Response[jobv1.GetJobResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	id := req.Msg.Id

	job, err := s.GetJobById(ctx, collection, id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&jobv1.GetJobResponse{
		Job: job,
	}), nil
}

func (s *JobServer) CreateJob(ctx context.Context, req *connect.Request[jobv1.CreateJobRequest]) (*connect.Response[jobv1.CreateJobResponse], error) {
	jobCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	projectCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)
	job := req.Msg.Job

	id := bson.NewObjectID()

	project, err := GetProjectById(ctx, projectCollection, job.ProjectId)
	if err != nil {
		if err == connect.NewError(connect.CodeNotFound, nil) {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	projectId, err := bson.ObjectIDFromHex(project.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	now := time.Now().Unix()

	dbJob := DbJob{
		Id:          id,
		ProjectId:   projectId,
		Description: job.Description,
		JobType:     int32(job.Type),
		CreatedAt:   now,
		UpdatedAt:   now,
		Hours:       job.Hours,
		Minutes:     job.Minutes,
		Date:        job.Date,
	}

	if _, err := jobCollection.InsertOne(ctx, dbJob); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&jobv1.CreateJobResponse{
		Job: &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		},
	}), nil
}

func (s *JobServer) UpdateJob(ctx context.Context, req *connect.Request[jobv1.UpdateJobRequest]) (*connect.Response[jobv1.UpdateJobResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	job := req.Msg.Job

	objId, err := bson.ObjectIDFromHex(job.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	project, err := GetProjectById(ctx, collection, job.ProjectId)
	if err != nil {
		if err == connect.NewError(connect.CodeNotFound, nil) {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	projectId, err := bson.ObjectIDFromHex(project.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	dbJob := DbJob{
		Id:          objId,
		ProjectId:   projectId,
		Description: job.Description,
		JobType:     int32(job.Type),
		CreatedAt:   job.CreatedAt,
		UpdatedAt:   job.UpdatedAt,
		Hours:       job.Hours,
		Minutes:     job.Minutes,
		Date:        job.Date,
	}

	if _, err := collection.UpdateOne(ctx, bson.M{"_id": objId}, bson.M{"$set": dbJob}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&jobv1.UpdateJobResponse{
		Job: &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		},
	}), nil
}

func (s *JobServer) DeleteJob(ctx context.Context, req *connect.Request[jobv1.DeleteJobRequest]) (*connect.Response[jobv1.DeleteJobResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	id := req.Msg.Id

	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if _, err := collection.DeleteOne(ctx, bson.M{"_id": objId}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&jobv1.DeleteJobResponse{
		Id: id,
	}), nil
}

func (s *JobServer) GetJobsByCustomer(ctx context.Context, req *connect.Request[jobv1.GetJobsByCustomerRequest]) (*connect.Response[jobv1.GetJobsByCustomerResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	customerId := req.Msg.CustomerId

	customer, err := GetCustomerById(ctx, collection, customerId)
	if err != nil {
		if err == connect.NewError(connect.CodeNotFound, nil) {
			return nil, connect.NewError(connect.CodeInvalidArgument, err)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	customerObjId, err := bson.ObjectIDFromHex(customer.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	projectCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)
	projectCursor, err := projectCollection.Find(ctx, bson.M{"customer_id": customerObjId.Hex()})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer projectCursor.Close(ctx)

	var projectIds []bson.ObjectID
	for projectCursor.Next(ctx) {
		var project DbProject
		if err := projectCursor.Decode(&project); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		projectIds = append(projectIds, project.Id)
	}

	var dbJobs []DbJob
	cursor, err := collection.Find(ctx, bson.M{"project_id": bson.M{"$in": projectIds}})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var dbJob DbJob
		if err := cursor.Decode(&dbJob); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbJobs = append(dbJobs, dbJob)
	}

	jobs := make([]*jobv1.Job, len(dbJobs))
	for i, dbJob := range dbJobs {
		jobs[i] = &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		}
	}

	return connect.NewResponse(&jobv1.GetJobsByCustomerResponse{
		Jobs: jobs,
	}), nil
}

func (s *JobServer) GetJobsByDate(ctx context.Context, req *connect.Request[jobv1.GetJobsByDateRequest]) (*connect.Response[jobv1.GetJobsByDateResponse], error) {
	jobsCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_JOB)
	customersCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_CUSTOMER)
	projectsCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)
	date := req.Msg.Date

	var dbJobs []DbJob
	cursor, err := jobsCollection.Find(ctx, bson.M{"date": date})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var dbJob DbJob
		if err := cursor.Decode(&dbJob); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbJobs = append(dbJobs, dbJob)
	}

	jobs := make([]*jobv1.JobsByDateResponse, len(dbJobs))
	for i, dbJob := range dbJobs {
		job := &jobv1.Job{
			Id:          dbJob.Id.Hex(),
			ProjectId:   dbJob.ProjectId.Hex(),
			Description: dbJob.Description,
			CreatedAt:   dbJob.CreatedAt,
			Type:        jobv1.JobType(dbJob.JobType),
			UpdatedAt:   dbJob.UpdatedAt,
			Hours:       dbJob.Hours,
			Minutes:     dbJob.Minutes,
			Date:        dbJob.Date,
		}

		project, err := GetProjectById(ctx, projectsCollection, dbJob.ProjectId.Hex())
		if err != nil {
			if err == connect.NewError(connect.CodeNotFound, nil) {
				return nil, connect.NewError(connect.CodeInvalidArgument, err)
			}
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		customer, err := GetCustomerById(ctx, customersCollection, project.CustomerId)
		if err != nil {
			if err == connect.NewError(connect.CodeNotFound, nil) {
				return nil, connect.NewError(connect.CodeInvalidArgument, err)
			}
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		jobs[i] = &jobv1.JobsByDateResponse{
			Job: job,
			Project: &projectv1.Project{
				Id:          project.Id,
				CustomerId:  project.CustomerId,
				Name:        project.Name,
				Description: project.Description,
				CreatedAt:   project.CreatedAt,
				UpdatedAt:   project.UpdatedAt,
			},
			Customer: &customerv1.Customer{
				Id:        customer.Id,
				Name:      customer.Name,
				Email:     customer.Email,
				Phone:     customer.Phone,
				Address:   customer.Address,
				CreatedAt: customer.CreatedAt,
				UpdatedAt: customer.UpdatedAt,
				Tag:       customer.Tag,
			},
		}
	}

	return connect.NewResponse(&jobv1.GetJobsByDateResponse{
		Jobs: jobs,
	}), nil
}
