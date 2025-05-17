package main

import (
	"context"
	"time"

	"connectrpc.com/connect"
	customerv1 "github.com/maxischmaxi/ljtime-api/customer/v1"
	"github.com/maxischmaxi/ljtime-api/customer/v1/customerv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type CustomerServer struct {
	customerv1connect.UnimplementedCustomerServiceHandler
}

type DbCustomer struct {
	Id             bson.ObjectID `bson:"_id,omitempty"`
	Name           string        `bson:"name,omitempty"`
	Phone          string        `bson:"phone,omitempty"`
	Email          string        `bson:"email,omitempty"`
	Tag            string        `bson:"tag,omitempty"`
	CreatedAt      int64         `bson:"created_at,omitempty"`
	UpdatedAt      int64         `bson:"updated_at,omitempty"`
	Address        Address       `bson:"address,omitempty"`
	OrgId          string        `bson:"org_id,omitempty"`
	ServiceTypeIds []string      `bson:"service_type_ids,omitempty"`
}

func (c *DbCustomer) ToCustomer() *customerv1.Customer {
	return &customerv1.Customer{
		Id:             c.Id.Hex(),
		Name:           c.Name,
		Phone:          c.Phone,
		Email:          c.Email,
		Tag:            c.Tag,
		OrgId:          c.OrgId,
		ServiceTypeIds: c.ServiceTypeIds,
		CreatedAt:      c.CreatedAt,
		UpdatedAt:      c.UpdatedAt,
		Address: &customerv1.Address{
			Street:  c.Address.Street,
			City:    c.Address.City,
			State:   c.Address.State,
			Zip:     c.Address.Zip,
			Country: c.Address.Country,
		},
	}
}

func GetCustomersByFilter(ctx context.Context, filter map[string]any) ([]*customerv1.Customer, error) {
	cursor, err := CUSTOMERS.Find(ctx, filter)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	var customers []*customerv1.Customer

	for cursor.Next(ctx) {
		var dbCustomer DbCustomer
		if err := cursor.Decode(&dbCustomer); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}

		customers = append(customers, dbCustomer.ToCustomer())
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return customers, nil
}

func GetCustomerById(ctx context.Context, id string) (*customerv1.Customer, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbCustomer DbCustomer
	if err := CUSTOMERS.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbCustomer); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return &customerv1.Customer{
		Id:             dbCustomer.Id.Hex(),
		Name:           dbCustomer.Name,
		Phone:          dbCustomer.Phone,
		Email:          dbCustomer.Email,
		Tag:            dbCustomer.Tag,
		CreatedAt:      dbCustomer.CreatedAt,
		UpdatedAt:      dbCustomer.UpdatedAt,
		OrgId:          dbCustomer.OrgId,
		ServiceTypeIds: dbCustomer.ServiceTypeIds,
		Address: &customerv1.Address{
			Street:  dbCustomer.Address.Street,
			City:    dbCustomer.Address.City,
			State:   dbCustomer.Address.State,
			Zip:     dbCustomer.Address.Zip,
			Country: dbCustomer.Address.Country,
		},
	}, nil
}

func (s *CustomerServer) GetCustomer(ctx context.Context, req *connect.Request[customerv1.GetCustomerRequest]) (*connect.Response[customerv1.GetCustomerResponse], error) {
	id := req.Msg.Id

	customer, err := GetCustomerById(ctx, id)
	if err != nil {
		return nil, err
	}

	res := connect.NewResponse(&customerv1.GetCustomerResponse{
		Customer: customer,
	})

	return res, nil
}

func (s *CustomerServer) CreateCustomer(ctx context.Context, req *connect.Request[customerv1.CreateCustomerRequest]) (*connect.Response[customerv1.CreateCustomerResponse], error) {
	id := bson.NewObjectID()

	now := time.Now().Unix()
	data := &DbCustomer{
		Name:           req.Msg.Customer.Name,
		Phone:          req.Msg.Customer.Phone,
		Email:          req.Msg.Customer.Email,
		Tag:            req.Msg.Customer.Tag,
		CreatedAt:      now,
		UpdatedAt:      now,
		OrgId:          req.Msg.OrgId,
		ServiceTypeIds: req.Msg.Customer.ServiceTypeIds,
		Address: Address{
			Street:  req.Msg.Customer.Address.Street,
			City:    req.Msg.Customer.Address.City,
			Country: req.Msg.Customer.Address.Country,
			Zip:     req.Msg.Customer.Address.Zip,
			State:   req.Msg.Customer.Address.State,
		},
		Id: id,
	}

	if _, err := CUSTOMERS.InsertOne(ctx, data); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&customerv1.CreateCustomerResponse{
		Customer: data.ToCustomer(),
	})

	return res, nil
}

func (s *CustomerServer) UpdateCustomer(ctx context.Context, req *connect.Request[customerv1.UpdateCustomerRequest]) (*connect.Response[customerv1.UpdateCustomerResponse], error) {
	id := req.Msg.Customer.Id

	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	now := time.Now().Unix()

	data := DbCustomer{
		Name:      req.Msg.Customer.Name,
		Phone:     req.Msg.Customer.Phone,
		Email:     req.Msg.Customer.Email,
		Tag:       req.Msg.Customer.Tag,
		OrgId:     req.Msg.OrgId,
		UpdatedAt: now,
		Address: Address{
			Street:  req.Msg.Customer.Address.Street,
			City:    req.Msg.Customer.Address.City,
			State:   req.Msg.Customer.Address.State,
			Zip:     req.Msg.Customer.Address.Zip,
			Country: req.Msg.Customer.Address.Country,
		},
	}

	doc := bson.M{"$set": data}

	if _, err := CUSTOMERS.UpdateOne(ctx, bson.M{"_id": objId}, doc); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&customerv1.UpdateCustomerResponse{}), nil
}

func (s *CustomerServer) DeleteCustomer(ctx context.Context, req *connect.Request[customerv1.DeleteCustomerRequest]) (*connect.Response[customerv1.DeleteCustomerResponse], error) {
	id := req.Msg.Id

	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	if _, err := CUSTOMERS.DeleteOne(ctx, bson.M{"_id": objId}); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&customerv1.DeleteCustomerResponse{
		Id: id,
	})

	return res, nil
}

func (s *CustomerServer) GetCustomers(ctx context.Context, req *connect.Request[customerv1.GetCustomersRequest]) (*connect.Response[customerv1.GetCustomersResponse], error) {
	customers, err := GetCustomersByFilter(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	res := connect.NewResponse(&customerv1.GetCustomersResponse{
		Customers: customers,
	})

	return res, nil
}

func (s *CustomerServer) GetCustomersByOrg(ctx context.Context, req *connect.Request[customerv1.GetCustomersByOrgRequest]) (*connect.Response[customerv1.GetCustomersByOrgResponse], error) {
	customers, err := GetCustomersByFilter(ctx, bson.M{"org_id": req.Msg.OrgId})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&customerv1.GetCustomersByOrgResponse{
		Customers: customers,
	}), nil
}
