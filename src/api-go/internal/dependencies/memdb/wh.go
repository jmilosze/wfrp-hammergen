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

	for _, whType := range warhammer.WhCoreTypes {
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

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, error) {
	return upsertWh(s.Db, t, w)
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, error) {
	wh, err := getOne(s.Db, t, w.Id)
	if err != nil {
		return nil, err
	}

	if wh.OwnerId != userId {
		return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: errors.New("invalid owner id")}
	}

	return upsertWh(s.Db, t, w)
}

func getOne(db *memdb.MemDB, t warhammer.WhType, whId string) (*warhammer.Wh, error) {
	txn := db.Txn(false)
	whRaw, err := txn.First(string(t), "id", whId)
	if err != nil {
		return nil, fmt.Errorf("could not get first object from memdb : %w", err)
	}

	if whRaw == nil {
		return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: fmt.Errorf("wh %s not found", whId)}
	}

	wh, ok := whRaw.(*warhammer.Wh)
	if !ok {
		return nil, fmt.Errorf("could not populate wh from object %v", whRaw)
	}

	return wh.Copy(), nil
}

func upsertWh(db *memdb.MemDB, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, error) {
	txn := db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert(string(t), w); err != nil {
		return nil, fmt.Errorf("cloud not inset into memdb: %w", err)
	}
	txn.Commit()

	return w.Copy(), nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, whId string, userId string) error {
	wh, err := getOne(s.Db, t, whId)
	if err != nil {
		return err
	}

	if wh.OwnerId != userId {
		return nil
	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll(string(t), "id", whId); err != nil {
		return fmt.Errorf("cloud not delete from memdb: %w", err)
	}
	txn.Commit()

	return nil
}

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, users []string, sharedUsers []string, whIds []string) ([]*warhammer.Wh, error) {
	txn := s.Db.Txn(false)
	it, err := txn.Get(string(t), "id")
	if err != nil {
		return nil, fmt.Errorf("could not get result iterator in memdb: %w", err)
	}

	var whs []*warhammer.Wh
	for obj := it.Next(); obj != nil; obj = it.Next() {
		wh, ok := obj.(*warhammer.Wh)
		if !ok {
			return nil, fmt.Errorf("could not populate wh from object %v", obj)
		}
		if slices.Contains(whIds, wh.Id) || len(whIds) == 0 {
			isShared, err := wh.IsShared()
			if err != nil {
				return nil, fmt.Errorf("could not determine if wh is shared: %w", err)
			}

			if slices.Contains(users, wh.OwnerId) || slices.Contains(sharedUsers, wh.OwnerId) && isShared {
				whs = append(whs, wh.Copy())
			}
		}
	}

	return whs, nil
}

func (s *WhDbService) RetrieveGenerationProps(ctx context.Context) (*warhammer.GenProps, error) {
	txn := s.Db.Txn(false)
	raw, err := txn.First(warhammer.WhTypeOther, "id", "generationProps")
	if err != nil {
		return nil, fmt.Errorf("could not get first object from memdb : %w", err)
	}

	if raw == nil {
		return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: fmt.Errorf("generationProps not found")}
	}

	genProp, ok := raw.(*warhammer.GenProps)
	if !ok {
		return nil, fmt.Errorf("could not populate generationProp from object %v", raw)
	}

	return genProp.Copy(), nil
}

func (s *WhDbService) CreateGenerationProps(ctx context.Context, gp *warhammer.GenProps) (*warhammer.GenProps, error) {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert(warhammer.WhTypeOther, gp); err != nil {
		return nil, fmt.Errorf("cloud not inset into memdb: %w", err)
	}
	txn.Commit()

	return gp.Copy(), nil
}
