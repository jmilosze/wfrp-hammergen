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
		owner_id_is_user_id_and_can_edit()
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
		owner_id_is_admin_and_can_edit()
}
