package config

import (
	"time"
)

type ServerConfig struct {
	Host            string
	Port            int
	HandlerTimeout  time.Duration
	ShutdownTimeout time.Duration
}

type UserServiceConfig struct {
	BcryptCost int
	SeedUsers  map[string]*UserSeed
}

type JwtConfig struct {
	AccessExpiryTime time.Duration
	ResetExpiryTime  time.Duration
	HmacSecret       string
}

type EmailConfig struct {
	FromAddress string
}

type Config struct {
	ServerConfig      *ServerConfig
	UserServiceConfig *UserServiceConfig
	JwtConfig         *JwtConfig
	EmailConfig       *EmailConfig
}

type UserSeed struct {
	Username          string
	Password          string
	Admin             bool
	SharedAccountsIds []string
}

func NewDefault() (*Config, error) {
	users := map[string]*UserSeed{
		"0": {
			Username:          "user1@test.com",
			Password:          "123456",
			Admin:             true,
			SharedAccountsIds: []string{"1"},
		},
		"1": {
			Username:          "user2@test.com",
			Password:          "789123",
			Admin:             false,
			SharedAccountsIds: []string{},
		},
		"2": {
			Username:          "user3@test.com",
			Password:          "111111",
			Admin:             false,
			SharedAccountsIds: []string{"0", "1"},
		},
	}

	return &Config{
		ServerConfig: &ServerConfig{
			Host:            "localhost",
			Port:            8080,
			HandlerTimeout:  2 * time.Second,
			ShutdownTimeout: 2 * time.Second,
		},
		UserServiceConfig: &UserServiceConfig{
			BcryptCost: 12,
			SeedUsers:  users,
		},
		JwtConfig: &JwtConfig{
			AccessExpiryTime: 24 * time.Hour,
			ResetExpiryTime:  48 * time.Hour,
			HmacSecret:       "some_secret",
		},
		EmailConfig: &EmailConfig{FromAddress: "admin@hammergen.net"},
	}, nil
}
