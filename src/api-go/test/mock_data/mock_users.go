package mock_data

import "github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"

var user0 = user.User{
	Id:                 "000000000000000000000000",
	Username:           "user0@test.com",
	Password:           "123456",
	Admin:              true,
	SharedAccountNames: []string{},
}

var user1 = user.User{
	Id:                 "000000000000000000000001",
	Username:           "user1@test.com",
	Password:           "111111",
	Admin:              false,
	SharedAccountNames: []string{"user0@test.com"},
}

var user2 = user.User{
	Id:                 "000000000000000000000002",
	Username:           "user2@test.com",
	Password:           "111111",
	Admin:              false,
	SharedAccountNames: []string{"user1@test.com"},
}

var user3 = user.User{
	Id:                 "000000000000000000000003",
	Username:           "user3@test.com",
	Password:           "111111",
	Admin:              false,
	SharedAccountNames: []string{"user1@test.com", "user2@test.com"},
}

var user4 = user.User{
	Id:                 "000000000000000000000004",
	Username:           "user4@test.com",
	Password:           "111111",
	Admin:              false,
	SharedAccountNames: []string{},
}

func NewMockUsers() []*user.User {
	return []*user.User{&user0, &user1, &user2, &user3, &user4}
}
