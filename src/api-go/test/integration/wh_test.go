package integration

import (
	"testing"
)

// Create

func TestCreateWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		user_is_authenticated()

	when.
		new_wh_property_is_created()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_is_user_and_can_edit()
}

func TestCreateWhUnauthenticated(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		new_wh_property()

	when.
		new_wh_property_is_created()

	then.
		status_code_is_401()
}

func TestCreateWhByAdmin(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		admin_user_is_authenticated()

	when.
		new_wh_property_is_created()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_is_admin_literal_and_can_edit()
}

// Get

func TestGetOwnedWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_querried_without_auth()

	then.
		status_code_is_404()
}

func TestGetOwnedWhByOtherUser(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_other_user().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		other_user_is_authenticated()

	when.
		new_wh_property_is_querried_with_authentication()

	then.
		status_code_is_404()
}

func TestGetPublicWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_querried_without_auth()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_id_is_admin_and_can_not_edit()
}

func TestGetOwnedWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_querried_with_authentication()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_is_user_and_can_edit()
}

func TestGetOwnedWhOtherSharedUser(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_user_with_shared_accounts().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_with_shared_accounts_is_authenticated()

	when.
		new_wh_property_is_querried_with_authentication()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_is_user_and_can_not_edit()
}

func TestGetOwnedWhOtherSharedUserWhNotShared(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_user_with_shared_accounts().and().
		new_wh_property_not_shared().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_with_shared_accounts_is_authenticated()

	when.
		new_wh_property_is_querried_with_authentication()

	then.
		status_code_is_404()
}

// List

func TestList(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		another_new_wh_property_is_created().and().
		response_body_contains_another_new_wh_id()

	when.
		wh_property_is_listed_with_authentication()

	then.
		status_code_is_200().and().
		response_body_contains_new_wh_and_another_new_wh()
}
