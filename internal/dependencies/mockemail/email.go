package mockemail

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
)

type EmailService struct {
	FromAddress string
}

func NewEmailService(fromAddress string) *EmailService {
	return &EmailService{FromAddress: fromAddress}
}

func (e *EmailService) Send(email *domain.Email) *domain.EmailError {
	fmt.Printf("sending email from %s to %s\n", e.FromAddress, email.ToAddress)
	fmt.Printf("subject: %s\n", email.Subject)
	fmt.Printf("contents: %s\n", email.Content)
	return nil
}
