package integration

import (
	"flag"
	"testing"
)

var wfrpUrl string
var parallel bool

func init() {
	flag.StringVar(&wfrpUrl, "url", "http://localhost:8080", "wfrp api url")
	flag.BoolVar(&parallel, "parallel", false, "run tests in parallel")
}

// Create

func TestCreateUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

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

func TestCreateDuplicateUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		status_code_is_200().and().
		response_body_contains_new_user_id()
	when.
		new_user_is_created()

	then.
		status_code_is_409().and().
		new_user_is_authenticated().and().
		new_user_is_retrieved().and().
		status_code_is_200()

}

func TestCreateUserNoCaptcha(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		invalid_captcha()

	when.
		new_user_is_created()

	then.
		status_code_is_400()
}

func TestCreateUserMissingUsername(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		missing_username()

	when.
		new_user_is_created()

	then.
		status_code_is_400()
}

// Get

func TestGetSpecificUser(t *testing.T) {

	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name()
}

func TestGetCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

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
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created()

	when.
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		new_user_is_authenticated()

	when.
		admin_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_name()
}

func TestGetNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		new_user_is_authenticated()

	when.
		non_existing_user_is_retrieved()

	then.
		status_code_is_401()
}

func TestGetSpecificUserInvalidToken(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		invalid_token().and().
		new_user_is_created().and().
		response_body_contains_new_user_id()

	when.
		new_user_is_retrieved()

	then.
		status_code_is_401()
}

// Delete

func TestDeleteSpecificUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_deleted()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		status_code_is_404()
}

func TestDeleteUserUnauthenticated(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id()

	when.
		new_user_is_deleted()

	then.
		status_code_is_401().and().
		new_user_is_authenticated().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		authenticated_user_is_deleted()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		status_code_is_404()
}

func TestDeleteNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_deleted()

	then.
		status_code_is_200()
}

func TestDeleteUserWithoutPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_deleted_without_password()

	then.
		status_code_is_400().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteUserWithInvalidPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_deleted_with_invalid_password()

	then.
		status_code_is_403().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		admin_user_is_deleted()

	then.
		status_code_is_401().and().
		admin_user_is_authenticated().and().
		admin_user_is_retrieved().and().
		status_code_is_200()
}

func TestDeleteNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		new_user_is_deleted()

	then.
		status_code_is_401().and().
		new_user_is_retrieved().and().
		status_code_is_200()
}

// Update

func TestUpdateSpecificUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		already_present_other_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_updated_with_admin_other_non_existing_user_shared_accounts()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		response_body_contains_admin_and_other_users_in_shared_accounts()
}

func TestUpdateSpecificUserUnauthenticated(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id()

	when.
		new_user_is_updated_with_admin_user_shared_account()

	then.
		status_code_is_401().and().
		new_user_is_authenticated().and().
		new_user_is_retrieved().and().
		response_body_does_not_contain_any_shared_accounts()
}

func TestUpdateCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		already_present_other_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		authenticated_user_is_updated_with_admin_and_other_user_shared_accounts()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		response_body_contains_admin_and_other_users_in_shared_accounts()
}

func TestUpdateNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		non_existing_user_is_updated_with_new_user_shared_account()

	then.
		status_code_is_401()
}

func TestUpdateNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		admin_user_is_updated_with_new_user_shared_account()

	then.
		status_code_is_401().and().
		admin_user_is_authenticated().and().
		admin_user_is_retrieved().and().
		response_body_does_not_contain_any_shared_accounts()
}

func TestUpdateNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		new_user_is_updated_with_admin_user_shared_account()

	then.
		status_code_is_401().and().
		new_user_is_retrieved().and().
		response_body_does_not_contain_any_shared_accounts()
}

// Update credentials

func TestUpdateUsernameAndPasswordOfSpecificUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_200().and().
		changed_user_is_authenticated().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_id().and().
		response_body_contains_changed_user_name()
}

func TestUpdateUsernameOfSpecificUserUnauthenticated(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id()

	when.
		new_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_401().and().
		new_user_is_authenticated().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_id().and().
		response_body_contains_new_user_name()
}

func TestUpdateUsernameAndPasswordOfCurrentUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		authenticated_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_200().and().
		changed_user_is_authenticated().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_id().and().
		response_body_contains_changed_user_name()
}

func TestUpdateUsernameOfSpecificUserWithoutCurrentPassword(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_updated_without_providing_current_password()

	then.
		status_code_is_403().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_id().and().
		response_body_contains_new_user_name()
}

func TestUpdateUsernameOfSpecificUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_updated_with_changed_user_username()

	then.
		status_code_is_400().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_id().and().
		response_body_contains_new_user_name()
}

func TestUpdateUsernameAndPasswordOfNonExistingUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		non_existing_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_401()
}

func TestUpdateUsernameAndPasswordOfNonSelfUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		admin_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_401().and().
		admin_user_is_authenticated().and().
		admin_user_is_retrieved().and().
		response_body_contains_admin_user_name()
}

func TestUpdateUsernameAndPasswordOfNonSelfUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		changed_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		new_user_is_updated_with_changed_user_username_and_password()

	then.
		status_code_is_401().and().
		new_user_is_retrieved().and().
		response_body_contains_new_user_name()
}

// Update claims

func TestUpdateAdminOfSpecificUser(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		new_user_is_made_admin()

	then.
		status_code_is_401().and().
		new_user_is_retrieved().and().
		response_body_contains_admin_false()
}

func TestUpdateAdminOfSpecificUserByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		already_present_admin_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		new_user_is_made_admin()

	then.
		status_code_is_200().and().
		new_user_is_retrieved().and().
		response_body_contains_admin_true()
}

// User exist

func TestUserExists(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id()

	when.
		new_user_is_being_checked()

	then.
		status_code_is_200().and().
		response_body_contains_exists_equal(true)
}

func TestUserExistsWhenUserDonesNotExist(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		nothing()

	when.
		non_existing_user_is_being_checked()

	then.
		status_code_is_200().and().
		response_body_contains_exists_equal(false)
}

// User list

func TestListUsers(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		new_user_is_authenticated()

	when.
		users_are_retrieved()

	then.
		status_code_is_401()
}

func TestListUsersByAdmin(t *testing.T) {
	given, when, then := userTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_user().and().
		new_user_is_created().and().
		response_body_contains_new_user_id().and().
		admin_user_is_authenticated()

	when.
		users_are_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_new_user_and_admin_user()
}

// User send reset password

// User reset password
