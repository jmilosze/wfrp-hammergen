package recaptcha

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestVerify(t *testing.T) {
	tests := []struct {
		name       string
		statusCode int
		response   string
		minScore   float64
		want       bool
	}{
		{
			name:       "successful verification above score",
			statusCode: http.StatusOK,
			response:   `{"success": true, "score": 0.9, "action": "login"}`,
			minScore:   0.5,
			want:       true,
		},
		{
			name:       "successful verification exactly at score",
			statusCode: http.StatusOK,
			response:   `{"success": true, "score": 0.5, "action": "login"}`,
			minScore:   0.5,
			want:       true,
		},
		{
			name:       "score below minScore",
			statusCode: http.StatusOK,
			response:   `{"success": true, "score": 0.3, "action": "login"}`,
			minScore:   0.5,
			want:       false,
		},
		{
			name:       "recaptcha reports success false",
			statusCode: http.StatusOK,
			response:   `{"success": false, "error-codes": ["invalid-input-response"]}`,
			minScore:   0.5,
			want:       false,
		},
		{
			name:       "server returns 500 internal error allows request",
			statusCode: http.StatusInternalServerError,
			response:   `internal server error`,
			minScore:   0.5,
			want:       true,
		},
		{
			name:       "server returns malformed json allows request",
			statusCode: http.StatusOK,
			response:   `{invalid json`,
			minScore:   0.5,
			want:       true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				w.WriteHeader(tt.statusCode)
				w.Write([]byte(tt.response))
			}))
			defer server.Close()

			cs := NewCaptchaService("test-secret", server.URL, tt.minScore, 2*time.Second)
			got := cs.Verify(context.Background(), "token", "127.0.0.1")
			if got != tt.want {
				t.Errorf("Verify() = %v, want %v", got, tt.want)
			}
		})
	}

	t.Run("unreachable server allows request (fail-open)", func(t *testing.T) {
		cs := NewCaptchaService("test-secret", "http://127.0.0.1:0", 0.5, 50*time.Millisecond)
		got := cs.Verify(context.Background(), "token", "127.0.0.1")
		if got != true {
			t.Errorf("Verify() on unreachable server = %v, want true", got)
		}
	})
}
