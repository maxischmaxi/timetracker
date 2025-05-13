package main

import (
	"context"

	"connectrpc.com/connect"
	tagsv1 "github.com/maxischmaxi/ljtime-api/tags/v1"
	"github.com/maxischmaxi/ljtime-api/tags/v1/tagsv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type TagsServer struct {
	tagsv1connect.UnimplementedTagsServiceHandler
	MongoClient *mongo.Client
	DBName      string
}

func (s *TagsServer) GetAllTags(ctx context.Context, req *connect.Request[tagsv1.GetAllTagsRequest]) (*connect.Response[tagsv1.GetAllTagsResponse], error) {
	collection := s.MongoClient.Database(s.DBName).Collection(COLLECTION_TAGS)

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	var tags []string
	for cursor.Next(ctx) {
		var tag string
		if err := cursor.Decode(&tag); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		tags = append(tags, tag)
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return connect.NewResponse(&tagsv1.GetAllTagsResponse{Tags: tags}), nil
}
