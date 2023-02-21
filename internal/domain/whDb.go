package domain

import "context"

type WhDbService interface {
	Create(ctx context.Context, whType int, wh *Wh) (*Wh, *DbError)
	Retrieve(ctx context.Context, whType int, whId string, users []string, sharedUsers []string) (*Wh, *DbError)
	Update(ctx context.Context, whType int, wh *Wh) (*Wh, *DbError)
	Delete(ctx context.Context, whType int, whId string) *DbError
	RetrieveAll(ctx context.Context, whType int, users []string, sharedUsers []string) ([]*Wh, *DbError)
}
