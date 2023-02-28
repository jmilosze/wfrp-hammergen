package services

import (
	"context"
	"encoding/hex"
	"errors"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/rs/xid"
	"golang.org/x/exp/slices"
	"log"
)

type WhService struct {
	Validator   *validator.Validate
	WhDbService domain.WhDbService
}

func NewWhService(v *validator.Validate, db domain.WhDbService) *WhService {
	return &WhService{Validator: v, WhDbService: db}
}

func (s *WhService) SeedWh(ctx context.Context, t domain.WhType, whs []*domain.Wh) {
	for _, wh := range whs {
		if _, dbErr := s.WhDbService.Create(ctx, t, wh); dbErr != nil {
			log.Fatal(dbErr)
		}
	}
}

func (s *WhService) Create(ctx context.Context, t domain.WhType, w *domain.Wh, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	if c.Id == "anonymous" {
		return nil, &domain.WhError{WhType: t, ErrType: domain.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := s.Validator.Struct(w); err != nil {
		return nil, &domain.WhError{WhType: t, ErrType: domain.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		w.OwnerId = "admin"
	} else {
		w.OwnerId = c.Id
	}
	w.Id = hex.EncodeToString(xid.New().Bytes())

	createdWh, dbErr := s.WhDbService.Create(ctx, t, w)
	if dbErr != nil {
		return nil, &domain.WhError{WhType: t, ErrType: domain.UserInternalError, Err: dbErr}
	}

	createdWh.CanEdit = canEdit(createdWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return createdWh, nil
}

func canEdit(ownerId string, isAdmin bool, userId string, sharedAccounts []string) bool {
	if (ownerId != userId) && slices.Contains(sharedAccounts, ownerId) {
		return false
	}

	if isAdmin {
		return true
	}

	if ownerId == userId {
		return true
	}

	return false
}

func (s *WhService) Get(ctx context.Context, t domain.WhType, whId string, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	users := []string{"admin", c.Id}
	wh, dbErr := s.WhDbService.Retrieve(ctx, t, whId, users, c.SharedAccounts)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	wh.CanEdit = canEdit(wh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return wh, nil
}

func (s *WhService) Update(ctx context.Context, t domain.WhType, w *domain.Wh, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	if err := s.Validator.Struct(w); err != nil {
		return nil, &domain.WhError{WhType: t, ErrType: domain.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		w.OwnerId = "admin"
	} else {
		w.OwnerId = c.Id
	}

	updatedWh, dbErr := s.WhDbService.Update(ctx, t, w, c.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	updatedWh.CanEdit = canEdit(updatedWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return updatedWh, nil
}

func (s *WhService) Delete(ctx context.Context, t domain.WhType, whId string, c *domain.Claims) *domain.WhError {
	dbErr := s.WhDbService.Delete(ctx, t, whId, c.Id)
	if dbErr != nil {
		return &domain.WhError{ErrType: domain.WhInternalError, WhType: t, Err: dbErr}
	}

	return nil
}

func (s *WhService) List(ctx context.Context, t domain.WhType, c *domain.Claims) ([]*domain.Wh, *domain.WhError) {
	users := []string{"admin", c.Id}
	whs, dbErr := s.WhDbService.RetrieveAll(ctx, t, users, c.SharedAccounts)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	for _, v := range whs {
		v.CanEdit = canEdit(v.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	}

	return whs, nil
}
