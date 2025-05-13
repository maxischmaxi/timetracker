package main

type Address struct {
	Street  string `json:"street" bson:"street"`
	City    string `json:"city" bson:"city"`
	State   string `json:"state" bson:"state"`
	Zip     string `json:"zip" bson:"zip"`
	Country string `json:"country" bson:"country"`
}
