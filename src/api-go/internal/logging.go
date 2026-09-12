package internal

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strings"
)

type contextKey int

const (
	traceContextKey contextKey = iota
)

func ContextWithTrace(ctx context.Context, traceHeader string) context.Context {
	return context.WithValue(ctx, traceContextKey, traceHeader)
}

func TraceFromContext(ctx context.Context) (string, bool) {
	traceHeader, ok := ctx.Value(traceContextKey).(string)
	return traceHeader, ok
}

// customHandler extends slog.JSONHandler to add extra fields
type customHandler struct {
	*slog.JSONHandler
	GcpProjectId string
}

func (h *customHandler) Handle(ctx context.Context, r slog.Record) error {
	if traceHeader, ok := TraceFromContext(ctx); ok && traceHeader != "" {
		fullTracePath := fmt.Sprintf("projects/%s/traces/%s",
			h.GcpProjectId,
			strings.Split(traceHeader, "/")[0],
		)

		r.Add("logging.googleapis.com/trace", slog.StringValue(fullTracePath))
	}

	return h.JSONHandler.Handle(ctx, r)
}

func SetupLogger(gcpProjectId string) {
	handler := &customHandler{
		JSONHandler:  slog.NewJSONHandler(os.Stdout, nil),
		GcpProjectId: gcpProjectId,
	}
	slog.SetDefault(slog.New(handler))
}
