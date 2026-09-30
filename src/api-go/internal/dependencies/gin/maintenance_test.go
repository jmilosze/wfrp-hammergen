package gin

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
)

func newMaintenanceTestRouter(maintenance bool) http.Handler {
	router := NewRouter(10*time.Second, maintenance)
	RegisterStatusRoutes(router, maintenance)
	RegisterOtherRoutes(router, &mockJwtService{})
	router.GET("/api/wh/talent", func(c *gin.Context) { c.JSON(OkResp("talents")) })
	router.POST("/api/token", func(c *gin.Context) { c.JSON(OkResp("token")) })
	return router
}

func TestStatusReportsMaintenance(t *testing.T) {
	for _, maintenance := range []bool{true, false} {
		router := newMaintenanceTestRouter(maintenance)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/api/status", nil))

		if w.Code != http.StatusOK {
			t.Fatalf("maintenance=%v: expected 200, got %d", maintenance, w.Code)
		}
		var resp Response[Status]
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}
		if resp.Data.Maintenance != maintenance {
			t.Errorf("expected maintenance=%v, got %v", maintenance, resp.Data.Maintenance)
		}
	}
}

func TestMaintenanceBlocksApiRoutes(t *testing.T) {
	router := newMaintenanceTestRouter(true)

	requests := []*http.Request{
		httptest.NewRequest(http.MethodGet, "/api/wh/talent", nil),
		httptest.NewRequest(http.MethodPost, "/api/token", nil),
		httptest.NewRequest(http.MethodGet, "/api/keepwarm", nil),
		httptest.NewRequest(http.MethodGet, "/api/does-not-exist", nil),
	}

	for _, req := range requests {
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusServiceUnavailable {
			t.Errorf("%s %s: expected 503, got %d", req.Method, req.URL.Path, w.Code)
		}
		var resp ErrorResponse
		if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}
		if resp.Message != maintenanceMessage {
			t.Errorf("%s %s: expected message %q, got %q", req.Method, req.URL.Path, maintenanceMessage, resp.Message)
		}
	}
}

func TestMaintenanceResponseHasCorsHeaders(t *testing.T) {
	router := newMaintenanceTestRouter(true)
	req := httptest.NewRequest(http.MethodGet, "/api/wh/talent", nil)
	req.Header.Set("Origin", "https://hammergen.net")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("expected 503, got %d", w.Code)
	}
	if w.Header().Get("Access-Control-Allow-Origin") == "" {
		t.Error("expected CORS header on maintenance response so the browser can read it")
	}
}

func TestNoMaintenanceLetsRequestsThrough(t *testing.T) {
	router := newMaintenanceTestRouter(false)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/api/wh/talent", nil))

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}
