package main

import (
	"context"
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

type DbProject struct {
	Id          bson.ObjectID `bson:"_id"`
	Name        string        `bson:"name"`
	Description string        `bson:"description"`
	CustomerId  bson.ObjectID `bson:"customer_id"`
	CreatedAt   int64         `bson:"created_at"`
	UpdatedAt   int64         `bson:"updated_at"`
}

func GetProjectById(ctx context.Context, collection *mongo.Collection, id string) (*projectv1.Project, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbProject DbProject
	if err := collection.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbProject); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}
	return &projectv1.Project{
		Id:          dbProject.Id.Hex(),
		Name:        dbProject.Name,
		Description: dbProject.Description,
		CustomerId:  dbProject.CustomerId.Hex(),
		CreatedAt:   dbProject.CreatedAt,
		UpdatedAt:   dbProject.UpdatedAt,
	}, nil
}

func (s *ProjectServer) GetProject(ctx context.Context, req *connect.Request[projectv1.GetProjectRequest]) (*connect.Response[projectv1.GetProjectResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)

	fmt.Println("GetProject: ", req.Msg.Id)
	project, err := GetProjectById(ctx, collection, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.GetProjectResponse{
		Project: project,
	})

	return res, nil
}

func (s *ProjectServer) CreateProject(ctx context.Context, req *connect.Request[projectv1.CreateProjectRequest]) (*connect.Response[projectv1.CreateProjectResponse], error) {
	projectsCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)
	customersCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_CUSTOMER)

	id := bson.NewObjectID()
	customer, err := GetCustomerById(ctx, customersCollection, req.Msg.Project.CustomerId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	customerId, err := bson.ObjectIDFromHex(customer.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	now := time.Now().Unix()
	data := bson.M{
		"name":        req.Msg.Project.Name,
		"description": req.Msg.Project.Description,
		"customer_id": customerId,
		"created_at":  now,
		"updated_at":  now,
	}

	if _, err := projectsCollection.InsertOne(ctx, data); err != nil {
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
		},
	})

	return res, nil
}

func (s *ProjectServer) UpdateProject(ctx context.Context, req *connect.Request[projectv1.UpdateProjectRequest]) (*connect.Response[projectv1.UpdateProjectResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)

	objId, err := bson.ObjectIDFromHex(req.Msg.Project.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	customerId, err := bson.ObjectIDFromHex(req.Msg.Project.CustomerId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	customer, err := GetCustomerById(ctx, collection, customerId.Hex())
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
		},
	}

	if _, err := collection.UpdateOne(ctx, bson.M{"_id": objId}, data); err != nil {
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
		},
	})

	return res, nil
}

func (s *ProjectServer) DeleteProject(ctx context.Context, req *connect.Request[projectv1.DeleteProjectRequest]) (*connect.Response[projectv1.DeleteProjectResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)

	objId, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if _, err := collection.DeleteOne(ctx, bson.M{"_id": objId}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&projectv1.DeleteProjectResponse{
		Id: req.Msg.Id,
	})

	return res, nil
}

func (s *ProjectServer) GetProjects(ctx context.Context, req *connect.Request[projectv1.GetProjectsRequest]) (*connect.Response[projectv1.GetProjectsResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_PROJECT)
	var dbProjects []DbProject
	cursor, err := collection.Find(ctx, bson.M{})
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
			CustomerId:  dbProject.CustomerId.Hex(),
			CreatedAt:   dbProject.CreatedAt,
			UpdatedAt:   dbProject.UpdatedAt,
		})
	}

	res := connect.NewResponse(&projectv1.GetProjectsResponse{
		Projects: projects,
	})

	return res, nil
}
