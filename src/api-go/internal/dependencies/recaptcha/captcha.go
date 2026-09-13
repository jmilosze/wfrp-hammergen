package recaptcha

import (
	"context"
	"encoding/json"
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
}

func NewCaptchaService(secret string, url string, minScore float64, timeout time.Duration) *CaptchaService {
	return &CaptchaService{
		Secret:   secret,
		Url:      url,
		MinScore: minScore,
		HttpClient: &http.Client{
			Timeout: timeout,
		},
	}
}

type captchaResponse struct {
	Success    bool     `json:"success"`
	Score      float64  `json:"score"`
	Action     string   `json:"action"`
	ErrorCodes []string `json:"error-codes"`
}

func (e *CaptchaService) Verify(ctx context.Context, captcha string, remoteAddr string) bool {
	data := url.Values{}
	data.Set("secret", e.Secret)
	data.Set("response", captcha)
	data.Set("remoteip", remoteAddr)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, e.Url, strings.NewReader(data.Encode()))
	if err != nil {
		return true
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := e.HttpClient.Do(req)
	if err != nil {
		return true
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return true
	}

	var res captchaResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return true
	}

	if !res.Success {
		return false
	}

	return res.Score >= e.MinScore
}
