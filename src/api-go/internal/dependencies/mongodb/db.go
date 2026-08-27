package mongodb

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type DbService struct {
	Client *mongo.Client
	DbName string
}

func NewDbService(uri string, dbName string) *DbService {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
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
