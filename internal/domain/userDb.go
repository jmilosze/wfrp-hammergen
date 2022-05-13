package domain

type UserDb struct {
	Id               string
	Username         *string
	PasswordHash     []byte
	Admin            *bool
	SharedAccountIds []string
}

type UserDbService interface {
	Create(user *UserDb) *DbError
	Retrieve(fieldName string, fieldValue string) (*UserDb, *DbError)
	RetrieveMany(fieldName string, fieldValues []string) ([]*UserDb, *DbError)
	Update(user *UserDb) (*UserDb, *DbError)
	Delete(id string) *DbError
	List() ([]*UserDb, *DbError)
	NewUserDb() *UserDb
}
