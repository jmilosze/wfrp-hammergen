package mongodb

import (
	"context"
	"testing"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/stretchr/testify/require"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func TestFindDecodeFailuresReportsDocumentsOfWrongType(t *testing.T) {
	s := newTestWhDbService(t)
	ctx := context.Background()
	goodId := "700000000000000000000101"
	badId := "700000000000000000000102"

	_, err := s.Create(ctx, warhammer.WhTypeMutation, newTestMutation(goodId, "good", warhammer.VisibilityPublic, warhammer.Edition4e))
	require.NoError(t, err)
	_, err = s.Collections[warhammer.WhTypeSkill].InsertOne(ctx, bson.M{
		"_id":        objectId(t, badId),
		"ownerid":    "owner1",
		"visibility": int(warhammer.VisibilityPublic),
		"modifiedon": "2026-11-13 17:52:22",
		"editions":   bson.M{"4e": bson.M{"name": "bad"}},
	})
	require.NoError(t, err)

	checked, failures, err := FindDecodeFailures(ctx, s.Db)
	require.NoError(t, err)
	require.Equal(t, 2, checked)
	require.Len(t, failures, 1)
	require.Equal(t, "skill", failures[0].Collection)
	require.Equal(t, badId, failures[0].Id)
}
