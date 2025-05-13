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
	Role             int32               `bson:"role"`
	Name             string              `bson:"name"`
	Address          Address             `bson:"address"`
	ProjectIds       []string            `bson:"project_ids"`
	Tags             []string            `bson:"tags"`
	EmploymentState  int32               `bson:"employment_state"`
	Vacations        []DbUserVacation    `bson:"vacations"`
	VacationRequests []DbVacationRequest `bson:"vacation_requests"`
	CreatedAt        int64               `bson:"created_at"`
	UpdatedAt        int64               `bson:"updated_at"`
	OrgId            string              `bson:"org_id"`
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
		OrgId:            u.OrgId,
		Id:               u.Id.Hex(),
		Email:            u.Email,
		Name:             u.Name,
		Address:          address,
		ProjectIds:       u.ProjectIds,
		Tags:             u.Tags,
		Vacations:        vacations,
		VacationRequests: vacationRequests,
		Role:             userv1.UserRole(u.Role),
		CreatedAt:        u.CreatedAt,
		UpdatedAt:        u.UpdatedAt,
	}
}

func GetUserByEmail(ctx context.Context, collection *mongo.Collection, email string) (*userv1.User, error) {
	var dbUser DbUser
	if err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&dbUser); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return dbUser.ToUser(), nil
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

	return dbUser.ToUser(), nil
}

func (s *UserServer) GetUserByEmail(ctx context.Context, req *connect.Request[userv1.GetUserByEmailRequest]) (*connect.Response[userv1.GetUserByEmailResponse], error) {
	userCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_USER)
	orgCollection := mongoClient.Database(DB_NAME).Collection(COLLECTION_ORG)

	user, err := GetUserByEmail(ctx, userCollection, req.Msg.Email)
	if err != nil {
		return nil, err
	}

	org, err := GetOrgById(ctx, orgCollection, user.OrgId)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&userv1.GetUserByEmailResponse{
		User: user,
		Org:  org,
	}), nil
}

func (s *UserServer) GetUserById(ctx context.Context, req *connect.Request[userv1.GetUserByIdRequest]) (*connect.Response[userv1.GetUserByIdResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_USER)

	user, err := GetUserById(ctx, collection, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&userv1.GetUserByIdResponse{
		User: user,
	}), nil
}

func (s *UserServer) GetAllUsers(ctx context.Context, req *connect.Request[userv1.GetAllUsersRequest]) (*connect.Response[userv1.GetAllUsersResponse], error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_USER)

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

		users = append(users, dbUser.ToUser())
	}

	return connect.NewResponse(&userv1.GetAllUsersResponse{
		Users: users,
	}), nil
}
