package mockcaptcha

import (
	"context"
)

type CaptchaService struct {
	Bypass string
}

func NewCaptchaService() *CaptchaService {
	return &CaptchaService{Bypass: "success"}
}

func (e *CaptchaService) Verify(ctx context.Context, captcha string, remoteAddr string) bool {
	if captcha == e.Bypass {
		return true
	} else {
		return false
	}
}
