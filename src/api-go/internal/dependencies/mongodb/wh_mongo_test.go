package mongodb

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	d "github.com/jmilosze/wfrp-hammergen-go/internal/domain"
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

// newTestMutation builds a mutation document with one variant per given edition, named "<name> <edition>".
func newTestMutation(id string, name string, visibility warhammer.Visibility, editions ...warhammer.Edition) *warhammer.Wh {
	variants := map[warhammer.Edition]warhammer.WhObject{}
	for _, e := range editions {
		variants[e] = &warhammer.Mutation{Name: name + " " + string(e), Source: map[warhammer.Source]string{}}
	}
	return &warhammer.Wh{Id: id, OwnerId: "owner1", Visibility: visibility, Editions: variants}
}

func newTestCharacter(id string, name string, e warhammer.Edition) *warhammer.Wh {
	return &warhammer.Wh{
		Id:         id,
		OwnerId:    "owner1",
		Visibility: warhammer.VisibilityPrivate,
		Object:     &warhammer.Character{Edition: e, Name: name},
	}
}

type testRawObject struct {
	Edition warhammer.Edition `bson:"edition"`
	Name    string            `bson:"name"`
}

type testRawDoc struct {
	OwnerId    string                              `bson:"ownerid"`
	Visibility warhammer.Visibility                `bson:"visibility"`
	Edition    warhammer.Edition                   `bson:"edition"`
	Object     *testRawObject                      `bson:"object"`
	Editions   map[warhammer.Edition]testRawObject `bson:"editions"`
}

func objectId(t *testing.T, id string) bson.ObjectID {
	oid, err := bson.ObjectIDFromHex(id)
	require.NoError(t, err)
	return oid
}

func rawDoc(t *testing.T, s *WhDbService, whType warhammer.WhType, id string) testRawDoc {
	var doc testRawDoc
	require.NoError(t, s.Collections[whType].FindOne(context.Background(), bson.M{"_id": objectId(t, id)}).Decode(&doc))
	return doc
}

func rawDocCount(t *testing.T, s *WhDbService, whType warhammer.WhType, id string) int64 {
	n, err := s.Collections[whType].CountDocuments(context.Background(), bson.M{"_id": objectId(t, id)})
	require.NoError(t, err)
	return n
}

func mutationNames(t *testing.T, w *warhammer.Wh) map[warhammer.Edition]string {
	require.Nil(t, w.Object)
	names := map[warhammer.Edition]string{}
	for e, obj := range w.Editions {
		names[e] = obj.(*warhammer.Mutation).Name
	}
	return names
}

func TestWhDbCreateStoresContentEditions(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000001"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e, warhammer.Edition5e))
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Nil(t, doc.Object)
	require.Empty(t, doc.Edition)
	require.Equal(t, "owner1", doc.OwnerId)
	require.Equal(t, map[warhammer.Edition]testRawObject{warhammer.Edition4e: {Name: "m 4e"}, warhammer.Edition5e: {Name: "m 5e"}}, doc.Editions)
}

func TestWhDbRetrieveContentByEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	idBoth := "700000000000000000000002"
	id5eOnly := "700000000000000000000003"

	for _, w := range []*warhammer.Wh{
		newTestMutation(idBoth, "both", warhammer.VisibilityPublic, warhammer.Edition4e, warhammer.Edition5e),
		newTestMutation(id5eOnly, "only", warhammer.VisibilityPublic, warhammer.Edition5e),
	} {
		_, err := s.Create(ctx, warhammer.WhTypeMutation, w)
		require.NoError(t, err)
	}

	byEdition := func(e warhammer.Edition) map[string]map[warhammer.Edition]string {
		got, err := s.Retrieve(ctx, warhammer.WhTypeMutation, nil, nil, warhammer.WhFilter{Edition: e})
		require.NoError(t, err)
		res := map[string]map[warhammer.Edition]string{}
		for _, w := range got {
			res[w.Id] = mutationNames(t, w)
		}
		return res
	}

	require.Equal(t, map[string]map[warhammer.Edition]string{
		idBoth:   {warhammer.Edition4e: "both 4e", warhammer.Edition5e: "both 5e"},
		id5eOnly: {warhammer.Edition5e: "only 5e"},
	}, byEdition(""))
	require.Equal(t, map[string]map[warhammer.Edition]string{
		idBoth: {warhammer.Edition4e: "both 4e"},
	}, byEdition(warhammer.Edition4e))
	require.Equal(t, map[string]map[warhammer.Edition]string{
		idBoth:   {warhammer.Edition5e: "both 5e"},
		id5eOnly: {warhammer.Edition5e: "only 5e"},
	}, byEdition(warhammer.Edition5e))
}

func TestWhDbCharacterStoresEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id4e := "700000000000000000000004"
	id5e := "700000000000000000000005"

	for _, w := range []*warhammer.Wh{newTestCharacter(id4e, "c 4e", warhammer.Edition4e), newTestCharacter(id5e, "c 5e", warhammer.Edition5e)} {
		_, err := s.Create(ctx, warhammer.WhTypeCharacter, w)
		require.NoError(t, err)
	}

	doc := rawDoc(t, s, warhammer.WhTypeCharacter, id4e)
	require.Nil(t, doc.Editions)
	require.Empty(t, doc.Edition)
	require.Equal(t, &testRawObject{Edition: warhammer.Edition4e, Name: "c 4e"}, doc.Object)

	byEdition := func(e warhammer.Edition) map[string]warhammer.Edition {
		got, err := s.Retrieve(ctx, warhammer.WhTypeCharacter, []string{"owner1"}, nil, warhammer.WhFilter{Edition: e})
		require.NoError(t, err)
		res := map[string]warhammer.Edition{}
		for _, w := range got {
			require.Nil(t, w.Editions)
			character := w.Object.(*warhammer.Character)
			require.Equal(t, "c "+string(character.Edition), character.Name)
			res[w.Id] = character.Edition
		}
		return res
	}

	require.Equal(t, map[string]warhammer.Edition{id4e: warhammer.Edition4e, id5e: warhammer.Edition5e}, byEdition(""))
	require.Equal(t, map[string]warhammer.Edition{id4e: warhammer.Edition4e}, byEdition(warhammer.Edition4e))
	require.Equal(t, map[string]warhammer.Edition{id5e: warhammer.Edition5e}, byEdition(warhammer.Edition5e))
}

func TestWhDbUpdateMergesEditions(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000006"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e, warhammer.Edition5e))
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeMutation, newTestMutation(id, "updated", warhammer.VisibilityPublic, warhammer.Edition4e), "owner1")
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, map[warhammer.Edition]testRawObject{warhammer.Edition4e: {Name: "updated 4e"}, warhammer.Edition5e: {Name: "m 5e"}}, doc.Editions)
	require.Equal(t, warhammer.VisibilityPublic, doc.Visibility)
	require.Equal(t, "owner1", doc.OwnerId)
}

func TestWhDbUpdateAddsEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000007"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e))
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeMutation, newTestMutation(id, "new", warhammer.VisibilityPrivate, warhammer.Edition5e), "owner1")
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, map[warhammer.Edition]testRawObject{warhammer.Edition4e: {Name: "m 4e"}, warhammer.Edition5e: {Name: "new 5e"}}, doc.Editions)
}

func TestWhDbUpdateRequiresOwner(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000008"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e))
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeMutation, newTestMutation(id, "updated", warhammer.VisibilityPrivate, warhammer.Edition4e), "owner2")
	require.ErrorIs(t, err, d.ErrNotFound)

	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, "m 4e", doc.Editions[warhammer.Edition4e].Name)
}

func TestWhDbUpdateCharacter(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000009"

	_, err := s.Create(ctx, warhammer.WhTypeCharacter, newTestCharacter(id, "c", warhammer.Edition4e))
	require.NoError(t, err)

	_, err = s.Update(ctx, warhammer.WhTypeCharacter, newTestCharacter(id, "c updated", warhammer.Edition4e), "owner1")
	require.NoError(t, err)

	doc := rawDoc(t, s, warhammer.WhTypeCharacter, id)
	require.Empty(t, doc.Edition)
	require.Equal(t, &testRawObject{Edition: warhammer.Edition4e, Name: "c updated"}, doc.Object)
	require.Nil(t, doc.Editions)
}

