package memdb

import (
	"context"
	"errors"
	"fmt"
	"github.com/hashicorp/go-memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
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
		Tables: map[string]*memdb.TableSchema{},
	}

	for _, whType := range warhammer.WhApiTypes {
		schema.Tables[string(whType)] = &memdb.TableSchema{
			Name: string(whType),
			Indexes: map[string]*memdb.IndexSchema{
				"id": {
					Name:    "id",
					Unique:  true,
					Indexer: &memdb.StringFieldIndex{Field: "Id"},
				},
			},
		}

	}

	schema.Tables[warhammer.WhTypeOther] = &memdb.TableSchema{
		Name: warhammer.WhTypeOther,
		Indexes: map[string]*memdb.IndexSchema{
			"id": {
				Name:    "id",
				Unique:  true,
				Indexer: &memdb.StringFieldIndex{Field: "Name"},
			},
		},
	}

	return memdb.NewMemDB(schema)
}

func getOne(db *memdb.MemDB, t warhammer.WhType, whId string) (*warhammer.Wh, *domain.DbError) {
	txn := db.Txn(false)
	whRaw, err := txn.First(string(t), "id", whId)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if whRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("wh not found")}
	}

	wh, ok := whRaw.(*warhammer.Wh)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate wh from raw %v", whRaw)}
	}

	return wh.PointToCopy(), nil
}

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, *domain.DbError) {
	return upsertWh(s.Db, t, w)
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, *domain.DbError) {
	wh, dbErr := getOne(s.Db, t, w.Id)
	if dbErr != nil {
		return nil, dbErr
	}

	if wh.OwnerId != userId {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("invalid owner id")}
	}

	return upsertWh(s.Db, t, w)
}

func upsertWh(db *memdb.MemDB, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, *domain.DbError) {
	txn := db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert(string(t), w); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return w.PointToCopy(), nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, whId string, userId string) *domain.DbError {
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

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, users []string, sharedUsers []string, whIds []string) ([]*warhammer.Wh, *domain.DbError) {
	txn := s.Db.Txn(false)
	it, err := txn.Get(string(t), "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var whs []*warhammer.Wh
	for obj := it.Next(); obj != nil; obj = it.Next() {
		wh, ok := obj.(*warhammer.Wh)
		if !ok {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate wh from raw %v", obj)}
		}
		if slices.Contains(whIds, wh.Id) || len(whIds) == 0 {
			if slices.Contains(users, wh.OwnerId) || slices.Contains(sharedUsers, wh.OwnerId) && wh.IsShared() {
				whs = append(whs, wh.PointToCopy())
			}
		}
	}

	if len(whIds) != 0 && len(whs) != len(whIds) {
		return nil, domain.CreateDbError(domain.DbNotFoundError, errors.New("some of the ids not found"))
	}

	return whs, nil
}

func (s *WhDbService) RetrieveGenerationProps(ctx context.Context) (*warhammer.WhGenerationProps, *domain.DbError) {
	txn := s.Db.Txn(false)
	raw, err := txn.First(warhammer.WhTypeOther, "id", "generationProps")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if raw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("generationProps not found")}
	}

	genProp, ok := raw.(*warhammer.WhGenerationProps)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: fmt.Errorf("could not populate generationProp from raw %v", raw)}
	}

	return genProp.PointToCopy(), nil
}

func (s *WhDbService) CreateGenerationProps(ctx context.Context, gp *warhammer.WhGenerationProps) (*warhammer.WhGenerationProps, *domain.DbError) {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert(warhammer.WhTypeOther, gp); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return gp.PointToCopy(), nil
}
