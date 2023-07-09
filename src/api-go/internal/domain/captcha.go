package domain

type CaptchaService interface {
	Verify(captcha string, remoteAddr string) bool
}
