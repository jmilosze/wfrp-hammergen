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
	"slices"
	"strings"
	"testing"
)

const nonExistingUsername = "non-existing-user@test.com"
const nonExistingId = "123"

type user struct {
	Username       string   `json:"username,omitempty"`
	Password       string   `json:"password,omitempty"`
	SharedAccounts []string `json:"sharedAccounts,omitempty"`
	Captcha        string   `json:"captcha,omitempty"`
	Id             string   `json:"id,omitempty"`
	Admin          bool     `json:"admin,omitempty"`
}

type userRetrieveResponse struct {
	Data *user
}

type userExistsResponse struct {
	Data *struct {
		Exists bool `json:"exists,omitempty"`
	}
}

type userListResponse struct {
	Data []*user
}

type userTestStage struct {
	t                   *testing.T
	client              *http.Client
	testUrl             string
	newUser             *user
	adminUser           *user
	otherUser           *user
	changedUser         *user
	responseBody        []byte
	responseCode        int
	authorizationHeader string
}

func userTest(t *testing.T, testUrl string, parallel bool) (*userTestStage, *userTestStage, *userTestStage) {
	if parallel {
		t.Parallel()
	}

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
	s.newUser = &user{
		Username: uuid.NewString() + "@test.com",
		Password: "123456",
		Captcha:  "success",
	}
	return s
}

func (s *userTestStage) already_present_admin_user() *userTestStage {
	s.adminUser = &user{
		Username: "user0@test.com",
		Password: "123456",
		Id:       "000000000000000000000000",
	}
	return s
}

func (s *userTestStage) already_present_other_user() *userTestStage {
	s.otherUser = &user{
		Username: "user1@test.com",
		Password: "111111",
		Id:       "000000000000000000000001",
	}
	return s
}

func (s *userTestStage) invalid_captcha() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.newUser.Captcha = "failure"
	return s
}

func (s *userTestStage) missing_username() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.newUser.Username = ""
	return s
}

func (s *userTestStage) non_existing_user_in_shared_accounts() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.newUser.SharedAccounts = append(s.newUser.SharedAccounts, nonExistingUsername)
	return s
}

func (s *userTestStage) admin_user_in_shared_accounts() *userTestStage {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)
	s.newUser.SharedAccounts = append(s.newUser.SharedAccounts, s.adminUser.Username)
	return s
}

func (s *userTestStage) other_user_in_shared_accounts() *userTestStage {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.otherUser)
	s.newUser.SharedAccounts = append(s.newUser.SharedAccounts, s.otherUser.Username)
	return s
}

func (s *userTestStage) new_user_is_created() *userTestStage {
	require.NotNil(s.t, s.newUser)
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

func (s *userTestStage) status_code_is_409() *userTestStage {
	require.Equal(s.t, http.StatusConflict, s.responseCode)
	return s
}

func (s *userTestStage) response_body_contains_new_user_name() *userTestStage {
	require.NotNil(s.t, s.newUser)
	createdUser := s.parseResponseBody()
	require.Equal(s.t, s.newUser.Username, createdUser.Username)
	return s
}

func (s *userTestStage) response_body_contains_admin_and_other_users_in_shared_accounts() *userTestStage {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)
	createdUser := s.parseResponseBody()

	expected := []string{s.otherUser.Username, s.adminUser.Username}
	slices.Sort(expected)

	actual := createdUser.SharedAccounts
	slices.Sort(actual)

	require.Equal(s.t, expected, actual)
	return s
}

func (s *userTestStage) parseResponseBody() *user {
	createdUser := userRetrieveResponse{}
	err := json.Unmarshal(s.responseBody, &createdUser)
	require.NoError(s.t, err)
	require.NotNil(s.t, createdUser.Data)
	return createdUser.Data
}

func (s *userTestStage) response_body_contains_admin_user_in_shared_accounts() *userTestStage {
	require.NotNil(s.t, s.adminUser)
	createdUser := s.parseResponseBody()
	require.Equal(s.t, []string{s.adminUser.Username}, createdUser.SharedAccounts)
	return s
}

func (s *userTestStage) response_body_does_not_contain_any_shared_accounts() *userTestStage {
	createdUser := s.parseResponseBody()
	require.Equal(s.t, []string{}, createdUser.SharedAccounts)
	return s
}

func (s *userTestStage) response_body_contains_new_user_id() *userTestStage {
	require.NotNil(s.t, s.newUser)
	createdUser := s.parseResponseBody()
	s.newUser.Id = createdUser.Id
	return s
}

func (s *userTestStage) new_user_is_authenticated() *userTestStage {
	require.NotNil(s.t, s.newUser)
	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.newUser.Username, s.newUser.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *userTestStage) admin_user_is_authenticated() *userTestStage {
	require.NotNil(s.t, s.adminUser)
	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.adminUser.Username, s.adminUser.Password)
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
	require.NotNil(s.t, s.newUser)
	s.getUser(s.testUrl + "/api/user/" + s.newUser.Id)
	return s
}

