package main

import (
	"context"
	"errors"
	"fmt"
	"time"

	"connectrpc.com/connect"
	projectv1 "github.com/maxischmaxi/ljtime-api/project/v1"
	"github.com/maxischmaxi/ljtime-api/project/v1/projectv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type ProjectServer struct {
	projectv1connect.UnimplementedProjectServiceHandler
}

type DbJob struct {
	Id            bson.ObjectID `bson:"_id"`
	Description   string        `bson:"description"`
	JobType       int32         `bson:"job_type"`
	CreatedAt     int64         `bson:"created_at"`
	UpdatedAt     int64         `bson:"updated_at"`
	Hours         int64         `bson:"hours"`
	Minutes       int64         `bson:"minutes"`
	ServiceTypeId string        `bson:"service_type_id"`
	Date          string        `bson:"date"`
}

func (j *DbJob) ToJob() projectv1.Job {
	return projectv1.Job{
		Id:            j.Id.Hex(),
		Description:   j.Description,
		CreatedAt:     j.CreatedAt,
		UpdatedAt:     j.UpdatedAt,
		Type:          projectv1.JobType(j.JobType),
		Hours:         j.Hours,
		Minutes:       j.Minutes,
		ServiceTypeId: j.ServiceTypeId,
		Date:          j.Date,
	}
}

type DbProject struct {
	Id          bson.ObjectID `bson:"_id"`
	Name        string        `bson:"name"`
	Description string        `bson:"description"`
	CustomerId  bson.ObjectID `bson:"customer_id"`
	CreatedAt   int64         `bson:"created_at"`
	UpdatedAt   int64         `bson:"updated_at"`
	OrgId       string        `bson:"org_id"`
	ProjectType int32         `bson:"project_type"`
	Jobs        []DbJob       `bson:"jobs"`
	CustomColor string        `bson:"custom_color,omitempty"`
}

func (p *DbProject) ToProject() projectv1.Project {

	jobs := make([]*projectv1.Job, len(p.Jobs))

	for _, j := range p.Jobs {
		job := j.ToJob()
		jobs = append(jobs, &job)
	}

	return projectv1.Project{
		Id:          p.Id.Hex(),
		Name:        p.Name,
		Description: p.Description,
		CustomerId:  p.CustomerId.Hex(),
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
		OrgId:       p.OrgId,
		ProjectType: projectv1.ProjectType(p.ProjectType),
		Jobs:        jobs,
		CustomColor: p.CustomColor,
	}
}

func GetProjectById(ctx context.Context, id string) (*projectv1.Project, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbProject DbProject
	if err := PROJECTS.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbProject); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	p := dbProject.ToProject()

	return &p, nil
}

func (s *ProjectServer) GetProject(ctx context.Context, req *connect.Request[projectv1.GetProjectRequest]) (*connect.Response[projectv1.GetProjectResponse], error) {
	fmt.Println("GetProject: ", req.Msg.Id)
	project, err := GetProjectById(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.GetProjectResponse{
		Project: project,
	})

	return res, nil
}

