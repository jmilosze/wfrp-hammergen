package domain

import (
	"context"
)

type Email struct {
	ToAddress string
	Subject   string
	Content   string
}

type EmailService interface {
	Send(ctx context.Context, email *Email) error
}
