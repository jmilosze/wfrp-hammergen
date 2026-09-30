package mongodb

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// These tests need a running MongoDB, e.g.
// HAMMERGEN_TEST_MONGODB_URI=mongodb://admin:admin@localhost:27017 go test ./internal/dependencies/mongodb/
func newTestWhDbService(t *testing.T) *WhDbService {
	uri := os.Getenv("HAMMERGEN_TEST_MONGODB_URI")
	if uri == "" {
		t.Skip("HAMMERGEN_TEST_MONGODB_URI not set")
	}

	db, err := NewDbService(uri, fmt.Sprintf("whDbTest%d", time.Now().UnixNano()))
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, db.Client.Database(db.DbName).Drop(context.Background()))
		require.NoError(t, db.Disconnect())
	})

	s, err := NewWhDbService(db, false)
	require.NoError(t, err)
	return s
}

func newTestMutation(id string, name string, visibility warhammer.Visibility) *warhammer.Wh {
	return &warhammer.Wh{
		Id:         id,
		OwnerId:    "owner1",
		Visibility: visibility,
		Object:     &warhammer.Mutation{Name: name, Source: map[warhammer.Source]string{}},
	}
}

type testRawObject struct {
	Name string `bson:"name"`
}

type testRawDoc struct {
	OwnerId    string                   `bson:"ownerid"`
	Visibility warhammer.Visibility     `bson:"visibility"`
	Object     *testRawObject           `bson:"object"`
	Editions   map[string]testRawObject `bson:"editions"`
}

func rawDoc(t *testing.T, s *WhDbService, whType warhammer.WhType, id string) testRawDoc {
	oid, err := bson.ObjectIDFromHex(id)
	require.NoError(t, err)
	var doc testRawDoc
	require.NoError(t, s.Collections[whType].FindOne(context.Background(), bson.M{"_id": oid}).Decode(&doc))
	return doc
}

func TestWhDbCreateStoresContentUnderEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000001"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "mutation 1", warhammer.VisibilityPrivate))
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Nil(t, doc.Object)
	require.Equal(t, "owner1", doc.OwnerId)
	require.Equal(t, map[string]testRawObject{whEdition: {Name: "mutation 1"}}, doc.Editions)

	got, err := s.Retrieve(ctx, warhammer.WhTypeMutation, []string{"owner1"}, nil, warhammer.WhFilter{WhIds: []string{id}})
	require.NoError(t, err)
	require.Len(t, got, 1)
	require.Equal(t, "mutation 1", got[0].Object.(*warhammer.Mutation).Name)
	require.Equal(t, "owner1", got[0].OwnerId)
}

func TestWhDbCreateStoresCharacterUnderObject(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000002"

	character := &warhammer.Wh{
		Id:         id,
		OwnerId:    "owner1",
		Visibility: warhammer.VisibilityPrivate,
		Object:     &warhammer.Character{Name: "character 1"},
	}
	_, err := s.Create(ctx, warhammer.WhTypeCharacter, character)
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeCharacter, id)
	require.Nil(t, doc.Editions)
	require.Equal(t, &testRawObject{Name: "character 1"}, doc.Object)

	got, err := s.Retrieve(ctx, warhammer.WhTypeCharacter, []string{"owner1"}, nil, warhammer.WhFilter{WhIds: []string{id}})
	require.NoError(t, err)
	require.Len(t, got, 1)
	require.Equal(t, "character 1", got[0].Object.(*warhammer.Character).Name)
}

func TestWhDbUpdateKeepsOtherEditions(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000003"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "mutation 4e", warhammer.VisibilityPrivate))
	require.NoError(t, err)

	oid, err := bson.ObjectIDFromHex(id)
	require.NoError(t, err)
	_, err = s.Collections[warhammer.WhTypeMutation].UpdateOne(ctx, bson.M{"_id": oid}, bson.M{"$set": bson.M{"editions.5e": bson.M{"name": "mutation 5e"}}})
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeMutation, newTestMutation(id, "mutation 4e updated", warhammer.VisibilityPublic), "owner1")
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, map[string]testRawObject{whEdition: {Name: "mutation 4e updated"}, "5e": {Name: "mutation 5e"}}, doc.Editions)
	require.Nil(t, doc.Object)
	require.Equal(t, warhammer.VisibilityPublic, doc.Visibility)
	require.Equal(t, "owner1", doc.OwnerId)
}

func TestWhDbUpdateRequiresOwner(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000004"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "mutation 1", warhammer.VisibilityPrivate))
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeMutation, newTestMutation(id, "mutation 1 updated", warhammer.VisibilityPrivate), "owner2")
	require.Error(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, "mutation 1", doc.Editions[whEdition].Name)
}

func TestWhDbRetrieveSkipsDocumentsWithoutEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id4e := "700000000000000000000005"
	id5eOnly := "700000000000000000000006"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id4e, "mutation 4e", warhammer.VisibilityPublic))
	require.NoError(t, err)

	oid5eOnly, err := bson.ObjectIDFromHex(id5eOnly)
	require.NoError(t, err)
	_, err = s.Collections[warhammer.WhTypeMutation].InsertOne(ctx, bson.M{
		"_id":        oid5eOnly,
		"ownerid":    "owner1",
		"visibility": int(warhammer.VisibilityPublic),
		"editions":   bson.M{"5e": bson.M{"name": "mutation 5e"}},
	})
	require.NoError(t, err)

	got, err := s.Retrieve(ctx, warhammer.WhTypeMutation, nil, nil, warhammer.WhFilter{})
	require.NoError(t, err)
	require.Len(t, got, 1)
	require.Equal(t, id4e, got[0].Id)
}

func TestWhDbRetrieveCareersBySkillAndTalent(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()

	newCareer := func(id string, level warhammer.CareerLevel) *warhammer.Wh {
		career := &warhammer.Career{Name: "career " + id, Level2: level}
		career.Init()
		return &warhammer.Wh{Id: id, OwnerId: "owner1", Visibility: warhammer.VisibilityPrivate, Object: career}
	}
	withSkill := "700000000000000000000007"
	withTalent := "700000000000000000000008"
	levelNotExisting := "700000000000000000000009"

	for _, career := range []*warhammer.Wh{
		newCareer(withSkill, warhammer.CareerLevel{Exists: true, Skills: []string{"skill1"}}),
		newCareer(withTalent, warhammer.CareerLevel{Exists: true, Talents: []string{"talent1"}}),
		newCareer(levelNotExisting, warhammer.CareerLevel{Exists: false, Skills: []string{"skill1"}, Talents: []string{"talent1"}}),
	} {
		_, err := s.Create(ctx, warhammer.WhTypeCareer, career)
		require.NoError(t, err)
	}

	got, err := s.Retrieve(ctx, warhammer.WhTypeCareer, []string{"owner1"}, nil, warhammer.WhFilter{SkillIds: []string{"skill1"}})
	require.NoError(t, err)
	require.Len(t, got, 1)
	require.Equal(t, withSkill, got[0].Id)

	got, err = s.Retrieve(ctx, warhammer.WhTypeCareer, []string{"owner1"}, nil, warhammer.WhFilter{TalentIds: []string{"talent1"}})
	require.NoError(t, err)
	require.Len(t, got, 1)
	require.Equal(t, withTalent, got[0].Id)
}
