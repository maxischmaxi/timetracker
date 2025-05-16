package main

import (
	"context"

	"connectrpc.com/connect"
	tagsv1 "github.com/maxischmaxi/ljtime-api/tags/v1"
	"github.com/maxischmaxi/ljtime-api/tags/v1/tagsv1connect"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type TagsServer struct {
	tagsv1connect.UnimplementedTagsServiceHandler
}

type DbTag struct {
	Id  bson.ObjectID `bson:"_id"`
	Tag string        `bson:"tag"`
}

func GetAllTags(ctx context.Context) ([]DbTag, error) {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_TAGS)

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}
	defer cursor.Close(ctx)

	var tagObjects []DbTag
	for cursor.Next(ctx) {
		var tag DbTag
		if err := cursor.Decode(&tag); err != nil {
			return nil, connect.NewError(connect.CodeInternal, err)
		}
		tagObjects = append(tagObjects, tag)
	}

	if err := cursor.Err(); err != nil {
		return nil, connect.NewError(connect.CodeInternal, err)
	}

	return tagObjects, nil
}

func InsertTag(ctx context.Context, tag string) error {
	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_TAGS)

	dbTag := &DbTag{
		Id:  bson.NewObjectID(),
		Tag: tag,
	}

	_, err := collection.InsertOne(ctx, dbTag)
	if err != nil {
		return err
	}

	return nil
}

func DeleteTag(ctx context.Context, id string) error {
	i, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	collection := mongoClient.Database(DB_NAME).Collection(COLLECTION_TAGS)

	_, err = collection.DeleteOne(ctx, bson.M{"_id": i})
	if err != nil {
		return err
	}

	return nil
}

func (s *TagsServer) GetAllTags(ctx context.Context, req *connect.Request[tagsv1.GetAllTagsRequest]) (*connect.Response[tagsv1.GetAllTagsResponse], error) {
	dbTags, err := GetAllTags(ctx)
	if err != nil {
		return nil, err
	}

	tags := []string{}

	for _, t := range dbTags {
		tags = append(tags, t.Tag)
	}

	return connect.NewResponse(&tagsv1.GetAllTagsResponse{Tags: tags}), nil
}
