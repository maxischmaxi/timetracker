package main

import (
	"context"
	"time"

	"connectrpc.com/connect"
	"firebase.google.com/go/v4/auth"
	customerv1 "github.com/maxischmaxi/ljtime-api/customer/v1"
	userv1 "github.com/maxischmaxi/ljtime-api/user/v1"
	"github.com/maxischmaxi/ljtime-api/user/v1/userv1connect"
	"github.com/sethvargo/go-password/password"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type UserServer struct {
	userv1connect.UnimplementedUserServiceHandler
}

type DbUserVacation struct {
	Year              int32 `bson:"year"`
	Days              int32 `bson:"days"`
	SpecialDays       int32 `bson:"special_days"`
	SickDaysTaken     int32 `bson:"sick_days_taken"`
	VacationDaysTaken int32 `bson:"vacation_days_taken"`
}

type DbVacationRequest struct {
	StartDate int64  `bson:"start_date"`
	EndDate   int64  `bson:"end_date"`
	Days      int32  `bson:"days"`
	Comment   string `bson:"comment"`
}

type DbUser struct {
	Id               bson.ObjectID       `bson:"_id"`
	Email            string              `bson:"email"`
	Name             string              `bson:"name"`
	Address          Address             `bson:"address"`
	ProjectIds       []string            `bson:"project_ids"`
	Tags             []string            `bson:"tags"`
	EmploymentState  int32               `bson:"employment_state"`
	Vacations        []DbUserVacation    `bson:"vacations"`
	VacationRequests []DbVacationRequest `bson:"vacation_requests"`
	CreatedAt        int64               `bson:"created_at"`
	UpdatedAt        int64               `bson:"updated_at"`
	OrgIds           []string            `bson:"org_ids"`
	FirebaseUid      string              `bson:"firebase_uid"`
}

func FromUser(user *userv1.User) *DbUser {
	vacations := make([]DbUserVacation, len(user.Vacations))
	vacationRequests := make([]DbVacationRequest, len(user.VacationRequests))

	for _, v := range user.Vacations {
		vacations = append(vacations, DbUserVacation{
			Year:              v.Year,
			Days:              v.Days,
			SpecialDays:       v.SpecialDays,
			SickDaysTaken:     v.SickDaysTaken,
			VacationDaysTaken: v.VacationDaysTaken,
		})
	}

	for _, v := range user.VacationRequests {
		vacationRequests = append(vacationRequests, DbVacationRequest{
			StartDate: v.StartDate,
			EndDate:   v.EndDate,
			Days:      v.Days,
			Comment:   v.Comment,
		})
	}

	address := &Address{
		Street:  user.Address.Street,
		City:    user.Address.City,
		State:   user.Address.State,
		Zip:     user.Address.Zip,
		Country: user.Address.Country,
	}

	id, err := bson.ObjectIDFromHex(user.Id)
	if err != nil {
		return nil
	}

	return &DbUser{
		EmploymentState:  int32(user.EmploymentState),
		Address:          *address,
		VacationRequests: vacationRequests,
		Id:               id,
		Vacations:        vacations,
		Tags:             user.Tags,
		Email:            user.Email,
		Name:             user.Name,
		ProjectIds:       user.ProjectIds,
		CreatedAt:        user.CreatedAt,
		UpdatedAt:        user.UpdatedAt,
		OrgIds:           user.OrgIds,
		FirebaseUid:      user.FirebaseUid,
	}
}

func (u *DbUser) ToUser() *userv1.User {
	vacations := make([]*userv1.UserVacation, len(u.Vacations))
	vacationRequests := make([]*userv1.VacationRequest, len(u.VacationRequests))

	for _, v := range u.Vacations {
		vacations = append(vacations, &userv1.UserVacation{
			Year:              v.Year,
			Days:              v.Days,
			SpecialDays:       v.SpecialDays,
			SickDaysTaken:     v.SickDaysTaken,
			VacationDaysTaken: v.VacationDaysTaken,
		})
	}

	for _, v := range u.VacationRequests {
		vacationRequests = append(vacationRequests, &userv1.VacationRequest{
			StartDate: v.StartDate,
			EndDate:   v.EndDate,
			Days:      v.Days,
			Comment:   v.Comment,
		})
	}

	address := &customerv1.Address{
		Street:  u.Address.Street,
		City:    u.Address.City,
		State:   u.Address.State,
		Zip:     u.Address.Zip,
		Country: u.Address.Country,
	}

	return &userv1.User{
		EmploymentState:  userv1.EmploymentState(u.EmploymentState),
		Id:               u.Id.Hex(),
		Email:            u.Email,
		Name:             u.Name,
		Address:          address,
		ProjectIds:       u.ProjectIds,
		Tags:             u.Tags,
		Vacations:        vacations,
		VacationRequests: vacationRequests,
		CreatedAt:        u.CreatedAt,
		UpdatedAt:        u.UpdatedAt,
		OrgIds:           u.OrgIds,
		FirebaseUid:      u.FirebaseUid,
	}
}

func GetUserByFirebaseUID(ctx context.Context, uid string) (*userv1.User, error) {
	var user DbUser

	if err := USERS.FindOne(ctx, bson.M{"firebase_uid": uid}).Decode(&user); err != nil {
		return nil, err
	}

	u := user.ToUser()

	return u, nil
}

func GetUserByEmail(ctx context.Context, email string) (*userv1.User, error) {
	var dbUser DbUser
	if err := USERS.FindOne(ctx, bson.M{"email": email}).Decode(&dbUser); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return dbUser.ToUser(), nil
}

func GetUserById(ctx context.Context, id string) (*userv1.User, error) {
	objId, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, err)
	}

	var dbUser DbUser
	if err := USERS.FindOne(ctx, bson.M{"_id": objId}).Decode(&dbUser); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return dbUser.ToUser(), nil
}

