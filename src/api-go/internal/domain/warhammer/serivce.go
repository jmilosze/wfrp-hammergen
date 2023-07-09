package warhammer

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
)

type WhService interface {
	Create(ctx context.Context, t WhType, w *Wh, c *domain.Claims) (*Wh, *WhError)
	Update(ctx context.Context, t WhType, w *Wh, c *domain.Claims) (*Wh, *WhError)
	Delete(ctx context.Context, t WhType, whId string, c *domain.Claims) *WhError
	Get(ctx context.Context, t WhType, c *domain.Claims, full bool, whIds []string) ([]*Wh, *WhError)

	GetGenerationProps(ctx context.Context) (*WhGenerationProps, *WhError)
}

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, *domain.DbError)
	Update(ctx context.Context, t WhType, wh *Wh, userId string) (*Wh, *domain.DbError)
	Delete(ctx context.Context, t WhType, whId string, userId string) *domain.DbError
	Retrieve(ctx context.Context, t WhType, userIds []string, sharedUserIds []string, whIds []string) ([]*Wh, *domain.DbError)

	RetrieveGenerationProps(ctx context.Context) (*WhGenerationProps, *domain.DbError)
	CreateGenerationProps(ctx context.Context, gp *WhGenerationProps) (*WhGenerationProps, *domain.DbError)
}
