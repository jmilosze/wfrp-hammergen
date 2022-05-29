package main

import (
	"context"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/golangjwt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mockcaptcha"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mockemail"
	"github.com/jmilosze/wfrp-hammergen-go/internal/http"
	"github.com/jmilosze/wfrp-hammergen-go/internal/services"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	cfg := config.NewDefault()

	val := validator.New()
	jwtService := golangjwt.NewHmacService(cfg.JwtConfig.HmacSecret, cfg.JwtConfig.AccessExpiry, cfg.JwtConfig.ResetExpiry)
	emailService := mockemail.NewEmailService(cfg.EmailConfig.FromAddress)
	captchaService := mockcaptcha.NewCaptchaService()
	userDbService := memdb.NewUserDbService()

	userService := services.NewUserService(cfg.UserServiceConfig, userDbService, emailService, jwtService, val)

	ctx, cancel := context.WithTimeout(context.Background(), cfg.ServerConfig.RequestTimeout)
	defer cancel()
	mockUsers := config.NewMockUsers()
	userService.SeedUsers(ctx, mockUsers)

	router := gin.NewRouter(cfg.ServerConfig.RequestTimeout)
	gin.RegisterUserRoutes(router, userService, jwtService, captchaService)
	gin.RegisterAuthRoutes(router, userService, jwtService)

	server := http.NewServer(cfg.ServerConfig, router)

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	server.Start()
	<-done
	server.Stop()

	return nil
}
