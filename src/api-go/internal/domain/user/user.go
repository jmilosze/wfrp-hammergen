package user

import (
	"time"
)

type User struct {
	Id                 string
	Username           string
	Admin              bool
	SharedAccountNames []string
	SharedAccountIds   []string
	Password           string
	PasswordHash       []byte
	CreatedOn          time.Time
	LastAuthOn         time.Time
}

func New() User {
	return User{
		SharedAccountNames: make([]string, 0),
		SharedAccountIds:   make([]string, 0),
		PasswordHash:       make([]byte, 0),
	}
}
