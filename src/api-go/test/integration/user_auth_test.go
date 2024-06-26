package integration

import (
	"testing"
)

const wfrpUrl = "http://localhost:8080"

func TestCreateUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		already_present_other_user().and().
		non_existing_user_in_shared_accounts().and().
		admin_user_in_shared_accounts().and().
		other_user_in_shared_accounts()

	when.
		new_user_is_created()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name().and().
		response_body_contains_admin_and_other_users_in_shared_accounts()
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
		new_user().and().
		new_user_is_created().and().
		new_user_is_authenticated()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name()
}

func TestGetCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		new_user_is_authenticated()

	when.
		authenticated_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name()
}

func TestGetCurrentUserUnauthenticated(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and()

	when.
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		new_user_is_authenticated().and()

	when.
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated().and()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name()
}

func TestGetNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		new_user_is_authenticated().and()

	when.
		non_existing_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetSpecificUserInvalidToken(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		invalid_token().and().
		new_user_is_created().and()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestDeleteUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated().and()

	when.
		new_user_is_deleted()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		status_code_is_404()
}

func TestDeleteNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated().and()

	when.
		new_user_is_deleted()

	then.
		status_code_is_200()
}

func TestDeleteUserWithoutPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated().and()

	when.
		new_user_is_deleted_without_password()

	then.
		status_code_is_400().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteUserWithInvalidPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated().and()

	when.
		new_user_is_deleted_with_invalid_password()

	then.
		status_code_is_403().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated().and()

	when.
		admin_user_is_deleted()

	then.
		status_code_is_401().and().
		admin_user_is_authenticated().and().
		admin_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated().and()

	when.
		new_user_is_deleted()

	then.
		status_code_is_401().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}
