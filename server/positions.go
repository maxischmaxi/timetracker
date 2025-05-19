package main

import "go.mongodb.org/mongo-driver/v2/bson"

type DbDiscount struct {
	Id    bson.ObjectID `bson:"_id"`
	Type  int32         `bson:"type"`
	Value float32       `bson:"value"`
}

type DbPosition struct {
	Id          bson.ObjectID `bson:"_id"`
	Name        string        `bson:"name"`
	Description string        `bson:"description"`
	Count       int32         `bson:"count"`
	Price       float32       `bson:"price"`
	Unit        int32         `bson:"unit"`
}
