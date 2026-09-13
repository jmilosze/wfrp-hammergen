package mongodb

import (
	"reflect"
	"testing"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func TestIdsQuery(t *testing.T) {
	validHex1 := "507f1f77bcf86cd799439011"
	validHex2 := "507f1f77bcf86cd799439012"
	oid1, _ := bson.ObjectIDFromHex(validHex1)
	oid2, _ := bson.ObjectIDFromHex(validHex2)

	t.Run("empty input", func(t *testing.T) {
		got, err := idsQuery([]string{})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		expected := bson.M{"_id": bson.M{"$in": bson.A{}}}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})

	t.Run("invalid hex ids only", func(t *testing.T) {
		got, err := idsQuery([]string{"invalid", "not-a-hex"})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		expected := bson.M{"_id": bson.M{"$in": bson.A{}}}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})

	t.Run("valid hex ids", func(t *testing.T) {
		got, err := idsQuery([]string{validHex1, "invalid-skip", validHex2})
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		expected := bson.M{"_id": bson.M{"$in": bson.A{oid1, oid2}}}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})
}

func TestAllAllowedOwnersQuery(t *testing.T) {
	t.Run("anonymous user with no shared accounts", func(t *testing.T) {
		got := allAllowedOwnersQuery([]string{}, []string{})
		expected := bson.M{
			"$or": bson.A{
				bson.M{"visibility": int(warhammer.VisibilityPublic)},
			},
		}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})

	t.Run("authenticated user with no shared accounts", func(t *testing.T) {
		got := allAllowedOwnersQuery([]string{"user1"}, []string{})
		expected := bson.M{
			"$or": bson.A{
				bson.M{"visibility": int(warhammer.VisibilityPublic)},
				bson.M{"ownerid": bson.M{"$in": []string{"user1"}}},
			},
		}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})

	t.Run("authenticated user with shared accounts", func(t *testing.T) {
		got := allAllowedOwnersQuery([]string{"user1"}, []string{"shared1", "shared2"})
		expected := bson.M{
			"$or": bson.A{
				bson.M{"visibility": int(warhammer.VisibilityPublic)},
				bson.M{"ownerid": bson.M{"$in": []string{"user1"}}},
				bson.M{
					"$and": bson.A{
						bson.M{"ownerid": bson.M{"$in": []string{"shared1", "shared2"}}},
						bson.M{"visibility": int(warhammer.VisibilityShared)},
					},
				},
			},
		}
		if !reflect.DeepEqual(got, expected) {
			t.Errorf("got %v, want %v", got, expected)
		}
	})
}
