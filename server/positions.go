package main

type DbDiscount struct {
	Type  int32   `bson:"type"`
	Value float32 `bson:"value"`
}

type DbPosition struct {
	Name        string  `bson:"name"`
	Description string  `bson:"description"`
	Count       int32   `bson:"count"`
	Price       float32 `bson:"price"`
	Unit        int32   `bson:"unit"`
}
