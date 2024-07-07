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
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_404()
}

func TestGetGenerationPropsByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_generation_props()

	when.
		generation_props_are_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_expected_generation_props()
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
		new_wh_property_is_retrieved()

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
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property().and().
		owner_is_admin_and_can_not_edit()
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
		new_wh_property_is_retrieved()

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
		new_wh_property_is_retrieved()

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
		new_wh_property_is_retrieved()

	then.
		status_code_is_404()
}

func TestGetOwnedWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_401()

}

func TestGetPublicWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_admin_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_401()

}

// List

func TestListOwnedWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_does_not_contain_new_wh()
}

func TestListOwnedWhOtherUser(t *testing.T) {
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
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_does_not_contain_new_wh()
}

func TestListPublicWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_contains_new_wh().and().
		new_wh_in_list_owner_is_admin_and_can_not_edit()
}

func TestListOwnedWh(t *testing.T) {
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
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_contains_new_wh().and().
		response_body_contains_another_new_wh().and().
		new_wh_in_list_owner_is_user_and_can_edit().and().
		another_new_wh_in_list_owner_is_user_and_can_edit()
}

func TestListWhOtherSharedUser(t *testing.T) {
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
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_contains_new_wh().and().
		new_wh_in_list_owner_is_user_and_can_not_edit()
}

func TestListWhOtherSharedUserWhNotShared(t *testing.T) {
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
		wh_property_is_listed()

	then.
		status_code_is_200().and().
		response_contains_wh_list().and().
		response_body_does_not_contain_new_wh()
}

func TestListWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		user_authentication_token_is_expired()

	when.
		wh_property_is_listed()

	then.
		status_code_is_401()
}

// Update

func TestUpdateWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_another_new_wh_property()

}

func TestUpdatePublicWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_authenticated()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_404()
}

func TestUpdatePublicWhByAdmin(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_200().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_another_new_wh_property()
}

func TestUpdateWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_401()
}

func TestUpdateWhByOtherUserWhShared(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_user_with_shared_accounts().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_with_shared_accounts_is_authenticated()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_404()
}

func TestUpdateWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_updated_with_another_new_wh_property()

	then.
		status_code_is_401()

}

func TestUpdatePublicWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_admin_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_401()

}

// Delete

func TestDeleteWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_200().and().
		new_wh_property_is_retrieved().and().
		status_code_is_404()
}

func TestDeletePublicWh(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		already_present_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_authenticated()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_200().and().
		new_wh_property_is_retrieved().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property()
}

func TestDeletePublicWhByAdmin(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_200().and().
		new_wh_property_is_retrieved().and().
		status_code_is_404()
}

func TestDeletePublicWhByAnonymous(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_is_not_authenticated()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_401()
}

func TestDeletePublicWhByOtherUserWhShared(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		already_present_user_with_shared_accounts().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_with_shared_accounts_is_authenticated()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_200().and().
		new_wh_property_is_retrieved().and().
		response_body_contains_wh_property().and().
		response_wh_object_is_new_wh_property()
}

func TestDeleteWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_user().and().
		new_wh_property().and().
		another_new_wh_property().and().
		user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_deleted()

	then.
		status_code_is_401()

}

func TestDeletePublicWhWithExpiredToken(t *testing.T) {
	given, when, then := whTest(t, wfrpUrl, parallel)

	given.
		already_present_admin_user().and().
		already_present_user().and().
		new_wh_property().and().
		admin_user_is_authenticated().and().
		new_wh_property_is_created().and().
		response_body_contains_new_wh_id().and().
		user_authentication_token_is_expired()

	when.
		new_wh_property_is_retrieved()

	then.
		status_code_is_401()

}