func (s *userTestStage) getUser(userUrl string) {
	req, err := http.NewRequest("GET", userUrl, nil)
	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

}

func (s *userTestStage) authenticated_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user")
	return s
}

func (s *userTestStage) admin_user_is_retrieved() *userTestStage {
	require.NotNil(s.t, s.adminUser)
	s.getUser(s.testUrl + "/api/user/" + s.adminUser.Id)
	return s
}

func (s *userTestStage) non_existing_user_is_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user/" + nonExistingId)
	return s
}

func (s *userTestStage) invalid_token() *userTestStage {
	s.authorizationHeader = "Bearer invalid token"
	return s
}

func (s *userTestStage) new_user_is_deleted() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.deleteUser(s.testUrl+"/api/user/"+s.newUser.Id, s.newUser.Password)
	return s
}

func (s *userTestStage) authenticated_user_is_deleted() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.deleteUser(s.testUrl+"/api/user", s.newUser.Password)
	return s
}

func (s *userTestStage) deleteUser(userUrl string, password string) {
	var req *http.Request
	var err error

	if password == "" {
		req, err = http.NewRequest("DELETE", userUrl, nil)
		require.NoError(s.t, err)
	} else {
		payload := map[string]string{"password": password}
		payloadBytes, err := json.Marshal(payload)
		require.NoError(s.t, err)
		req, err = http.NewRequest("DELETE", userUrl, bytes.NewReader(payloadBytes))
		require.NoError(s.t, err)
	}

	req.Header.Set("Authorization", s.authorizationHeader)
	require.NoError(s.t, err)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

}

func (s *userTestStage) new_user_is_deleted_without_password() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.deleteUser(s.testUrl+"/api/user/"+s.newUser.Id, "")
	return s
}

func (s *userTestStage) admin_user_is_deleted() *userTestStage {
	require.NotNil(s.t, s.adminUser)
	s.deleteUser(s.testUrl+"/api/user/"+s.adminUser.Id, s.adminUser.Password)
	return s
}

func (s *userTestStage) new_user_is_deleted_with_invalid_password() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.deleteUser(s.testUrl+"/api/user/"+s.newUser.Id, "invalid password")
	return s
}

func (s *userTestStage) non_existing_user_is_deleted() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.deleteUser(s.testUrl+"/api/user/"+nonExistingId, s.newUser.Password)
	return s
}

func (s *userTestStage) new_user_is_updated_with_admin_other_non_existing_user_shared_accounts() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)
	require.NotNil(s.t, s.otherUser)
	s.updateUser(s.testUrl+"/api/user/"+s.newUser.Id, []string{s.adminUser.Username, s.otherUser.Username, nonExistingUsername})
}

func (s *userTestStage) updateUser(url string, sharedAccounts []string) {
	payload := map[string][]string{"sharedAccounts": sharedAccounts}
	payloadBytes, err := json.Marshal(payload)
	require.NoError(s.t, err)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(payloadBytes))

	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
}

func (s *userTestStage) authenticated_user_is_updated_with_admin_and_other_user_shared_accounts() {
	require.NotNil(s.t, s.adminUser)
	require.NotNil(s.t, s.otherUser)
	s.updateUser(s.testUrl+"/api/user", []string{s.adminUser.Username, s.otherUser.Username})
}

func (s *userTestStage) new_user_is_updated_with_admin_user_shared_account() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)
	s.updateUser(s.testUrl+"/api/user/"+s.newUser.Id, []string{s.adminUser.Username})
}

func (s *userTestStage) admin_user_is_updated_with_new_user_shared_account() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)
	s.updateUser(s.testUrl+"/api/user/"+s.adminUser.Id, []string{s.newUser.Username})
}

func (s *userTestStage) non_existing_user_is_updated_with_new_user_shared_account() {
	require.NotNil(s.t, s.newUser)
	s.updateUser(s.testUrl+"/api/user/"+nonExistingId, []string{s.newUser.Username})
}

func (s *userTestStage) changed_user() *userTestStage {
	s.changedUser = &user{
		Username: uuid.NewString() + "@test.com",
		Password: "789012",
	}
	return s
}

func (s *userTestStage) new_user_is_updated_with_changed_user_username_and_password() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/"+s.newUser.Id, s.changedUser.Username, s.changedUser.Password, s.newUser.Password)
}

func (s *userTestStage) updateUserCredentials(url string, username string, password string, currentPassword string) {
	payload := map[string]string{}

	if currentPassword != "" {
		payload["CurrentPassword"] = currentPassword
	}

	if password != "" {
		payload["password"] = password
	}

	if username != "" {
		payload["username"] = username
	}

	payloadBytes, err := json.Marshal(payload)
	require.NoError(s.t, err)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(payloadBytes))

	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
}

func (s *userTestStage) response_body_contains_changed_user_name() *userTestStage {
	require.NotNil(s.t, s.changedUser)
	createdUser := s.parseResponseBody()
	require.Equal(s.t, s.changedUser.Username, createdUser.Username)
	return s
}

