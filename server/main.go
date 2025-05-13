package main

import (
	"context"
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
	"github.com/maxischmaxi/ljtime-api/customer/v1/customerv1connect"
	"github.com/maxischmaxi/ljtime-api/job/v1/jobv1connect"
	"github.com/maxischmaxi/ljtime-api/project/v1/projectv1connect"
	"github.com/maxischmaxi/ljtime-api/user/v1/userv1connect"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"google.golang.org/api/option"
)

const (
	COLLECTION_CUSTOMER = "customers"
	COLLECTION_PROJECT  = "projects"
	COLLECTION_JOB      = "jobs"
	COLLECTION_USER     = "users"
	COLLECTION_TAGS     = "tags"
	COLLECTION_ORG      = "orgs"
)

const DB_NAME = "lj-time"

var mongoClient *mongo.Client
var authClient *auth.Client

func main() {
	godotenv.Load()

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

	defer func() {
		if err = mongoClient.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()

	mux := http.NewServeMux()

	interceptors := connect.WithInterceptors(AuthMiddleware())

	mux.Handle(customerv1connect.NewCustomerServiceHandler(
		&CustomerServer{},
		interceptors,
	))
	mux.Handle(projectv1connect.NewProjectServiceHandler(
		&ProjectServer{},
		interceptors,
	))
	mux.Handle(jobv1connect.NewJobServiceHandler(
		&JobServer{},
		interceptors,
	))
	mux.Handle(userv1connect.NewUserServiceHandler(
		&UserServer{},
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
			token, err := authClient.VerifyIDToken(ctx, idToken)
			if err != nil {
				fmt.Println("verifyidtoken failed")
				return nil, connect.NewError(connect.CodeUnauthenticated, err)
			}

			ctx = context.WithValue(ctx, "userID", token.UID)
			ctx = context.WithValue(ctx, "email", token.Claims["email"])

			return next(ctx, req)
		})
	}

	return connect.UnaryInterceptorFunc(interceptor)
}

func errMissingToken() error {
	return &authError{"missing or invalid authorization token"}
}

type authError struct{ msg string }

func (e *authError) Error() string { return e.msg }
