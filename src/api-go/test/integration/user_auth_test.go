package integration

import (
	"net/http"
	"testing"
)

const wfrpUrl = "http://localhost:8080"

func TestUserCanGetSelf(t *testing.T) {
	given, when, then := userAuthTestTest(t, wfrpUrl)

	given.
		user_admin_is_authenticated()

	when.
		performing_get_user_admin()

	then.
		status_code_is(http.StatusOK)
	//	.and().
	//	response_contains_expected_headers(map[string]string{"X-Form3-Transaction-Time": "", "X-Form3-Correlation-Id": ""}, false)
}
