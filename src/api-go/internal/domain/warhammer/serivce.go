package warhammer

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

type WhService interface {
	Create(ctx context.Context, t WhType, w *Wh, c *auth.Claims) (*Wh, error)
	Update(ctx context.Context, t WhType, w *Wh, c *auth.Claims) (*Wh, error)
	Delete(ctx context.Context, t WhType, whId string, c *auth.Claims) error
	Get(ctx context.Context, t WhType, c *auth.Claims, full bool, errIfNotFound bool, whIds []string) ([]*Wh, error)

	GetGenerationProps(ctx context.Context) (*GenProps, error)
}

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, error)
	Update(ctx context.Context, t WhType, wh *Wh, userId string) (*Wh, error)
	Delete(ctx context.Context, t WhType, whId string, userId string) error
	Retrieve(ctx context.Context, t WhType, userIds []string, sharedUserIds []string, whIds []string) ([]*Wh, error)

	RetrieveGenerationProps(ctx context.Context) (*GenProps, error)
	CreateGenerationProps(ctx context.Context, gp *GenProps) (*GenProps, error)
}
