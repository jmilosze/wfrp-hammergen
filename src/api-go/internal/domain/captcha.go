package domain

import "context"

type CaptchaService interface {
	Verify(ctx context.Context, captcha string, remoteAddr string) bool
}
