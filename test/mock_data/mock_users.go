package mock_data

type UserSeed struct {
	Id             string
	Username       string
	Password       string
	Admin          bool
	SharedAccounts []string
}

var user0 = UserSeed{
	Id:             "000000000000000000000000",
	Username:       "user0@test.com",
	Password:       "123456",
	Admin:          true,
	SharedAccounts: []string{},
}

var user1 = UserSeed{
	Id:             "000000000000000000000001",
	Username:       "user1@test.com",
	Password:       "111111",
	Admin:          false,
	SharedAccounts: []string{"user0@test.com"},
}

var user2 = UserSeed{
	Id:             "000000000000000000000002",
	Username:       "user2@test.com",
	Password:       "111111",
	Admin:          false,
	SharedAccounts: []string{"user1@test.com"},
}

var user3 = UserSeed{
	Id:             "000000000000000000000003",
	Username:       "user3@test.com",
	Password:       "111111",
	Admin:          false,
	SharedAccounts: []string{"user1@test.com", "user2@test.com"},
}

var user4 = UserSeed{
	Id:             "000000000000000000000004",
	Username:       "user4@test.com",
	Password:       "111111",
	Admin:          false,
	SharedAccounts: []string{},
}

func NewMockUsers() []*UserSeed {
	return []*UserSeed{&user0, &user1, &user2, &user3, &user4}
}
