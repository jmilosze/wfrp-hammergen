package mailjet

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/mailjet/mailjet-apiv3-go/v3"
)

type EmailService struct {
	FromAddress string
	FromName    string
	Client      *mailjet.Client
}

func NewEmailService(fromAddress string, publicKey string, privateKey string) *EmailService {
	client := mailjet.NewMailjetClient(publicKey, privateKey)
	return &EmailService{FromAddress: fromAddress, Client: client}
}

func (e *EmailService) Send(ctx context.Context, email *domain.Email) error {

	messagesInfo := []mailjet.InfoMessagesV31{{
		From: &mailjet.RecipientV31{
			Email: e.FromAddress,
			Name:  e.FromName,
		},
		To: &mailjet.RecipientsV31{
			mailjet.RecipientV31{
				Email: email.ToAddress,
				Name:  email.ToAddress,
			},
		},
		Subject:  email.Subject,
		HTMLPart: email.Content,
	}}
	messages := mailjet.MessagesV31{Info: messagesInfo}

	if _, err := e.Client.SendMailV31(&messages, mailjet.WithContext(ctx)); err != nil {
		return err
	}
	return nil
}
