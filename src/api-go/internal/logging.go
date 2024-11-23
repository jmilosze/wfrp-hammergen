package internal

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strings"
)

// customHandler extends slog.JSONHandler to add extra fields
type customHandler struct {
	*slog.JSONHandler
	GcpProjectId string
}

func (h *customHandler) Handle(ctx context.Context, r slog.Record) error {
	// Add trace ID if available from Cloud Run request
	if traceHeader := ctx.Value("X-Cloud-Trace-Context"); traceHeader != nil {
		fullTracePath := fmt.Sprintf("projects/%s/traces/%s",
			h.GcpProjectId,
			strings.Split(traceHeader.(string), "/")[0],
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
