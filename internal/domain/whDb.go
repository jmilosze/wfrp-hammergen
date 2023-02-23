package domain

import "context"

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, *DbError)
	Retrieve(ctx context.Context, t WhType, whId string, users []string, sharedUsers []string) (*Wh, *DbError)
	Update(ctx context.Context, t WhType, wh *Wh) (*Wh, *DbError)
	Delete(ctx context.Context, t WhType, whId string) *DbError
	RetrieveAll(ctx context.Context, t WhType, users []string, sharedUsers []string) ([]*Wh, *DbError)
}
