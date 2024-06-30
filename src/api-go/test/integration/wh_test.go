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
		user_is_response_wh_owner_and_has_edit_right()
}
