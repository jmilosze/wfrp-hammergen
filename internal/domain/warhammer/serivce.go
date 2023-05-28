package warhammer

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
)

type WhService interface {
	Create(ctx context.Context, t WhType, w *Wh, c *domain.Claims) (*Wh, *WhError)
	Get(ctx context.Context, t WhType, whId string, c *domain.Claims) (*Wh, *WhError)
	Update(ctx context.Context, t WhType, w *Wh, c *domain.Claims) (*Wh, *WhError)
	Delete(ctx context.Context, t WhType, whId string, c *domain.Claims) *WhError
	List(ctx context.Context, t WhType, c *domain.Claims) ([]*Wh, *WhError)
}

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, *domain.DbError)
	Retrieve(ctx context.Context, t WhType, whId string, userIds []string, sharedUserIds []string) (*Wh, *domain.DbError)
	Update(ctx context.Context, t WhType, wh *Wh, userId string) (*Wh, *domain.DbError)
	Delete(ctx context.Context, t WhType, whId string, userId string) *domain.DbError
	RetrieveAll(ctx context.Context, t WhType, userIds []string, sharedUserIds []string) ([]*Wh, *domain.DbError)
}
