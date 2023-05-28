package services

import (
	"context"
	"encoding/hex"
	"errors"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/rs/xid"
	"golang.org/x/exp/slices"
	"log"
)

type WhService struct {
	Validator   *validator.Validate
	WhDbService warhammer.WhDbService
}

func NewWhService(v *validator.Validate, db warhammer.WhDbService) *WhService {
	return &WhService{Validator: v, WhDbService: db}
}

func (s *WhService) SeedWh(ctx context.Context, t warhammer.WhType, whs []*warhammer.Wh) {
	for _, wh := range whs {
		if _, dbErr := s.WhDbService.Create(ctx, t, wh); dbErr != nil {
			if dbErr.Type != domain.DbAlreadyExistsError {
				log.Fatal(dbErr)
			}
		}
	}
}

func (s *WhService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, c *domain.Claims) (*warhammer.Wh, *warhammer.WhError) {
	if c.Id == "anonymous" {
		return nil, &warhammer.WhError{WhType: t, ErrType: warhammer.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	newWh := w.InitAndCopy()

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &warhammer.WhError{WhType: t, ErrType: warhammer.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		newWh.OwnerId = "admin"
	} else {
		newWh.OwnerId = c.Id
	}
	newWh.Id = hex.EncodeToString(xid.New().Bytes())

	createdWh, dbErr := s.WhDbService.Create(ctx, t, newWh)
	if dbErr != nil {
		return nil, &warhammer.WhError{WhType: t, ErrType: user.UserInternalError, Err: dbErr}
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

func (s *WhService) Get(ctx context.Context, t warhammer.WhType, whId string, c *domain.Claims) (*warhammer.Wh, *warhammer.WhError) {
	users := []string{"admin", c.Id}
	wh, dbErr := s.WhDbService.Retrieve(ctx, t, whId, users, c.SharedAccounts)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &warhammer.WhError{ErrType: warhammer.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &warhammer.WhError{ErrType: warhammer.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	wh.CanEdit = canEdit(wh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return wh, nil
}

func (s *WhService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, c *domain.Claims) (*warhammer.Wh, *warhammer.WhError) {
	if c.Id == "anonymous" {
		return nil, &warhammer.WhError{WhType: t, ErrType: warhammer.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	newWh := w.InitAndCopy()

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &warhammer.WhError{WhType: t, ErrType: warhammer.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		newWh.OwnerId = "admin"
	} else {
		newWh.OwnerId = c.Id
	}

	updatedWh, dbErr := s.WhDbService.Update(ctx, t, newWh, c.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &warhammer.WhError{ErrType: warhammer.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &warhammer.WhError{ErrType: warhammer.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	updatedWh.CanEdit = canEdit(updatedWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return updatedWh, nil
}

func (s *WhService) Delete(ctx context.Context, t warhammer.WhType, whId string, c *domain.Claims) *warhammer.WhError {
	if c.Id == "anonymous" {
		return &warhammer.WhError{WhType: t, ErrType: warhammer.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	dbErr := s.WhDbService.Delete(ctx, t, whId, c.Id)
	if dbErr != nil {
		return &warhammer.WhError{ErrType: warhammer.WhInternalError, WhType: t, Err: dbErr}
	}

	return nil
}

func (s *WhService) List(ctx context.Context, t warhammer.WhType, c *domain.Claims) ([]*warhammer.Wh, *warhammer.WhError) {
	users := []string{"admin", c.Id}
	whs, dbErr := s.WhDbService.RetrieveAll(ctx, t, users, c.SharedAccounts)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &warhammer.WhError{ErrType: warhammer.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &warhammer.WhError{ErrType: warhammer.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	for _, v := range whs {
		v.CanEdit = canEdit(v.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	}

	return whs, nil
}
