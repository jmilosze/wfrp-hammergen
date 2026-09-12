package internal

import (
	"bytes"
	"context"
	"encoding/json"
	"log/slog"
	"testing"
)

func TestCustomHandlerTracePropagation(t *testing.T) {
	var buf bytes.Buffer
	handler := &customHandler{
		JSONHandler:  slog.NewJSONHandler(&buf, nil),
		GcpProjectId: "test-gcp-project",
	}
	logger := slog.New(handler)

	// Case 1: Log without trace context
	logger.InfoContext(context.Background(), "msg without trace")
	var logEntry1 map[string]any
	if err := json.Unmarshal(buf.Bytes(), &logEntry1); err != nil {
		t.Fatalf("failed to unmarshal log entry: %v", err)
	}
	if _, exists := logEntry1["logging.googleapis.com/trace"]; exists {
		t.Fatalf("expected no trace in log entry, found: %v", logEntry1["logging.googleapis.com/trace"])
	}

	buf.Reset()

	// Case 2: Log with trace context
	ctx := ContextWithTrace(context.Background(), "trace-id-12345/span-id;o=1")
	logger.InfoContext(ctx, "msg with trace")
	var logEntry2 map[string]any
	if err := json.Unmarshal(buf.Bytes(), &logEntry2); err != nil {
		t.Fatalf("failed to unmarshal log entry: %v", err)
	}
	expectedTrace := "projects/test-gcp-project/traces/trace-id-12345"
	if traceVal, exists := logEntry2["logging.googleapis.com/trace"]; !exists || traceVal != expectedTrace {
		t.Fatalf("expected trace %q, got %v", expectedTrace, traceVal)
	}
}
