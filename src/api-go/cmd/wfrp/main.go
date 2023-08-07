package main

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/golangjwt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mailjet"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mongodb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/recaptcha"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/validator"
	"github.com/jmilosze/wfrp-hammergen-go/internal/http"
	"github.com/jmilosze/wfrp-hammergen-go/internal/services"
	mock "github.com/jmilosze/wfrp-hammergen-go/test/mock_data"
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

	cfg := config.NewConfig()

	val := validator.NewValidator()
	jwtService := golangjwt.NewHmacService(cfg.Jwt.HmacSecret, cfg.Jwt.AccessExpiry, cfg.Jwt.ResetExpiry)
	emailService := mailjet.NewEmailService(cfg.Email.FromAddress, cfg.Email.PublicApiKey, cfg.Email.PrivateApiKey)
	captchaService := recaptcha.NewCaptchaService(cfg.Captcha.Secret, cfg.Captcha.Url, cfg.Captcha.MinScore, cfg.Captcha.Bypass, cfg.Captcha.Timeout)
	mongoDbService := mongodb.NewDbService(cfg.MongoDb.Uri, cfg.MongoDb.Name)
	defer mongoDbService.Disconnect()

	userDbService := mongodb.NewUserDbService(mongoDbService, cfg.MongoDb.CreateUserIndexes)
	userService := services.NewUserService(&cfg.UserService, userDbService, emailService, jwtService, val)

	whDbService := mongodb.NewWhDbService(mongoDbService, cfg.MongoDb.CreateWhIndexes)
	whService := services.NewWhService(val, whDbService)

	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.RequestTimeout)
	defer cancel()

	if cfg.UserService.CreateMocks {
		mock.InitUser(ctx, userDbService, userService.BcryptCost)
	}

	if cfg.WhService.CreateMocks {
		mock.InitWh(ctx, whDbService)
	}

	router := gin.NewRouter(cfg.Server.RequestTimeout)
	gin.RegisterUserRoutes(router, userService, jwtService, captchaService)
	gin.RegisterAuthRoutes(router, userService, jwtService)
	gin.RegisterWhRoutes(router, whService, jwtService)

	server := http.NewServer(&cfg.Server, router)

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	server.Start()
	<-done
	server.Stop()

	return nil
}
