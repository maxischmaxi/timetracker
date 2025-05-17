package main

import (
	"context"
	"errors"
	"fmt"
	"time"

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
	Name         string        `bson:"name"`
	Admins       []string      `bson:"admins"`
}

type OrgInvite struct {
	Token     string `bson:"token"`
	CreatedAt int64  `bson:"created_at"`
	OrgId     string `bson:"org_id"`
}

func (o *DbOrg) ToOrg() *orgv1.Org {
	return &orgv1.Org{
		Name:         o.Name,
		Id:           o.Id.Hex(),
		Admins:       o.Admins,
		MailProvider: orgv1.MailProvider(o.MailProvider),
	}
}

func DeleteOrgInviteToken(ctx context.Context, token string, orgId string) error {
	if _, err := ORG_INVITE_TOKENS.DeleteOne(ctx, bson.M{"token": token, "org_id": orgId}); err != nil {
		return err
	}
	return nil
}

func GetOrgInviteToken(ctx context.Context, token string, orgId string) (*OrgInvite, error) {
	var orgInvite OrgInvite
	if err := ORG_INVITE_TOKENS.FindOne(ctx, bson.M{"token": token, "org_id": orgId}).Decode(&orgInvite); err != nil {
		return nil, err
	}

	return &orgInvite, nil
}

func GetOrgsByOrgIds(ctx context.Context, ids []string) ([]*orgv1.Org, error) {
	orgs := []*orgv1.Org{}

	for _, orgId := range ids {
		org, err := GetOrgById(ctx, orgId)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			if err == mongo.ErrNilDocument {
				return nil, connect.NewError(connect.CodeInternal, err)
			}
			continue
		}

		orgs = append(orgs, org)
	}

	return orgs, nil
}

func GetOrgById(ctx context.Context, id string) (*orgv1.Org, error) {
	orgId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		fmt.Println("x")
		fmt.Println(id)
		return nil, err
	}

	var org DbOrg
	if err := ORGS.FindOne(ctx, bson.M{"_id": orgId}).Decode(&org); err != nil {
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
	org, err := GetOrgById(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&orgv1.GetOrgByIdResponse{
		Org: org,
	}), nil
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

func (s *OrgServer) InviteEmailToOrg(ctx context.Context, req *connect.Request[orgv1.InviteEmailToOrgRequest]) (*connect.Response[orgv1.InviteEmailToOrgResponse], error) {
	user, err := GetMiddlewareUser(ctx)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res, err := SendOrgInvite(ctx, []string{req.Msg.Email}, req.Msg.OrgId, user.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	fmt.Printf("Send Email with org invite: %s\n", res.Id)

	return connect.NewResponse(&orgv1.InviteEmailToOrgResponse{}), nil
}

func (s *OrgServer) AcceptEmailInvite(ctx context.Context, req *connect.Request[orgv1.AcceptEmailInviteRequest]) (*connect.Response[orgv1.AcceptEmailInviteResponse], error) {
	org, err := GetOrgById(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	user, err := GetUserByFirebaseUID(ctx, req.Msg.FirebaseUid)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	token, err := GetOrgInviteToken(ctx, req.Msg.Token, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	now := time.Now().Unix()
	expires := int64(token.CreatedAt) + int64((15 * time.Minute).Seconds())

	if now > expires {
		return nil, connect.NewError(connect.CodeInternal, errors.New("token expired"))
	}

	err = DeleteOrgInviteToken(ctx, req.Msg.Token, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, errors.New("error deleting token"))
	}

	orgId, err := bson.ObjectIDFromHex(req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	newOrgIds := user.OrgIds
	newOrgIds = append(newOrgIds, org.Id)

	if _, err = USERS.UpdateOne(ctx, bson.M{"_id": orgId}, bson.M{"$set": bson.M{"org_ids": newOrgIds}}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&orgv1.AcceptEmailInviteResponse{}), nil
}
