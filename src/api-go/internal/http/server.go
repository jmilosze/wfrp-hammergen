package http

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
)

type Server struct {
	*http.Server
	ShutdownTimeout time.Duration
}

func NewServer(cfg *config.Server, router http.Handler) *Server {
	return &Server{
		Server: &http.Server{
			Addr:    fmt.Sprintf(":%d", cfg.Port),
			Handler: router,
		},
		ShutdownTimeout: cfg.ShutdownTimeout,
	}
}

func (s *Server) Start() {
	go func() {
		log.Printf("server starting on %s", s.Addr)
		if err := s.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Printf("server error: %v", err)
		}
	}()
}

func (s *Server) Stop() error {
	ctx, cancel := context.WithTimeout(context.Background(), s.ShutdownTimeout)
	defer cancel()

	if err := s.Shutdown(ctx); err != nil {
		return fmt.Errorf("server shutdown failed: %w", err)
	}
	return nil
}
