package domain

import "fmt"

type Email struct {
	ToAddress string
	Subject   string
	Content   string
}

type EmailService interface {
	Send(email *Email) *EmailError
}

type EmailError struct {
	Type int
	Err  error
}

func (e *EmailError) Unwrap() error {
	return e.Err
}

func (e *EmailError) Error() string {
	return fmt.Sprintf("email error, %s", e.Err)
}