func TestWhDbDeleteEdition(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000010"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e, warhammer.Edition5e))
	require.NoError(t, err)

	require.NoError(t, s.Delete(ctx, warhammer.WhTypeMutation, warhammer.Edition5e, id, "owner1"))
	doc := rawDoc(t, s, warhammer.WhTypeMutation, id)
	require.Equal(t, map[warhammer.Edition]testRawObject{warhammer.Edition4e: {Name: "m 4e"}}, doc.Editions)

	require.NoError(t, s.Delete(ctx, warhammer.WhTypeMutation, warhammer.Edition4e, id, "owner1"))
	require.Zero(t, rawDocCount(t, s, warhammer.WhTypeMutation, id))
}

func TestWhDbDeleteWholeDocument(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000011"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e, warhammer.Edition5e))
	require.NoError(t, err)

	require.NoError(t, s.Delete(ctx, warhammer.WhTypeMutation, "", id, "owner1"))
	require.Zero(t, rawDocCount(t, s, warhammer.WhTypeMutation, id))
}

func TestWhDbDeleteRequiresOwner(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000012"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(id, "m", warhammer.VisibilityPrivate, warhammer.Edition4e))
	require.NoError(t, err)

	require.NoError(t, s.Delete(ctx, warhammer.WhTypeMutation, "", id, "owner2"))
	require.NoError(t, s.Delete(ctx, warhammer.WhTypeMutation, warhammer.Edition4e, id, "owner2"))
	require.Equal(t, int64(1), rawDocCount(t, s, warhammer.WhTypeMutation, id))
}

func TestWhDbDeleteCharacter(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	id := "700000000000000000000013"

	_, err := s.Create(ctx, warhammer.WhTypeCharacter, newTestCharacter(id, "c", warhammer.Edition4e))
	require.NoError(t, err)

	require.NoError(t, s.Delete(ctx, warhammer.WhTypeCharacter, "", id, "owner1"))
	require.Zero(t, rawDocCount(t, s, warhammer.WhTypeCharacter, id))
}

func TestWhDbRetrieveCareersBySkillAndTalent(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()

	newCareer := func(id string, level4e warhammer.CareerLevel, level5e *warhammer.CareerLevel) *warhammer.Wh {
		variants := map[warhammer.Edition]warhammer.WhObject{warhammer.Edition4e: &warhammer.Career{Name: "career " + id, Level2: level4e}}
		if level5e != nil {
			variants[warhammer.Edition5e] = &warhammer.Career{Name: "career 5e " + id, Level1: *level5e}
		}
		w := &warhammer.Wh{Id: id, OwnerId: "owner1", Visibility: warhammer.VisibilityPrivate, Editions: variants}
		w.Init()
		return w
	}
	withSkill := "700000000000000000000014"
	withTalent := "700000000000000000000015"
	levelNotExisting := "700000000000000000000016"
	with5eSkill := "700000000000000000000017"

	for _, career := range []*warhammer.Wh{
		newCareer(withSkill, warhammer.CareerLevel{Exists: true, Skills: []string{"skill1"}}, nil),
		newCareer(withTalent, warhammer.CareerLevel{Exists: true, Talents: []string{"talent1"}}, nil),
		newCareer(levelNotExisting, warhammer.CareerLevel{Exists: false, Skills: []string{"skill1"}, Talents: []string{"talent1"}}, nil),
		newCareer(with5eSkill, warhammer.CareerLevel{Exists: true}, &warhammer.CareerLevel{Exists: true, Skills: []string{"skill1"}}),
	} {
		_, err := s.Create(ctx, warhammer.WhTypeCareer, career)
		require.NoError(t, err)
	}

	ids := func(filter warhammer.WhFilter) []string {
		got, err := s.Retrieve(ctx, warhammer.WhTypeCareer, []string{"owner1"}, nil, filter)
		require.NoError(t, err)
		res := []string{}
		for _, w := range got {
			res = append(res, w.Id)
		}
		return res
	}

	require.Equal(t, []string{withSkill}, ids(warhammer.WhFilter{Edition: warhammer.Edition4e, SkillIds: []string{"skill1"}}))
	require.Equal(t, []string{withTalent}, ids(warhammer.WhFilter{Edition: warhammer.Edition4e, TalentIds: []string{"talent1"}}))
	require.Equal(t, []string{with5eSkill}, ids(warhammer.WhFilter{Edition: warhammer.Edition5e, SkillIds: []string{"skill1"}}))
}
