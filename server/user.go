package main

import (
	"context"

	"connectrpc.com/connect"
	customerv1 "github.com/maxischmaxi/ljtime-api/customer/v1"
	userv1 "github.com/maxischmaxi/ljtime-api/user/v1"
	"github.com/maxischmaxi/ljtime-api/user/v1/userv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserServer struct {
	userv1connect.UnimplementedUserServiceHandler
	MongoClient *mongo.Client
	DBName      string
}

type DbUser struct {
	Id         string   `bson:"_id"`
	Email      string   `bson:"email"`
	Name       string   `bson:"name"`
	Address    Address  `bson:"address"`
	ProjectIds []string `bson:"project_ids"`
	Tags       []string `bson:"tags"`
}

func GetUserById(ctx context.Context, collection *mongo.Collection, id string) (*userv1.User, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbUser DbUser
	if err := collection.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbUser); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return &userv1.User{
		Email:      dbUser.Email,
		Name:       dbUser.Name,
		Address:    &customerv1.Address{Street: dbUser.Address.Street, City: dbUser.Address.City, State: dbUser.Address.State, Zip: dbUser.Address.Zip, Country: dbUser.Address.Country},
		ProjectIds: dbUser.ProjectIds,
		Tags:       dbUser.Tags,
	}, nil
}

func (s *UserServer) GetUserById(ctx context.Context, req *connect.Request[userv1.GetUserByIdRequest]) (*connect.Response[userv1.GetUserByIdResponse], error) {
	collection := s.MongoClient.Database(s.DBName).Collection(COLLECTION_USER)

	user, err := GetUserById(ctx, collection, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&userv1.GetUserByIdResponse{
		User: user,
	}), nil
}

func (s *UserServer) GetAllUsers(ctx context.Context, req *connect.Request[userv1.GetAllUsersRequest]) (*connect.Response[userv1.GetAllUsersResponse], error) {
	collection := s.MongoClient.Database(s.DBName).Collection(COLLECTION_USER)

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	var users []*userv1.User
	for cursor.Next(ctx) {
		var dbUser DbUser
		if err := cursor.Decode(&dbUser); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		users = append(users, &userv1.User{
			Email:      dbUser.Email,
			Name:       dbUser.Name,
			Address:    &customerv1.Address{Street: dbUser.Address.Street, City: dbUser.Address.City, State: dbUser.Address.State, Zip: dbUser.Address.Zip, Country: dbUser.Address.Country},
			ProjectIds: dbUser.ProjectIds,
			Tags:       dbUser.Tags,
		})
	}

	return connect.NewResponse(&userv1.GetAllUsersResponse{
		Users: users,
	}), nil
}
