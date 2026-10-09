package warhammer

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

// WhFilter narrows retrieval; empty fields do not filter. An empty Edition selects all editions.
type WhFilter struct {
	Edition   Edition
	WhIds     []string
	SkillIds  []string
	TalentIds []string
}

type WhService interface {
	Create(ctx context.Context, t WhType, w *Wh, c *auth.Claims) (*Wh, error)
	Update(ctx context.Context, t WhType, w *Wh, c *auth.Claims) (*Wh, error)
	// Delete removes edition e of the document, or the whole document when e is empty.
	Delete(ctx context.Context, t WhType, e Edition, whId string, c *auth.Claims) error
	Get(ctx context.Context, t WhType, c *auth.Claims, full bool, errIfNotFound bool, filter WhFilter) ([]*Wh, error)

	GetGenerationProps(ctx context.Context, e Edition) (*GenProps, error)
}

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, error)
	Update(ctx context.Context, t WhType, wh *Wh, userId string) (*Wh, error)
	Delete(ctx context.Context, t WhType, e Edition, whId string, userId string) error
	Retrieve(ctx context.Context, t WhType, userIds []string, sharedUserIds []string, filter WhFilter) ([]*Wh, error)

	RetrieveGenerationProps(ctx context.Context, e Edition) (*GenProps, error)
	CreateGenerationProps(ctx context.Context, gp *GenProps) (*GenProps, error)
}
