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
			domain.WhTypeMutation: {
				Name: domain.WhTypeMutation,
				Indexes: map[string]*memdb.IndexSchema{
					"id": {
						Name:    "id",
						Unique:  true,
						Indexer: &memdb.StringFieldIndex{Field: "Id"},
					},
				},
			},
			domain.WhTypeSpell: {
				Name: domain.WhTypeSpell,
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

func (s *WhDbService) Retrieve(ctx context.Context, t domain.WhType, whId string, userIds []string, sharedUserIds []string) (*domain.Wh, *domain.DbError) {
	wh, dbErr := getOne(s.Db, t, whId)
	if dbErr != nil {
		return nil, dbErr
	}

	if slices.Contains(userIds, wh.OwnerId) || slices.Contains(sharedUserIds, wh.OwnerId) && wh.IsShared() {
		return wh, nil
	} else {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("wh not found")}
	}
}

func getOne(db *memdb.MemDB, t domain.WhType, whId string) (*domain.Wh, *domain.DbError) {
	txn := db.Txn(false)
	whRaw, err := txn.First(string(t), "id", whId)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if whRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("wh not found")}
	}

	wh, ok := whRaw.(*domain.Wh)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate wh from raw %v", whRaw)}
	}
	return wh.Copy(), nil
}

func (s *WhDbService) Create(ctx context.Context, t domain.WhType, w *domain.Wh) (*domain.Wh, *domain.DbError) {
	return upsertWh(s.Db, t, w)
}

func (s *WhDbService) Update(ctx context.Context, t domain.WhType, w *domain.Wh, userId string) (*domain.Wh, *domain.DbError) {
	wh, dbErr := getOne(s.Db, t, w.Id)
	if dbErr != nil {
		return nil, dbErr
	}

	if wh.OwnerId != userId {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("invalid owner id")}
	}

	return upsertWh(s.Db, t, w)
}

func upsertWh(db *memdb.MemDB, t domain.WhType, w *domain.Wh) (*domain.Wh, *domain.DbError) {
	txn := db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert(string(t), w); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return w.Copy(), nil
}

func (s *WhDbService) Delete(ctx context.Context, t domain.WhType, whId string, userId string) *domain.DbError {
	wh, dbErr := getOne(s.Db, t, whId)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil
		default:
			return dbErr
		}
	}

	if wh.OwnerId != userId {
		return nil
	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll(string(t), "id", whId); err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return nil
}

func (s *WhDbService) RetrieveAll(ctx context.Context, t domain.WhType, users []string, sharedUsers []string) ([]*domain.Wh, *domain.DbError) {
	txn := s.Db.Txn(false)
	it, err := txn.Get(string(t), "id")
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
