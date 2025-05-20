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

type DbPayment struct {
	Iban     string `bson:"iban"`
	Bic      string `bson:"bic"`
	BankName string `bson:"bank_name"`
}

type DbServiceType struct {
	Id     bson.ObjectID `bson:"_id,omitempty"`
	Name   string        `bson:"name,omitempty"`
	Status bool          `bson:"status,omitempty"`
}

type DbOrg struct {
	Id           bson.ObjectID   `bson:"_id,omitempty"`
	MailProvider int32           `bson:"mail_provider,omitempty"`
	Name         string          `bson:"name,omitempty"`
	CustomerID   string          `bson:"customer_id,omitempty"`
	Admins       []string        `bson:"admins,omitempty"`
	CreatedAt    int64           `bson:"created_at,omitempty"`
	UpdatedAt    int64           `bson:"updated_at,omitempty"`
	ServiceTypes []DbServiceType `bson:"service_types,omitempty"`
	LegalNotice  string          `bson:"legal_notice"`
	Payment      DbPayment       `bson:"payment"`
}

type OrgInvite struct {
	Token     string `bson:"token"`
	CreatedAt int64  `bson:"created_at"`
	OrgId     string `bson:"org_id"`
}

func (o *DbOrg) ToOrg() *orgv1.Org {
	var serviceTypes []*orgv1.ServiceType

	for _, i := range o.ServiceTypes {
		serviceTypes = append(serviceTypes, &orgv1.ServiceType{
			Id:     i.Id.Hex(),
			Name:   i.Name,
			Status: i.Status,
		})
	}

	return &orgv1.Org{
		Name:         o.Name,
		Id:           o.Id.Hex(),
		Admins:       o.Admins,
		MailProvider: orgv1.MailProvider(o.MailProvider),
		CreatedAt:    o.CreatedAt,
		UpdatedAt:    o.UpdatedAt,
		ServiceTypes: serviceTypes,
		LegalNotice:  o.LegalNotice,
		Payment: &orgv1.Payment{
			Iban:     o.Payment.Iban,
			Bic:      o.Payment.Bic,
			BankName: o.Payment.BankName,
		},
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
	org, err := GetOrgById(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	id, err := bson.ObjectIDFromHex(org.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	data := DbOrg{
		Name:         req.Msg.Org.Name,
		MailProvider: int32(req.Msg.Org.MailProvider),
	}

	filter := bson.M{"_id": id}
	set := bson.M{"$set": data}

	if _, err := ORGS.UpdateOne(ctx, filter, set); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&orgv1.UpdateOrgResponse{}), nil
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

func (s *OrgServer) CreateServiceType(ctx context.Context, req *connect.Request[orgv1.CreateServiceTypeRequest]) (*connect.Response[orgv1.CreateServiceTypeResponse], error) {
	org, err := GetOrgById(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	dbServiceType := DbServiceType{
		Name:   req.Msg.Name,
		Id:     bson.NewObjectID(),
		Status: true,
	}

	orgId, err := bson.ObjectIDFromHex(org.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{"_id": orgId}

	data := bson.M{"$push": bson.M{
		"service_types": dbServiceType,
	}}

	_, err = ORGS.UpdateOne(ctx, filter, data)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&orgv1.CreateServiceTypeResponse{}), nil
}

func (s *OrgServer) UpdateServiceTypeStatus(ctx context.Context, req *connect.Request[orgv1.UpdateServiceTypeStatusRequest]) (*connect.Response[orgv1.UpdateServiceTypeStatusResponse], error) {
	org, err := GetOrgById(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	orgId, err := bson.ObjectIDFromHex(org.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	serviceTypeId, err := bson.ObjectIDFromHex(req.Msg.ServiceTypeId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{
		"_id": orgId,
		"service_types": bson.M{
			"$elemMatch": bson.M{
				"_id": serviceTypeId,
			},
		},
	}

	update := bson.M{
		"$set": bson.M{
			"service_types.$.status": req.Msg.Status,
		},
	}

	updateResult, err := ORGS.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	if updateResult.ModifiedCount == 0 {
		return nil, connect.NewError(connect.CodeInternal, errors.New("No documents were updated."))
	}

	return connect.NewResponse(&orgv1.UpdateServiceTypeStatusResponse{
		Status: req.Msg.Status,
	}), nil
}

func (s *OrgServer) DeleteServiceType(ctx context.Context, req *connect.Request[orgv1.DeleteServiceTypeRequest]) (*connect.Response[orgv1.DeleteServiceTypeResponse], error) {
	org, err := GetOrgById(ctx, req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	orgId, err := bson.ObjectIDFromHex(org.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	serviceTypeId, err := bson.ObjectIDFromHex(req.Msg.ServiceTypeId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{
		"_id": orgId,
	}

	update := bson.M{
		"$pull": bson.M{
			"service_types": bson.M{
				"_id": serviceTypeId,
			},
		},
	}

	updateResult, err := ORGS.UpdateOne(ctx, filter, update)

	if updateResult.ModifiedCount == 0 {
		return nil, connect.NewError(connect.CodeInternal, errors.New("No documents were updated."))
	}

	return connect.NewResponse(&orgv1.DeleteServiceTypeResponse{}), nil
}

func (s *OrgServer) SetOrgPayment(ctx context.Context, req *connect.Request[orgv1.SetOrgPaymentRequest]) (*connect.Response[orgv1.SetOrgPaymentResponse], error) {
	orgId, err := bson.ObjectIDFromHex(req.Msg.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	filter := bson.M{"_id": orgId}

	payment := DbPayment{
		Iban:     req.Msg.Iban,
		BankName: req.Msg.BankName,
		Bic:      req.Msg.Bic,
	}

	update := bson.M{
		"$set": bson.M{
			"payment":      payment,
			"legal_notice": req.Msg.LegalNotice,
		},
	}

	_, err = ORGS.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&orgv1.SetOrgPaymentResponse{}), nil
}
