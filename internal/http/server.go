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
	Server          *http.Server
	ShutdownTimeout time.Duration
}

func NewServer(cfg *config.ServerConfig, router http.Handler) *Server {
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", cfg.Host, cfg.Port),
		Handler: router,
	}

	return &Server{
		Server:          server,
		ShutdownTimeout: cfg.ShutdownTimeout,
	}
}

func (s *Server) Start() {
	go func() {
		log.Printf("server starting on %s", s.Server.Addr)
		if err := s.Server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}()
}

func (s *Server) Stop() error {
	ctx, cancel := context.WithTimeout(context.Background(), s.ShutdownTimeout)
	defer cancel()

	return s.Server.Shutdown(ctx)
}
