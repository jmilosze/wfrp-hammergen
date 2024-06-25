package integration

import (
	"testing"
)

const wfrpUrl = "http://localhost:8080"

func TestCreateUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name_id_and_existing_shared_accounts()
}

func TestCreateUserNoCaptcha(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		invalid_captcha()

	when.
		new_user_is_created()

	then.
		status_code_is_400()
}

func TestCreateUserMissingUsername(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		missing_username()

	when.
		new_user_is_created()

	then.
		status_code_is_400()
}

func TestGetSpecificUser(t *testing.T) {

	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		new_user_is_authenticated().and().
		new_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name_id_and_existing_shared_accounts()
}

func TestGetCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		new_user_is_authenticated().and().
		current_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name_id_and_existing_shared_accounts()
}

func TestGetCurrentUserUnauthenticated(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		new_user_is_authenticated().and().
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		new_user_is_authenticated().and().
		non_existing_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetSpecificUserInvalidToken(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		invalid_token()

	when.
		new_user_is_created().and().
		new_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestDeleteUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		response_body_contains_new_user_name_id().and().
		new_user_is_authenticated().and().
		new_user_is_deleted()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		status_code_is_404()
}

func TestDeleteUserWithoutPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		response_body_contains_new_user_name_id().and().
		new_user_is_authenticated().and().
		new_user_is_deleted_without_password()

	then.
		status_code_is_400().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteUserWithInvalidPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user()

	when.
		new_user_is_created().and().
		response_body_contains_new_user_name_id().and().
		new_user_is_authenticated().and().
		new_user_is_deleted_with_invalid_password()

	then.
		status_code_is_403().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}
