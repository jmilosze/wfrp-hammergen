package mock_data

type UserSeed struct {
	Id             string
	Username       string
	Password       string
	Admin          bool
	SharedAccounts []string
}

func NewMockUsers() []*UserSeed {
	return []*UserSeed{
		{
			Id:             "000000000000000000000000",
			Username:       "user1@test.com",
			Password:       "123456",
			Admin:          true,
			SharedAccounts: []string{},
		},
		{
			Id:             "000000000000000000000001",
			Username:       "user2@test.com",
			Password:       "789123",
			Admin:          false,
			SharedAccounts: []string{"user1@test.com"},
		},
		{
			Id:             "000000000000000000000002",
			Username:       "user3@test.com",
			Password:       "111111",
			Admin:          false,
			SharedAccounts: []string{"user1@test.com", "user2@test.com"},
		},
	}
}
