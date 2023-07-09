package mongodb

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type DbService struct {
	Client *mongo.Client
	DbName string
}

func NewDbService(uri string, dbName string) *DbService {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	return &DbService{Client: client, DbName: dbName}
}

func (db *DbService) Disconnect() {
	if err := db.Client.Disconnect(context.TODO()); err != nil {
		log.Fatal(err)
	}
}
