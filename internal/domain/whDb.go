package domain

import "context"

type WhDbService interface {
	Create(ctx context.Context, t WhType, wh *Wh) (*Wh, *DbError)
	Retrieve(ctx context.Context, t WhType, whId string, userIds []string, sharedUserIds []string) (*Wh, *DbError)
	Update(ctx context.Context, t WhType, wh *Wh, userId string) (*Wh, *DbError)
	Delete(ctx context.Context, t WhType, whId string, userId string) *DbError
	RetrieveAll(ctx context.Context, t WhType, userIds []string, sharedUserIds []string) ([]*Wh, *DbError)
}
