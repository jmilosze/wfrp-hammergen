package mongodb

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type DbService struct {
	Client *mongo.Client
	DbName string
}

func NewDbService(uri string, dbName string) (*DbService, error) {
	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to mongodb: %w", err)
	}

	return &DbService{Client: client, DbName: dbName}, nil
}

func (db *DbService) Disconnect() error {
	if err := db.Client.Disconnect(context.TODO()); err != nil {
		return fmt.Errorf("failed to disconnect from mongodb: %w", err)
	}
	return nil
}
