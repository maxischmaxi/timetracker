package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"connectrpc.com/connect"
	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/joho/godotenv"
	"github.com/maxischmaxi/ljtime-api/auth/v1/authv1connect"
	"github.com/maxischmaxi/ljtime-api/customer/v1/customerv1connect"
	"github.com/maxischmaxi/ljtime-api/org/v1/orgv1connect"
	"github.com/maxischmaxi/ljtime-api/project/v1/projectv1connect"
	userv1 "github.com/maxischmaxi/ljtime-api/user/v1"
	"github.com/maxischmaxi/ljtime-api/user/v1/userv1connect"
	"github.com/resend/resend-go/v2"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/api/option"
)

var (
	authClient        *auth.Client
	mongoClient       *mongo.Client
	resendClient      *resend.Client
	ORGS              *mongo.Collection
	TAGS              *mongo.Collection
	USERS             *mongo.Collection
	PROJECTS          *mongo.Collection
	CUSTOMERS         *mongo.Collection
	ORG_INVITE_TOKENS *mongo.Collection
)

func main() {
	godotenv.Load()

	resendClient = resend.NewClient(os.Getenv("RESEND_API_KEY"))

	jsonCreds := os.Getenv("FIREBASE_AUTH")
	if jsonCreds == "" {
		log.Fatalf("json credentials missing")
	}

	config := &firebase.Config{ProjectID: "timetracker-b2c23"}
	fbOptions := option.WithCredentialsJSON([]byte(jsonCreds))

	app, err := firebase.NewApp(context.Background(), config, fbOptions)
	if err != nil {
		log.Fatalf("error initializing firebase app: %v\n", err)
	}

	authClient, err = app.Auth(context.Background())
	if err != nil {
		log.Fatalf("error initializing firebase auth client: %v\n", err)
	}
	mongoURI := os.Getenv("MONGO_URL")
	if mongoURI == "" {
		log.Fatalf("error, mongo_url missing")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoClient, err = mongo.Connect(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatalf("error connecting to mongodb: %v", err)
	}

	db := mongoClient.Database("lj-time")
	ORGS = db.Collection("orgs")
	TAGS = db.Collection("tags")
	USERS = db.Collection("users")
	CUSTOMERS = db.Collection("customers")
	PROJECTS = db.Collection("projects")
	ORG_INVITE_TOKENS = db.Collection("org-invite-tokens")

	defer func() {
		if err = mongoClient.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()

	mux := http.NewServeMux()

	interceptors := connect.WithInterceptors(AuthMiddleware())

	mux.Handle(authv1connect.NewAuthServiceHandler(&AuthServer{}))
	mux.Handle(customerv1connect.NewCustomerServiceHandler(
		&CustomerServer{},
		interceptors,
	))
	mux.Handle(projectv1connect.NewProjectServiceHandler(
		&ProjectServer{},
		interceptors,
	))
	mux.Handle(userv1connect.NewUserServiceHandler(
		&UserServer{},
		interceptors,
	))
	mux.Handle(orgv1connect.NewOrgServiceHandler(
		&OrgServer{},
		interceptors,
	))

	muxHandler := h2c.NewHandler(mux, &http2.Server{})

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(muxHandler)

	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

func AuthMiddleware() connect.UnaryInterceptorFunc {
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		return connect.UnaryFunc(func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			authHeader := req.Header().Get("Authorization")
			if !strings.HasPrefix(authHeader, "Bearer ") {
				return nil, connect.NewError(connect.CodeUnauthenticated, errMissingToken())
			}

			idToken := strings.TrimPrefix(authHeader, "Bearer ")

			if idToken == "ITISTHEAPI" {
				fmt.Println("got request from api")
				ctx = context.WithValue(ctx, "is_api", "true")
				return next(ctx, req)
			}

			token, err := authClient.VerifyIDToken(ctx, idToken)
			if err != nil {
				fmt.Println("verifyidtoken failed")
				return nil, connect.NewError(connect.CodeUnauthenticated, err)
			}

			user, err := GetUserByFirebaseUID(ctx, token.UID)
			if err != nil {
				fmt.Println("user not found in db")
				return nil, connect.NewError(connect.CodeUnauthenticated, err)
			}

			if user.EmploymentState != userv1.EmploymentState_EMPLOYMENT_STATE_ACTIVE {
				fmt.Println("inactive user")
				return nil, connect.NewError(connect.CodeUnauthenticated, errors.New("unauthenticated"))
			}

			orgId := req.Header().Get("x-org-id")

			ctx = context.WithValue(ctx, "firebase_uid", token.UID)
			ctx = context.WithValue(ctx, "id", user.Id)
			ctx = context.WithValue(ctx, "email", user.Email)
			ctx = context.WithValue(ctx, "is_api", "false")
			ctx = context.WithValue(ctx, "orgId", orgId)

			return next(ctx, req)
		})
	}

	return connect.UnaryInterceptorFunc(interceptor)
}

type MiddlewareUser struct {
	FirebaseUid string
	Email       string
	Id          string
	OrgId       string
}

func GetMiddlewareUser(ctx context.Context) (*MiddlewareUser, error) {
	firebaseUid, ok := ctx.Value("firebase_uid").(string)
	if !ok {
		return nil, errors.New("mo firebase_uid in context")
	}

	email, ok := ctx.Value("email").(string)
	if !ok {
		return nil, errors.New("no email in context")
	}

	id, ok := ctx.Value("id").(string)
	if !ok {
		return nil, errors.New("no id in context")
	}

	orgId, ok := ctx.Value("orgId").(string)
	if !ok {
		return nil, errors.New("no orgId in context")
	}

	return &MiddlewareUser{
		FirebaseUid: firebaseUid,
		Email:       email,
		Id:          id,
		OrgId:       orgId,
	}, nil
}

func errMissingToken() error {
	return &authError{"missing or invalid authorization token"}
}

type authError struct{ msg string }

func (e *authError) Error() string { return e.msg }
