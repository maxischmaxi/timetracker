package main

import (
	"context"
	"fmt"

	"connectrpc.com/connect"
	orgv1 "github.com/maxischmaxi/ljtime-api/org/v1"
	"github.com/maxischmaxi/ljtime-api/org/v1/orgv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type OrgServer struct {
	orgv1connect.UnimplementedOrgServiceHandler
	MongoClient *mongo.Client
	DBName      string
}

type DbOrg struct {
	Id           bson.ObjectID `bson:"_id"`
	MailProvider int32         `bson:"mail_provider"`
	Users        []string      `bson:"users"`
	Name         string        `bson:"name"`
}

func (o *DbOrg) ToOrg() *orgv1.Org {
	return &orgv1.Org{
		Name:         o.Name,
		Users:        o.Users,
		Id:           o.Id.Hex(),
		MailProvider: orgv1.MailProvider(o.MailProvider),
	}
}

func GetOrgById(ctx context.Context, collection *mongo.Collection, id string) (*orgv1.Org, error) {
	orgId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println("x")
		fmt.Println(id)
		return nil, err
	}

	var org DbOrg
	if err := collection.FindOne(ctx, bson.M{"_id": orgId}).Decode(&org); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return org.ToOrg(), nil
}

func (s *OrgServer) GetOrg(ctx context.Context, req *connect.Request[orgv1.GetOrgRequest]) (*connect.Response[orgv1.GetOrgResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, nil)
}

func (s *OrgServer) GetOrgById(ctx context.Context, req *connect.Request[orgv1.GetOrgByIdRequest]) (*connect.Response[orgv1.GetOrgByIdResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, nil)
}

func (s *OrgServer) UpdateOrg(ctx context.Context, req *connect.Request[orgv1.UpdateOrgRequest]) (*connect.Response[orgv1.UpdateOrgResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, nil)
}

func (s *OrgServer) CreateOrg(ctx context.Context, req *connect.Request[orgv1.CreateOrgRequest]) (*connect.Response[orgv1.CreateOrgResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, nil)
}

func (s *OrgServer) DeleteOrg(ctx context.Context, req *connect.Request[orgv1.DeleteOrgRequest]) (*connect.Response[orgv1.DeleteOrgResponse], error) {
	return nil, connect.NewError(connect.CodeInternal, nil)
}
