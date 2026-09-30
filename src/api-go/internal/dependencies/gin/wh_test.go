package gin

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

type mockWhService struct {
	called   bool
	written  *warhammer.Wh
	edition  warhammer.Edition
	filter   warhammer.WhFilter
	getError error
}

func (m *mockWhService) Create(_ context.Context, _ warhammer.WhType, w *warhammer.Wh, _ *auth.Claims) (*warhammer.Wh, error) {
	m.called, m.written = true, w
	return w, nil
}

func (m *mockWhService) Update(_ context.Context, _ warhammer.WhType, w *warhammer.Wh, _ *auth.Claims) (*warhammer.Wh, error) {
	m.called, m.written = true, w
	return w, nil
}

func (m *mockWhService) Delete(_ context.Context, _ warhammer.WhType, e warhammer.Edition, _ string, _ *auth.Claims) error {
	m.called, m.edition = true, e
	return nil
}

func (m *mockWhService) Get(_ context.Context, _ warhammer.WhType, _ *auth.Claims, _ bool, _ bool, filter warhammer.WhFilter) ([]*warhammer.Wh, error) {
	m.called, m.filter = true, filter
	if m.getError != nil {
		return nil, m.getError
	}
	return []*warhammer.Wh{{Id: "id1", Editions: map[warhammer.Edition]warhammer.WhObject{warhammer.Edition4e: &warhammer.Mutation{}}}}, nil
}

func (m *mockWhService) GetGenerationProps(_ context.Context) (*warhammer.GenProps, error) {
	m.called = true
	return &warhammer.GenProps{}, nil
}

func newWhTestRouter(ws warhammer.WhService) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	RegisterWhRoutes(router, ws, &mockJwtService{})
	return router
}

func serveWh(router *gin.Engine, method string, target string, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, target, strings.NewReader(body))
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func TestWhReadsWithoutEditionSelectAll(t *testing.T) {
	for _, target := range []string{"/api/wh/mutation", "/api/wh/mutation/id1"} {
		t.Run(target, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), "GET", target, "")

			if w.Code != http.StatusOK {
				t.Fatalf("expected status 200, got %d", w.Code)
			}
			if ws.filter.Edition != "" {
				t.Fatalf("expected no edition filter, got %s", ws.filter.Edition)
			}
		})
	}
}

func TestWhReadsPassEditionToService(t *testing.T) {
	for _, target := range []string{"/api/wh/mutation?edition=5e", "/api/wh/mutation/id1?edition=5e"} {
		t.Run(target, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), "GET", target, "")

			if w.Code != http.StatusOK {
				t.Fatalf("expected status 200, got %d", w.Code)
			}
			if ws.filter.Edition != warhammer.Edition5e {
				t.Fatalf("expected edition 5e, got %s", ws.filter.Edition)
			}
		})
	}
}

func TestWhRoutesRejectInvalidEdition(t *testing.T) {
	for _, rc := range []struct{ method, target string }{
		{"GET", "/api/wh/mutation?edition=6e"},
		{"GET", "/api/wh/mutation/id1?edition=4"},
		{"DELETE", "/api/wh/mutation/id1?edition=6e"},
	} {
		t.Run(rc.method+" "+rc.target, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), rc.method, rc.target, "")

			if w.Code != http.StatusBadRequest {
				t.Fatalf("expected status 400, got %d", w.Code)
			}
			if ws.called {
				t.Fatal("expected service not to be called")
			}
		})
	}
}

func TestWhReadInvalidArgumentsIsBadRequest(t *testing.T) {
	for _, target := range []string{"/api/wh/item?full=true", "/api/wh/item/id1?full=true"} {
		t.Run(target, func(t *testing.T) {
			ws := &mockWhService{getError: fmt.Errorf("%w: edition is required", domain.ErrInvalidArguments)}
			w := serveWh(newWhTestRouter(ws), "GET", target, "")

			if w.Code != http.StatusBadRequest {
				t.Fatalf("expected status 400, got %d", w.Code)
			}
		})
	}
}

func TestWhDeletePassesOptionalEdition(t *testing.T) {
	for _, tc := range []struct {
		target string
		want   warhammer.Edition
	}{
		{"/api/wh/mutation/id1", ""},
		{"/api/wh/mutation/id1?edition=5e", warhammer.Edition5e},
	} {
		t.Run(tc.target, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), "DELETE", tc.target, "")

			if w.Code != http.StatusOK {
				t.Fatalf("expected status 200, got %d", w.Code)
			}
			if ws.edition != tc.want {
				t.Fatalf("expected edition %q, got %q", tc.want, ws.edition)
			}
		})
	}
}

func TestWhContentWriteParsesEditions(t *testing.T) {
	body := `{"visibility":1,"editions":{"4e":{"name":"m 4e"},"5e":{"name":"m 5e"}}}`
	for _, rc := range []struct{ method, target string }{
		{"POST", "/api/wh/mutation"},
		{"PUT", "/api/wh/mutation/id1"},
	} {
		t.Run(rc.method, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), rc.method, rc.target, body)

			if w.Code != http.StatusOK {
				t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
			}
			if ws.written.Visibility != warhammer.VisibilityShared || ws.written.Object != nil {
				t.Fatalf("unexpected written wh %+v", ws.written)
			}
			names := map[warhammer.Edition]string{}
			for e, obj := range ws.written.Editions {
				names[e] = obj.(*warhammer.Mutation).Name
			}
			if names[warhammer.Edition4e] != "m 4e" || names[warhammer.Edition5e] != "m 5e" || len(names) != 2 {
				t.Fatalf("unexpected editions %v", names)
			}

			var resp struct {
				Data map[string]json.RawMessage `json:"data"`
			}
			if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
				t.Fatal(err)
			}
			if _, ok := resp.Data["object"]; ok {
				t.Fatal("content response must not contain object")
			}
			if _, ok := resp.Data["editions"]; !ok {
				t.Fatal("content response must contain editions")
			}
		})
	}
}

func TestWhContentWriteRejectsInvalidBody(t *testing.T) {
	for name, body := range map[string]string{
		"no visibility":   `{"editions":{"4e":{"name":"m"}}}`,
		"no editions":     `{"visibility":0}`,
		"empty editions":  `{"visibility":0,"editions":{}}`,
		"invalid edition": `{"visibility":0,"editions":{"6e":{"name":"m"}}}`,
	} {
		t.Run(name, func(t *testing.T) {
			ws := &mockWhService{}
			w := serveWh(newWhTestRouter(ws), "POST", "/api/wh/mutation", body)

			if w.Code != http.StatusBadRequest {
				t.Fatalf("expected status 400, got %d", w.Code)
			}
			if ws.called {
				t.Fatal("expected service not to be called")
			}
		})
	}
}

func TestWhCharacterWriteParsesEditionInObject(t *testing.T) {
	ws := &mockWhService{}
	w := serveWh(newWhTestRouter(ws), "POST", "/api/wh/character", `{"visibility":0,"edition":"4e","name":"c"}`)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}
	if ws.written.Editions != nil {
		t.Fatalf("unexpected written wh %+v", ws.written)
	}
	character := ws.written.Object.(*warhammer.Character)
	if character.Name != "c" || character.Edition != warhammer.Edition4e {
		t.Fatalf("unexpected character %+v", character)
	}
}

func TestWhGenerationDoesNotTakeEdition(t *testing.T) {
	ws := &mockWhService{}
	w := serveWh(newWhTestRouter(ws), "GET", "/api/wh/generation", "")

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}
