package mongodb

import (
	"context"
	"fmt"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// DecodeFailure is a document the API cannot read.
type DecodeFailure struct {
	Collection string
	Id         string
	Err        error
}

// FindDecodeFailures decodes every content and character document, the generation props and every user with the
// types the API reads them with. A document of the wrong type breaks every list request that includes it, so data
// scripts are checked with this before moving on to the next environment (docs/operations.md).
func FindDecodeFailures(ctx context.Context, db *DbService) (checked int, failures []DecodeFailure, err error) {
	database := db.Client.Database(db.DbName)

	check := func(coll *mongo.Collection, filter bson.M, decode func(bson.Raw) error) error {
		n, f, err := decodeAll(ctx, coll, filter, decode)
		checked += n
		failures = append(failures, f...)
		return err
	}

	for _, t := range warhammer.WhCoreTypes {
		err := check(database.Collection(string(t)), bson.M{}, func(raw bson.Raw) error {
			var doc whDocRead
			if err := bson.Unmarshal(raw, &doc); err != nil {
				return err
			}
			_, err := whDocToWh(&doc, t, "")
			return err
		})
		if err != nil {
			return checked, failures, err
		}
	}

	genPropsNames := bson.A{}
	for _, e := range warhammer.Editions {
		genPropsNames = append(genPropsNames, warhammer.GenPropsName(e))
	}
	err = check(database.Collection(warhammer.WhTypeOther), bson.M{"name": bson.M{"$in": genPropsNames}}, func(raw bson.Raw) error {
		var genProps warhammer.GenProps
		return bson.Unmarshal(raw, &genProps)
	})
	if err != nil {
		return checked, failures, err
	}

	err = check(database.Collection(userCollectionName), bson.M{}, func(raw bson.Raw) error {
		var u userDocWrite
		return bson.Unmarshal(raw, &u)
	})
	return checked, failures, err
}

func decodeAll(ctx context.Context, coll *mongo.Collection, filter bson.M, decode func(bson.Raw) error) (int, []DecodeFailure, error) {
	cur, err := coll.Find(ctx, filter)
	if err != nil {
		return 0, nil, fmt.Errorf("failed to read %s: %w", coll.Name(), err)
	}
	defer cur.Close(ctx)

	checked := 0
	var failures []DecodeFailure
	for cur.Next(ctx) {
		checked++
		if err := decode(cur.Current); err != nil {
			id := cur.Current.Lookup("_id").String()
			if oid, ok := cur.Current.Lookup("_id").ObjectIDOK(); ok {
				id = oid.Hex()
			}
			failures = append(failures, DecodeFailure{Collection: coll.Name(), Id: id, Err: err})
		}
	}
	if err := cur.Err(); err != nil {
		return checked, failures, fmt.Errorf("failed to read %s: %w", coll.Name(), err)
	}
	return checked, failures, nil
}
