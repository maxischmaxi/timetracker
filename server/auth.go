package main

import (
	"context"
	"time"

	"connectrpc.com/connect"
	"firebase.google.com/go/v4/auth"
	authv1 "github.com/maxischmaxi/ljtime-api/auth/v1"
	"github.com/maxischmaxi/ljtime-api/auth/v1/authv1connect"
	userv1 "github.com/maxischmaxi/ljtime-api/user/v1"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type AuthServer struct {
	authv1connect.UnimplementedAuthServiceHandler
}

func (s *AuthServer) Register(ctx context.Context, req *connect.Request[authv1.RegisterRequest]) (*connect.Response[authv1.RegisterResponse], error) {
	user := (&auth.UserToCreate{}).
		Email(req.Msg.Email).
		EmailVerified(false).
		Password(req.Msg.Password).
		DisplayName(req.Msg.Name)

	firebaseUser, err := authClient.CreateUser(ctx, user)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	now := time.Now().Unix()

	orgIds := []string{}

	if len(req.Msg.OrgId) > 0 {
		orgIds = append(orgIds, req.Msg.OrgId)
	}

	dbUser := DbUser{
		Id:               bson.NewObjectID(),
		Email:            req.Msg.Email,
		Name:             req.Msg.Name,
		ProjectIds:       []string{},
		EmploymentState:  int32(userv1.EmploymentState_EMPLOYMENT_STATE_ACTIVE.Number()),
		Vacations:        []DbUserVacation{},
		VacationRequests: []DbVacationRequest{},
		CreatedAt:        now,
		UpdatedAt:        now,
		OrgIds:           orgIds,
		FirebaseUid:      firebaseUser.UID,
		Tags:             []string{},
	}

	if _, err = USERS.InsertOne(ctx, dbUser); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&authv1.RegisterResponse{}), nil
}
