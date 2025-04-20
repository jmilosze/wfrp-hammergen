package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof" // Import pprof
	"os"
	"os/signal"
	"syscall"

	"github.com/jmilosze/wfrp-hammergen-go/internal"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/golangjwt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mailjet"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mockcaptcha"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mockemail"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/mongodb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/recaptcha"
	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/validator"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	apphttp "github.com/jmilosze/wfrp-hammergen-go/internal/http"
	"github.com/jmilosze/wfrp-hammergen-go/internal/services"
	mock "github.com/jmilosze/wfrp-hammergen-go/test/mock_data"
)

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	cfg := config.NewConfig()
	internal.SetupLogger(cfg.Logging.GcpProjectId)

	val := validator.NewValidator()
	jwtService := golangjwt.NewHmacService(cfg.Jwt.HmacSecret, cfg.Jwt.AccessExpiry, cfg.Jwt.ResetExpiry)

	var emailService domain.EmailService
	if cfg.Services.Email == "mailjet" {
		emailService = mailjet.NewEmailService(cfg.Email.FromAddress, cfg.Email.PublicApiKey, cfg.Email.PrivateApiKey)
	} else if cfg.Services.Email == "mockemail" {
		emailService = mockemail.NewEmailService(cfg.Email.FromAddress)
	} else {
		return fmt.Errorf("unknown email service: %s", cfg.Services.Email)
	}

	var captchaService domain.CaptchaService
	if cfg.Services.Captcha == "recaptcha" {
		captchaService = recaptcha.NewCaptchaService(cfg.Captcha.Secret, cfg.Captcha.Url, cfg.Captcha.MinScore, cfg.Captcha.Timeout)
	} else if cfg.Services.Captcha == "mockcaptcha" {
		captchaService = mockcaptcha.NewCaptchaService()
	} else {
		return fmt.Errorf("unknown captcha service: %s", cfg.Services.Captcha)
	}

	var userDbService user.UserDbService
	var whDbService wh.WhDbService

	if cfg.Services.Db == "mongodb" {
		mongoDbService := mongodb.NewDbService(cfg.MongoDb.Uri, cfg.MongoDb.Name)
		defer mongoDbService.Disconnect()

		userDbService = mongodb.NewUserDbService(mongoDbService, cfg.MongoDb.CreateUserIndexes)
		whDbService = mongodb.NewWhDbService(mongoDbService, cfg.MongoDb.CreateWhIndexes)
	} else if cfg.Services.Db == "memdb" {
		userDbService = memdb.NewUserDbService()
		whDbService = memdb.NewWhDbService()
	} else {
		return fmt.Errorf("unknown database service: %s", cfg.Services.Db)
	}

	userService := services.NewUserService(&cfg.UserService, userDbService, emailService, jwtService, val)
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
	gin.RegisterOtherRoutes(router, jwtService)

	server := apphttp.NewServer(&cfg.Server, router)

	// Start pprof server if enabled
	var pprofServer *http.Server
	if cfg.PprofServer.Enabled {
		pprofAddr := fmt.Sprintf(":%d", cfg.PprofServer.Port)
		pprofServer = &http.Server{
			Addr:    pprofAddr,
			Handler: http.DefaultServeMux,
		}
		go func() {
			log.Printf("pprof server starting on %s", pprofAddr)
			if err := pprofServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				log.Printf("pprof server error: %v", err)
			}
		}()
	}

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGTERM)

	server.Start()
	<-done
	server.Stop()

	// Shutdown pprof server if it was started
	if pprofServer != nil {
		ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
		defer cancel()
		if err := pprofServer.Shutdown(ctx); err != nil {
			log.Printf("pprof server shutdown error: %v", err)
		}
	}

	return nil
}
