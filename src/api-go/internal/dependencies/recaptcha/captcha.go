package recaptcha

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type CaptchaService struct {
	Secret     string
	Url        string
	HttpClient *http.Client
	MinScore   float64
	Bypass     string
}

func NewCaptchaService(secret string, url string, minScore float64, bypass string, timeout time.Duration) *CaptchaService {
	return &CaptchaService{
		Secret:   secret,
		Url:      url,
		MinScore: minScore,
		Bypass:   bypass,
		HttpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

func (e *CaptchaService) Verify(ctx context.Context, captcha string, remoteAddr string) bool {
	if captcha == e.Bypass {
		return true
	}

	data := url.Values{}
	data.Set("secret", e.Secret)
	data.Set("response", captcha)
	data.Set("remoteip", remoteAddr)

	req, err := http.NewRequestWithContext(ctx, "POST", e.Url, strings.NewReader(data.Encode()))
	if err != nil {
		return true
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := e.HttpClient.Do(req)
	if err != nil {
		return true
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return true
	}

	var response map[string]any
	err = json.Unmarshal(body, &response)
	if err != nil {
		return true
	}

	successStr, ok := response["success"]
	if !ok {
		return true
	}

	success, ok := successStr.(bool)
	if !ok {
		return true
	}

	if !success {
		return false
	}

	scoreStr, ok := response["score"]
	if !ok {
		return true
	}

	score, ok := scoreStr.(float64)
	if !ok {
		return true
	}

	return score >= e.MinScore
}