func (s *userTestStage) changed_user_is_authenticated() *userTestStage {
	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.changedUser.Username, s.changedUser.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *userTestStage) authenticated_user_is_updated_with_changed_user_username_and_password() {
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/", s.changedUser.Username, s.changedUser.Password, s.newUser.Password)
}

func (s *userTestStage) new_user_is_updated_without_providing_current_password() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/"+s.newUser.Id, s.changedUser.Username, s.changedUser.Password, "")
}

func (s *userTestStage) new_user_is_updated_with_changed_user_username() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/"+s.newUser.Id, s.changedUser.Username, "", s.newUser.Password)
}

func (s *userTestStage) non_existing_user_is_updated_with_changed_user_username_and_password() {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/"+nonExistingId, s.changedUser.Username, s.changedUser.Password, s.newUser.Password)
}

func (s *userTestStage) admin_user_is_updated_with_changed_user_username_and_password() {
	require.NotNil(s.t, s.adminUser)
	require.NotNil(s.t, s.changedUser)
	s.updateUserCredentials(s.testUrl+"/api/user/credentials/"+s.adminUser.Id, s.changedUser.Username, s.changedUser.Password, s.adminUser.Password)
}

func (s *userTestStage) response_body_contains_admin_user_name() *userTestStage {
	require.NotNil(s.t, s.adminUser)
	createdUser := s.parseResponseBody()
	require.Equal(s.t, s.adminUser.Username, createdUser.Username)
	return s
}

func (s *userTestStage) new_user_is_made_admin() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.updateUserClaims(s.testUrl+"/api/user/claims/"+s.newUser.Id, true)
	return s
}

func (s *userTestStage) updateUserClaims(url string, admin bool) {
	payload := map[string]bool{"admin": admin}

	payloadBytes, err := json.Marshal(payload)
	require.NoError(s.t, err)
	req, err := http.NewRequest("PUT", url, bytes.NewReader(payloadBytes))

	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
}

func (s *userTestStage) response_body_contains_admin_false() *userTestStage {
	createdUser := s.parseResponseBody()
	require.False(s.t, createdUser.Admin)
	return s
}

func (s *userTestStage) response_body_contains_admin_true() *userTestStage {
	createdUser := s.parseResponseBody()
	require.True(s.t, createdUser.Admin)
	return s
}

func (s *userTestStage) new_user_is_being_checked() *userTestStage {
	require.NotNil(s.t, s.newUser)
	s.checkIfUserExists(s.testUrl + "/api/user/exists/" + s.newUser.Username)
	return s
}

func (s *userTestStage) checkIfUserExists(userUrl string) {
	req, err := http.NewRequest("GET", userUrl, nil)
	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
}

func (s *userTestStage) response_body_contains_exists_equal(exists bool) *userTestStage {
	userExists := userExistsResponse{}
	err := json.Unmarshal(s.responseBody, &userExists)
	require.NoError(s.t, err)
	require.NotNil(s.t, userExists.Data)

	require.Equal(s.t, exists, userExists.Data.Exists)
	return s
}

func (s *userTestStage) non_existing_user_is_being_checked() *userTestStage {
	s.checkIfUserExists(s.testUrl + "/api/user/exists/" + nonExistingUsername)
	return s
}

func (s *userTestStage) users_are_retrieved() *userTestStage {
	s.getUser(s.testUrl + "/api/user/list")
	return s
}

func (s *userTestStage) response_body_contains_new_user_and_admin_user() *userTestStage {
	require.NotNil(s.t, s.newUser)
	require.NotNil(s.t, s.adminUser)

	users := userListResponse{}
	err := json.Unmarshal(s.responseBody, &users)
	require.NoError(s.t, err)
	require.NotNil(s.t, users.Data)

	newUserFound := false
	adminUserFound := false

	for _, user := range users.Data {
		if user.Username == s.newUser.Username {
			newUserFound = true
		}
		if user.Username == s.adminUser.Username {
			adminUserFound = true
		}
	}

	require.True(s.t, newUserFound)
	require.True(s.t, adminUserFound)

	return s
}

func (s *userTestStage) send_reset_password_of_new_user_is_called() {
	s.sendResetPassword(s.newUser.Username, s.newUser.Captcha)
}

func (s *userTestStage) sendResetPassword(username string, captcha string) {
	payload := map[string]string{"username": username, "captcha": captcha}

	payloadBytes, err := json.Marshal(payload)
	require.NoError(s.t, err)
	req, err := http.NewRequest("POST", s.testUrl+"/api/user/sendResetPassword", bytes.NewReader(payloadBytes))
	require.NoError(s.t, err)

	req.Header.Set("Authorization", s.authorizationHeader)

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
}

func (s *userTestStage) send_reset_password_of_non_existing_user_is_called() {
	s.sendResetPassword(nonExistingUsername, "success")
}
