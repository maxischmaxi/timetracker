package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/maxischmaxi/ljtime-api/customer/v1/customerv1connect"
	"github.com/maxischmaxi/ljtime-api/job/v1/jobv1connect"
	"github.com/maxischmaxi/ljtime-api/project/v1/projectv1connect"
	"github.com/maxischmaxi/ljtime-api/user/v1/userv1connect"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const (
	COLLECTION_CUSTOMER = "customers"
	COLLECTION_PROJECT  = "projects"
	COLLECTION_JOB      = "jobs"
	COLLECTION_USER     = "users"
	COLLECTION_TAGS     = "tags"
)

const DB_NAME = "lj-time"

func main() {
	mongoURI := os.Getenv("MONGO_URL")
	if mongoURI == "" {
		fmt.Println("MONGO_URL not set, using default")
		mongoURI = "mongodb://root:example@localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	defer func() {
		if err = client.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()

	customerServer := &CustomerServer{
		MongoClient: client,
		DBName:      DB_NAME,
	}

	projectServer := &ProjectServer{
		MongoClient: client,
		DBName:      DB_NAME,
	}

	jobServer := &JobServer{
		MongoClient: client,
		DBName:      DB_NAME,
	}

	userServer := &UserServer{
		MongoClient: client,
		DBName:      DB_NAME,
	}

	mux := http.NewServeMux()

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(h2c.NewHandler(mux, &http2.Server{}))

	customerPath, customerHandler := customerv1connect.NewCustomerServiceHandler(customerServer)
	projectPath, projectHandler := projectv1connect.NewProjectServiceHandler(projectServer)
	jobPath, jobHandler := jobv1connect.NewJobServiceHandler(jobServer)
	userPath, userHandler := userv1connect.NewUserServiceHandler(userServer)

	mux.Handle(customerPath, customerHandler)
	mux.Handle(projectPath, projectHandler)
	mux.Handle(jobPath, jobHandler)
	mux.Handle(userPath, userHandler)

	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