func (s *ProjectServer) CreateProject(ctx context.Context, req *connect.Request[projectv1.CreateProjectRequest]) (*connect.Response[projectv1.CreateProjectResponse], error) {
	id := bson.NewObjectID()
	customer, err := GetCustomerById(ctx, req.Msg.Project.CustomerId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	customerId, err := bson.ObjectIDFromHex(customer.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	now := time.Now().Unix()
	data := bson.M{
		"name":         req.Msg.Project.Name,
		"description":  req.Msg.Project.Description,
		"customer_id":  customerId,
		"created_at":   now,
		"updated_at":   now,
		"org_id":       req.Msg.OrgId,
		"custom_color": req.Msg.Project.CustomColor,
		"project_type": projectv1.ProjectType_PROJECT_TYPE_BILLABLE.Number(),
		"jobs":         []DbJob{},
	}

	if _, err := PROJECTS.InsertOne(ctx, data); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.CreateProjectResponse{
		Project: &projectv1.Project{
			Id:          id.Hex(),
			Name:        req.Msg.Project.Name,
			Description: req.Msg.Project.Description,
			CustomerId:  customer.Id,
			CreatedAt:   now,
			UpdatedAt:   now,
			OrgId:       req.Msg.OrgId,
			ProjectType: projectv1.ProjectType_PROJECT_TYPE_BILLABLE,
			CustomColor: req.Msg.Project.CustomColor,
			Jobs:        []*projectv1.Job{},
		},
	})

	return res, nil
}

func (s *ProjectServer) UpdateProject(ctx context.Context, req *connect.Request[projectv1.UpdateProjectRequest]) (*connect.Response[projectv1.UpdateProjectResponse], error) {
	objId, err := bson.ObjectIDFromHex(req.Msg.Project.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	customerId, err := bson.ObjectIDFromHex(req.Msg.Project.CustomerId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	customer, err := GetCustomerById(ctx, customerId.Hex())
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	now := time.Now().Unix()
	data := bson.M{
		"$set": bson.M{
			"name":        req.Msg.Project.Name,
			"description": req.Msg.Project.Description,
			"customer_id": customer.Id,
			"updated_at":  now,
			"org_id":      req.Msg.OrgId,
		},
	}

	if _, err := PROJECTS.UpdateOne(ctx, bson.M{"_id": objId}, data); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.UpdateProjectResponse{
		Project: &projectv1.Project{
			Id:          req.Msg.Project.Id,
			Name:        req.Msg.Project.Name,
			Description: req.Msg.Project.Description,
			CustomerId:  customer.Id,
			CreatedAt:   now,
			UpdatedAt:   now,
			OrgId:       req.Msg.OrgId,
			CustomColor: req.Msg.Project.CustomColor,
		},
	})

	return res, nil
}

func (s *ProjectServer) DeleteProject(ctx context.Context, req *connect.Request[projectv1.DeleteProjectRequest]) (*connect.Response[projectv1.DeleteProjectResponse], error) {
	objId, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if _, err := PROJECTS.DeleteOne(ctx, bson.M{"_id": objId}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.DeleteProjectResponse{
		Id: req.Msg.Id,
	})

	return res, nil
}

func (s *ProjectServer) GetProjects(ctx context.Context, req *connect.Request[projectv1.GetProjectsRequest]) (*connect.Response[projectv1.GetProjectsResponse], error) {
	var dbProjects []DbProject
	cursor, err := PROJECTS.Find(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var dbProject DbProject
		if err := cursor.Decode(&dbProject); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbProjects = append(dbProjects, dbProject)
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var projects []*projectv1.Project
	for _, dbProject := range dbProjects {
		p := dbProject.ToProject()
		projects = append(projects, &p)
	}

	res := connect.NewResponse(&projectv1.GetProjectsResponse{
		Projects: projects,
	})

	return res, nil
}

func (s *ProjectServer) GetProjectsByOrg(ctx context.Context, req *connect.Request[projectv1.GetProjectsByOrgRequest]) (*connect.Response[projectv1.GetProjectsByOrgResponse], error) {
	var dbProjects []DbProject
	cursor, err := PROJECTS.Find(ctx, bson.M{"org_id": req.Msg.OrgId})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var dbProject DbProject
		if err := cursor.Decode(&dbProject); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		dbProjects = append(dbProjects, dbProject)
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var projects []*projectv1.Project
	for _, dbProject := range dbProjects {
		projects = append(projects, &projectv1.Project{
			Id:          dbProject.Id.Hex(),
			Name:        dbProject.Name,
			Description: dbProject.Description,
			OrgId:       dbProject.OrgId,
			CustomerId:  dbProject.CustomerId.Hex(),
			CreatedAt:   dbProject.CreatedAt,
			UpdatedAt:   dbProject.UpdatedAt,
			CustomColor: dbProject.CustomColor,
		})
	}

	res := connect.NewResponse(&projectv1.GetProjectsByOrgResponse{
		Projects: projects,
	})

	return res, nil
}

func (s *ProjectServer) GetJobsByProject(ctx context.Context, req *connect.Request[projectv1.GetJobsByProjectRequest]) (*connect.Response[projectv1.GetJobsByProjectResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, errors.New("not implemented"))
}

func (s *ProjectServer) GetJobsByCustomer(ctx context.Context, req *connect.Request[projectv1.GetJobsByCustomerRequest]) (*connect.Response[projectv1.GetJobsByCustomerResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, errors.New("not implemented"))
}

func (s *ProjectServer) GetJobsByDate(ctx context.Context, req *connect.Request[projectv1.GetJobsByDateRequest]) (*connect.Response[projectv1.GetJobsByDateResponse], error) {
	user, err := GetMiddlewareUser(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{"org_id": user.OrgId}

	cursor, err := PROJECTS.Find(ctx, filter)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	var projects []DbProject
	if err = cursor.All(ctx, &projects); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	var dateJobs []*projectv1.DateJob

	for _, project := range projects {

		for _, job := range project.Jobs {
			if job.Date != req.Msg.Date {
				continue
			}
			j := job.ToJob()
			p := project.ToProject()

			customer, err := GetCustomerById(ctx, p.CustomerId)
			if err != nil {
				return nil, connect.NewError(connect.CodeInternal, err)
			}

			dateJob := projectv1.DateJob{
				Job:      &j,
				Project:  &p,
				Customer: customer,
			}

			dateJobs = append(dateJobs, &dateJob)
		}
	}

	return connect.NewResponse(&projectv1.GetJobsByDateResponse{
		Jobs: dateJobs,
	}), nil
}

func (s *ProjectServer) GetJob(ctx context.Context, req *connect.Request[projectv1.GetJobRequest]) (*connect.Response[projectv1.GetJobResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, errors.New("not implemented"))
}

func (s *ProjectServer) CreateJob(ctx context.Context, req *connect.Request[projectv1.CreateJobRequest]) (*connect.Response[projectv1.CreateJobResponse], error) {
	now := time.Now().Unix()

	dbJob := DbJob{
		Hours:         req.Msg.Hours,
		Minutes:       req.Msg.Minutes,
		Date:          req.Msg.Date,
		JobType:       int32(req.Msg.Type.Number()),
		Id:            bson.NewObjectID(),
		Description:   req.Msg.Description,
		CreatedAt:     now,
		UpdatedAt:     now,
		ServiceTypeId: req.Msg.ServiceTypeId,
	}

	projectId, err := bson.ObjectIDFromHex(req.Msg.ProjectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{"_id": projectId}

	data := bson.M{"$push": bson.M{
		"jobs": dbJob,
	}}

	_, err = PROJECTS.UpdateOne(ctx, filter, data)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&projectv1.CreateJobResponse{}), nil
}

func (s *ProjectServer) UpdateJob(ctx context.Context, req *connect.Request[projectv1.UpdateJobRequest]) (*connect.Response[projectv1.UpdateJobResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, errors.New("not implemented"))
}

func (s *ProjectServer) DeleteJob(ctx context.Context, req *connect.Request[projectv1.DeleteJobRequest]) (*connect.Response[projectv1.DeleteJobResponse], error) {
	projectId, err := bson.ObjectIDFromHex(req.Msg.ProjectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	jobId, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{"_id": projectId}

	update := bson.M{
		"$pull": bson.M{
			"jobs": bson.M{
				"_id": jobId,
			},
		},
	}

	updateResult, err := PROJECTS.UpdateOne(ctx, filter, update)

	if updateResult.ModifiedCount == 0 {
		return nil, connect.NewError(connect.CodeInternal, errors.New("No documents were updated."))
	}

	return connect.NewResponse(&projectv1.DeleteJobResponse{}), nil
}

func (s *ProjectServer) UpdateProjectType(ctx context.Context, req *connect.Request[projectv1.UpdateProjectTypeRequest]) (*connect.Response[projectv1.UpdateProjectTypeResponse], error) {
	project, err := GetProjectById(ctx, req.Msg.ProjectId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	projectId, err := bson.ObjectIDFromHex(project.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{
		"_id": projectId,
	}

	now := time.Now().Unix()

	update := bson.M{
		"$set": bson.M{
			"project_type": req.Msg.ProjectType.Number(),
			"updated_at":   now,
		},
	}

	updateResult, err := PROJECTS.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	if updateResult.ModifiedCount == 0 {
		return nil, connect.NewError(connect.CodeInternal, errors.New("No documents were updated."))
	}

	return connect.NewResponse(&projectv1.UpdateProjectTypeResponse{}), nil
}
