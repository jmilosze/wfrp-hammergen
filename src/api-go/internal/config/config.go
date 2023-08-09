package config

import (
	"fmt"
	"net/url"
	"strings"
	"time"

	"github.com/kelseyhightower/envconfig"
)

const appName = "Hammergen"

type Config struct {
	Server      Server
	UserService UserService
	WhService   WhService
	Jwt         Jwt
	Email       Email
	MongoDb     MongoDb
	Captcha     Captcha
}

type Server struct {
	Port            int           `default:"8080" split_words:"true"`
	ShutdownTimeout time.Duration `default:"10s" split_words:"true"`
	RequestTimeout  time.Duration `default:"10s" split_words:"true"`
}

type UserService struct {
	BcryptCost  int      `default:"12" split_words:"true"`
	FrontEndUrl *url.URL `default:"http://localhost:5173" split_words:"true"`
	CreateMocks bool     `default:"false" split_words:"true"`
}

type WhService struct {
	CreateMocks bool `default:"false" split_words:"true"`
}

type Jwt struct {
	AccessExpiry time.Duration `default:"24h" split_words:"true"`
	ResetExpiry  time.Duration `default:"48h" split_words:"true"`
	HmacSecret   string        `default:"some secret" split_words:"true"`
}

type Email struct {
	FromAddress   string `default:"admin@hammergen.net" split_words:"true"`
	FromName      string `default:"Hammergen Admin" split_words:"true"`
	PublicApiKey  string `default:"email public api key placeholder" split_words:"true"`
	PrivateApiKey string `default:"email private api key placeholder" split_words:"true"`
}

type MongoDb struct {
	Uri               string `default:"mongodb://admin:admin@localhost:27017" split_words:"true"`
	Name              string `default:"hammergenGo" split_words:"true"`
	CreateUserIndexes bool   `default:"false" split_words:"false"`
	CreateWhIndexes   bool   `default:"false" split_words:"false"`
}

type Captcha struct {
	Secret   string        `default:"some secret" split_words:"true"`
	Url      string        `default:"https://www.google.com/recaptcha/api/siteverify" split_words:"true"`
	Timeout  time.Duration `default:"10s" split_words:"true"`
	MinScore float64       `default:"0.5"`
	Bypass   string        `default:"success"`
}

func NewConfig() Config {
	var result Config

	if err := envconfig.Process(strings.ToUpper(appName), &result); err != nil {
		panic(fmt.Errorf("settings: cannot initalize app: %w", err))
	}

	return result
}
