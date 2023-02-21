package memdb

import (
	"context"
	"errors"
	"fmt"
	"github.com/hashicorp/go-memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"golang.org/x/exp/slices"
)

type WhDbService struct {
	Db *memdb.MemDB
}

func NewWhDbService() *WhDbService {
	db, err := createNewWhMemDb()
	if err != nil {
		panic(err)
	}

	return &WhDbService{Db: db}
}

func createNewWhMemDb() (*memdb.MemDB, error) {
	schema := &memdb.DBSchema{
		Tables: map[string]*memdb.TableSchema{
			"wh": {
				Name: "wh",
				Indexes: map[string]*memdb.IndexSchema{
					"id": {
						Name:    "id",
						Unique:  true,
						Indexer: &memdb.StringFieldIndex{Field: "Id"},
					},
				},
			},
		},
	}
	return memdb.NewMemDB(schema)
}

func (s *WhDbService) Retrieve(ctx context.Context, whType int, whId string, users []string, sharedUsers []string) (*domain.Wh, *domain.DbError) {
	txn := s.Db.Txn(false)
	whRaw, err1 := txn.First("wh", "id", whId)
	if err1 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err1}
	}

	if whRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("wh not found")}
	}

	wh, ok := whRaw.(*domain.Wh)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate wh from raw %v", whRaw)}
	}

	if slices.Contains(users, wh.OwnerId) || slices.Contains(sharedUsers, wh.OwnerId) && wh.IsShared() {
		return wh.Copy(), nil
	}

	return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("wh not found")}

}

func (s *WhDbService) Create(ctx context.Context, whType int, w *domain.Wh) (*domain.Wh, *domain.DbError) {
	return upsertWh(s.Db, w)
}

func (s *WhDbService) Update(ctx context.Context, whType int, w *domain.Wh) (*domain.Wh, *domain.DbError) {
	return upsertWh(s.Db, w)
}

func upsertWh(db *memdb.MemDB, w *domain.Wh) (*domain.Wh, *domain.DbError) {
	txn := db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("wh", w); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return w.Copy(), nil
}

func (s *WhDbService) Delete(ctx context.Context, whType int, whId string) *domain.DbError {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll("wh", "id", whId); err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return nil
}

func (s *WhDbService) RetrieveAll(ctx context.Context, whType int, users []string, sharedUsers []string) ([]*domain.Wh, *domain.DbError) {
	txn := s.Db.Txn(false)
	it, err := txn.Get("wh", "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var whs []*domain.Wh
	for obj := it.Next(); obj != nil; obj = it.Next() {
		wh, ok := obj.(*domain.Wh)
		if !ok {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate wh from raw %v", obj)}
		}
		if slices.Contains(users, wh.OwnerId) || slices.Contains(sharedUsers, wh.OwnerId) && wh.IsShared() {
			whs = append(whs, wh.Copy())
		}
	}

	return whs, nil
}