func (s *UserServer) GetUserByEmail(ctx context.Context, req *connect.Request[userv1.GetUserByEmailRequest]) (*connect.Response[userv1.GetUserByEmailResponse], error) {
	user, err := GetUserByEmail(ctx, req.Msg.Email)
	if err != nil {
		return nil, err
	}

	orgs, err := GetOrgsByOrgIds(ctx, user.OrgIds)
	if err != nil {
		return nil, err
	}

	return connect.NewResponse(&userv1.GetUserByEmailResponse{
		User: user,
		Orgs: orgs,
	}), nil
}

func (s *UserServer) GetUserById(ctx context.Context, req *connect.Request[userv1.GetUserByIdRequest]) (*connect.Response[userv1.GetUserByIdResponse], error) {
	user, err := GetUserById(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&userv1.GetUserByIdResponse{
		User: user,
	}), nil
}

func (s *UserServer) GetAllUsers(ctx context.Context, req *connect.Request[userv1.GetAllUsersRequest]) (*connect.Response[userv1.GetAllUsersResponse], error) {
	cursor, err := USERS.Find(ctx, bson.M{})
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

		users = append(users, dbUser.ToUser())
	}

	return connect.NewResponse(&userv1.GetAllUsersResponse{
		Users: users,
	}), nil
}

func (s *UserServer) CreateUser(ctx context.Context, req *connect.Request[userv1.CreateUserRequest]) (*connect.Response[userv1.CreateUserResponse], error) {
	password, err := password.Generate(64, 10, 10, false, false)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	firebaseUser := (&auth.UserToCreate{}).
		Email(req.Msg.User.Email).
		EmailVerified(false).
		Password(password).
		DisplayName(req.Msg.User.Name)

	u, err := authClient.CreateUser(ctx, firebaseUser)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	now := time.Now().Unix()

	user := DbUser{
		Id:    bson.NewObjectID(),
		Email: req.Msg.User.Email,
		Name:  req.Msg.User.Name,
		Address: Address{
			Street:  req.Msg.User.Address.Street,
			City:    req.Msg.User.Address.City,
			Zip:     req.Msg.User.Address.Zip,
			State:   req.Msg.User.Address.State,
			Country: req.Msg.User.Address.Country,
		},
		ProjectIds:       []string{},
		Tags:             req.Msg.User.Tags,
		EmploymentState:  int32(userv1.EmploymentState_EMPLOYMENT_STATE_ACTIVE.Number()),
		Vacations:        []DbUserVacation{},
		VacationRequests: []DbVacationRequest{},
		CreatedAt:        now,
		UpdatedAt:        now,
		OrgIds:           []string{req.Msg.OrgId},
		FirebaseUid:      u.UID,
	}

	_, err = USERS.InsertOne(ctx, user)
	if err != nil {
		fErr := authClient.DeleteUser(ctx, u.UID)
		if fErr != nil {
			return nil, connect.NewError(connect.CodeInternal, fErr)
		}
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	tags, err := GetAllTags(ctx)
	if err != nil {
		return connect.NewResponse(&userv1.CreateUserResponse{
			User: user.ToUser(),
		}), nil
	}

	for _, t := range req.Msg.User.Tags {
		found := false

		for _, tag := range tags {
			if t == tag.Tag {
				found = true
				break
			}
		}

		if !found {
			err := InsertTag(ctx, t)
			if err != nil {
				return connect.NewResponse(&userv1.CreateUserResponse{
					User: user.ToUser(),
				}), nil
			}
		}
	}

	return connect.NewResponse(&userv1.CreateUserResponse{
		User: user.ToUser(),
	}), nil
}

func (s *UserServer) UpdateUser(ctx context.Context, req *connect.Request[userv1.UpdateUserRequest]) (*connect.Response[userv1.UpdateUserResponse], error) {
	user, err := GetUserById(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	now := time.Now().Unix()

	dbUser := FromUser(user)
	dbUser.Name = req.Msg.User.Name

	dbUser.Address.Street = req.Msg.User.Address.Street
	dbUser.Address.City = req.Msg.User.Address.City
	dbUser.Address.Country = req.Msg.User.Address.Country
	dbUser.Address.Zip = req.Msg.User.Address.Zip
	dbUser.Address.State = req.Msg.User.Address.State

	dbUser.ProjectIds = req.Msg.User.ProjectIds
	dbUser.Tags = req.Msg.User.Tags
	dbUser.UpdatedAt = now

	update := bson.M{
		"$set": dbUser,
	}

	id, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	_, err = USERS.UpdateByID(ctx, id, update)
	if err != nil {
		return nil, err
	}

	response := &userv1.UpdateUserResponse{}

	return connect.NewResponse(response), nil
}

func (s *UserServer) SetUserActiveState(ctx context.Context, req *connect.Request[userv1.SetUserActiveStateRequest]) (*connect.Response[userv1.SetUserActiveStateResponse], error) {
	user, err := GetUserById(ctx, req.Msg.Id)
	if err != nil {
		return nil, err
	}

	now := time.Now().Unix()

	dbUser := FromUser(user)
	dbUser.EmploymentState = int32(req.Msg.State)
	dbUser.UpdatedAt = now

	update := bson.M{
		"$set": dbUser,
	}

	id, err := bson.ObjectIDFromHex(req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	_, err = USERS.UpdateByID(ctx, id, update)
	if err != nil {
		return nil, err
	}

	response := &userv1.SetUserActiveStateResponse{
		State: req.Msg.State,
	}

	return connect.NewResponse(response), nil
}
