package services

import (
	"context"
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

func (s *WhService) SeedWh(ctx context.Context, whType int, whs []*domain.Wh) {
	for _, wh := range whs {
		if _, err := s.WhDbService.Create(ctx, whType, wh); err != nil {
			log.Fatal(err)
		}
	}
}

func (s *WhService) Create(ctx context.Context, whType int, w *domain.Wh, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	if c.Id == "anonymous" {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := s.Validator.Struct(w); err != nil {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		w.OwnerId = "admin"
	} else {
		w.OwnerId = c.Id
	}
	w.Id = xid.New().String()

	createdWh, err := s.WhDbService.Create(ctx, whType, w)
	if err != nil {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.UserInternalError, Err: err}
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

func (s *WhService) Get(ctx context.Context, whType int, whId string, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	users := []string{"admin", c.Id}
	wh, err := s.WhDbService.Retrieve(ctx, whType, whId, users, c.SharedAccounts)

	if err != nil {
		switch err.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: whType, Err: err}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: whType, Err: err}
		}
	}

	wh.CanEdit = canEdit(wh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return wh, nil
}

func (s *WhService) Update(ctx context.Context, whType int, w *domain.Wh, c *domain.Claims) (*domain.Wh, *domain.WhError) {
	if c.Id == "anonymous" {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err1 := s.Validator.Struct(w); err1 != nil {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.WhInvalidArgumentsError, Err: err1}
	}

	users := []string{"admin", c.Id}
	_, err2 := s.WhDbService.Retrieve(ctx, whType, w.Id, users, c.SharedAccounts)
	if err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: whType, Err: err2}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: whType, Err: err2}
		}
	}

	if c.Admin {
		w.OwnerId = "admin"
	} else {
		w.OwnerId = c.Id
	}

	updatedWh, err2 := s.WhDbService.Update(ctx, whType, w)
	if err2 != nil {
		return nil, &domain.WhError{WhType: whType, ErrType: domain.UserInternalError, Err: err2}
	}

	updatedWh.CanEdit = canEdit(updatedWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return updatedWh, nil
}

func (s *WhService) Delete(ctx context.Context, whType int, whId string, c *domain.Claims) *domain.WhError {
	if c.Id == "anonymous" {
		return &domain.WhError{WhType: whType, ErrType: domain.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := s.WhDbService.Delete(ctx, whType, whId); err != nil {
		return &domain.WhError{WhType: whType, ErrType: domain.WhInternalError, Err: err}

	} else {
		return nil
	}
}

func (s *WhService) List(ctx context.Context, whType int, c *domain.Claims) ([]*domain.Wh, *domain.WhError) {
	users := []string{"admin", c.Id}
	whs, err := s.WhDbService.RetrieveAll(ctx, whType, users, c.SharedAccounts)

	if err != nil {
		switch err.Type {
		case domain.DbNotFoundError:
			return nil, &domain.WhError{ErrType: domain.WhNotFoundError, WhType: whType, Err: err}
		default:
			return nil, &domain.WhError{ErrType: domain.WhInternalError, WhType: whType, Err: err}
		}
	}

	for _, v := range whs {
		v.CanEdit = canEdit(v.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	}

	return whs, nil
}
