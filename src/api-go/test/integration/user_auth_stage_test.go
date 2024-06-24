package integration

import (
	"encoding/json"
	"github.com/stretchr/testify/require"
	"io"
	"net/http"
	"net/url"
	"strings"
	"testing"
)

type userAuthTestStage struct {
	t            *testing.T
	client       *http.Client
	testUrl      string
	accessToken  string
	responseBody []byte
	responseCode int
}

func userAuthTestTest(t *testing.T, testUrl string) (*userAuthTestStage, *userAuthTestStage, *userAuthTestStage) {
	client := &http.Client{}
	s := &userAuthTestStage{
		t:       t,
		client:  client,
		testUrl: testUrl,
	}

	return s, s, s
}

func (s *userAuthTestStage) user_admin_is_authenticated() *userAuthTestStage {
	form := url.Values{}
	form.Add("username", "user0@test.com")
	form.Add("password", "123456")

	authUrl := s.testUrl + "/api/token"

	req, err := http.NewRequest("POST", authUrl, strings.NewReader(form.Encode()))
	require.NoError(s.t, err)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)
	require.Equal(s.t, http.StatusOK, resp.StatusCode)

	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	var respMap map[string]any

	err = json.Unmarshal(respBody, &respMap)
	require.NoError(s.t, err)

	token, ok := respMap["accessToken"]
	require.True(s.t, ok)

	s.accessToken, ok = token.(string)
	require.True(s.t, ok)

	return s
}

func (s *userAuthTestStage) performing_get_user_admin() *userAuthTestStage {
	userUrl := s.testUrl + "/api/user/000000000000000000000000"

	req, err := http.NewRequest("GET", userUrl, nil)
	require.NoError(s.t, err)

	req.Header.Set("Authorization", "Bearer "+s.accessToken)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

	return s
}

func (s *userAuthTestStage) status_code_is(statusCode int) *userAuthTestStage {
	require.Equal(s.t, s.responseCode, statusCode)
	return s
}
