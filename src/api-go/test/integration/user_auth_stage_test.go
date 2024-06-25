package integration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
	"io"
	"net/http"
	"net/url"
	"strings"
	"testing"
)

type userCreate struct {
	Username       string   `json:"username,omitempty"`
	Password       string   `json:"password,omitempty"`
	SharedAccounts []string `json:"sharedAccounts,omitempty"`
	Captcha        string   `json:"captcha,omitempty"`
}

type userRetrieve struct {
	Id             string
	Username       string
	Admin          bool
	CreatedOn      string
	LastAuthOn     string
	SharedAccounts []string
}

type userRetrieveResponse struct {
	Data *userRetrieve
}

type userTestStage struct {
	t                   *testing.T
	client              *http.Client
	testUrl             string
	newUser             *userCreate
	createdUserId       string
	responseBody        []byte
	responseCode        int
	authorizationHeader string
}

func userTest(t *testing.T, testUrl string) (*userTestStage, *userTestStage, *userTestStage) {
	client := &http.Client{}
	s := &userTestStage{
		t:       t,
		client:  client,
		testUrl: testUrl,
	}

	return s, s, s
}

func (s *userTestStage) and() *userTestStage {
	return s
}

func (s *userTestStage) nothing() *userTestStage {
	return s
}

func (s *userTestStage) new_user() *userTestStage {
	s.newUser = &userCreate{
		Username:       uuid.NewString() + "@test.com",
		Password:       "123456",
		Captcha:        "success",
		SharedAccounts: []string{"user0@test.com", "non-existing-user@test.com"},
	}
	return s
}

func (s *userTestStage) invalid_captcha() *userTestStage {
	s.newUser.Captcha = "failure"
	return s
}

func (s *userTestStage) missing_username() *userTestStage {
	s.newUser.Username = ""
	return s
}

func (s *userTestStage) new_user_is_created() *userTestStage {
	userUrl := s.testUrl + "/api/user"

	payload, err := json.Marshal(s.newUser)
	require.NoError(s.t, err)

	req, err := http.NewRequest("POST", userUrl, bytes.NewReader(payload))
	require.NoError(s.t, err)
	req.Header.Set("Content-Type", "application/json")

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

	return s
}

func (s *userTestStage) status_code_is_200() *userTestStage {
	require.Equal(s.t, http.StatusOK, s.responseCode)
	return s
}

func (s *userTestStage) status_code_is_400() *userTestStage {
	require.Equal(s.t, http.StatusBadRequest, s.responseCode)
	return s
}

func (s *userTestStage) status_code_is_401() *userTestStage {
	require.Equal(s.t, http.StatusUnauthorized, s.responseCode)
	return s
}

func (s *userTestStage) status_code_is_403() *userTestStage {
	require.Equal(s.t, http.StatusForbidden, s.responseCode)
	return s
}

func (s *userTestStage) status_code_is_404() *userTestStage {
	require.Equal(s.t, http.StatusNotFound, s.responseCode)
	return s
}

func (s *userTestStage) response_body_contains_new_user_name_id_and_existing_shared_accounts() *userTestStage {
	createdUser := userRetrieveResponse{}
	err := json.Unmarshal(s.responseBody, &createdUser)
	require.NoError(s.t, err)
	require.NotNil(s.t, createdUser.Data)

	require.True(s.t, len(createdUser.Data.Id) > 0)
	require.Equal(s.t, s.newUser.Username, createdUser.Data.Username)
	require.Equal(s.t, []string{"user0@test.com"}, createdUser.Data.SharedAccounts)

	s.createdUserId = createdUser.Data.Id

	return s
}

func (s *userTestStage) response_body_contains_new_user_id() *userTestStage {
	createdUser := userRetrieveResponse{}
	err := json.Unmarshal(s.responseBody, &createdUser)
	require.NoError(s.t, err)
	require.NotNil(s.t, createdUser.Data)

	require.True(s.t, len(createdUser.Data.Id) > 0)
	s.createdUserId = createdUser.Data.Id

	return s
}

func (s *userTestStage) new_user_is_authenticated() *userTestStage {
	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.newUser.Username, s.newUser.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *userTestStage) admin_user_is_authenticated() *userTestStage {
	accessToken, err := authUser(s.testUrl+"/api/token", s.client, "user0@test.com", "123456")
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func authUser(authUrl string, client *http.Client, username string, password string) (string, error) {
	form := url.Values{}
	form.Add("username", username)
	form.Add("password", password)

	req, err := http.NewRequest("POST", authUrl, strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("invalid status code: %d", resp.StatusCode)
	}

	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var respMap map[string]any

	err = json.Unmarshal(respBody, &respMap)
	if err != nil {
		return "", err
	}

	token, ok := respMap["accessToken"]
	if !ok {
		return "", fmt.Errorf("no accessToken field in the body")
	}

	accessToken, ok := token.(string)
	if !ok {
		return "", fmt.Errorf("authorization is not a string")
	}

	return accessToken, nil
}

func (s *userTestStage) new_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user/" + s.createdUserId)
	return s
}

func (s *userTestStage) getUser(userUrl string) {
	req, err := http.NewRequest("GET", userUrl, nil)
	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)

	s.responseBody, err = io.ReadAll(resp.Body)
	s.responseCode = resp.StatusCode
	require.NoError(s.t, err)
}

func (s *userTestStage) authenticated_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user")
	return s
}

func (s *userTestStage) admin_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user/000000000000000000000000")
	return s
}

func (s *userTestStage) non_existing_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user/000000000000111000000000")
	return s
}

func (s *userTestStage) invalid_token() *userTestStage {
	s.authorizationHeader = "Bearer invalid token"
	return s
}

func (s *userTestStage) new_user_is_deleted() *userTestStage {
	s.deleteUser(s.testUrl+"/api/user/"+s.createdUserId, s.newUser.Password)
	return s
}

func (s *userTestStage) deleteUser(userUrl string, password string) {
	var req *http.Request
	var err error

	if password == "" {
		req, err = http.NewRequest("DELETE", userUrl, nil)
	} else {
		payload := map[string]string{"password": password}
		payloadBytes, err := json.Marshal(payload)
		require.NoError(s.t, err)
		req, err = http.NewRequest("DELETE", userUrl, bytes.NewReader(payloadBytes))
	}

	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)

	s.responseCode = resp.StatusCode
	require.NoError(s.t, err)
}

func (s *userTestStage) new_user_is_deleted_without_password() *userTestStage {
	s.deleteUser(s.testUrl+"/api/user/"+s.createdUserId, "")
	return s
}

func (s *userTestStage) admin_user_is_deleted() *userTestStage {
	s.deleteUser(s.testUrl+"/api/user/000000000000000000000000", "123456")
	return s
}

func (s *userTestStage) new_user_is_deleted_with_invalid_password() *userTestStage {
	s.deleteUser(s.testUrl+"/api/user/"+s.createdUserId, "invalid password")
	return s
}

func (s *userTestStage) non_existing_user_is_deleted() *userTestStage {
	s.deleteUser(s.testUrl+"/api/user/123", s.newUser.Password)
	return s
}
