package integration

import (
	"bytes"
	"encoding/json"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/stretchr/testify/require"
	"io"
	"net/http"
	"testing"
)

type whUser struct {
	Username string
	Password string
	Id       string
}

type whTestStage struct {
	t                      *testing.T
	client                 *http.Client
	testUrl                string
	user                   *whUser
	adminUser              *whUser
	otherUser              *whUser
	userWithSharedAccounts *whUser
	authorizationHeader    string
	newWhProperty          *warhammer.Property
	anotherNewWhProperty   *warhammer.Property
	newWhPropertyId        string
	anotherNewWhPropertyId string
	responseCode           int
	responseBody           []byte
	responseWh             *whProperty
	responseWhMap          map[string]*whProperty
}

type whProperty struct {
	Id      string              `json:"id"`
	OwnerId string              `json:"ownerId"`
	CanEdit bool                `json:"canEdit"`
	Object  *warhammer.Property `json:"object"`
}

type whResponseFull struct {
	Data *whProperty
}

type whResponseList struct {
	Data []*whProperty
}

func whTest(t *testing.T, testUrl string, parallel bool) (*whTestStage, *whTestStage, *whTestStage) {
	if parallel {
		t.Parallel()
	}

	client := &http.Client{}
	s := &whTestStage{
		t:             t,
		client:        client,
		testUrl:       testUrl,
		responseWhMap: make(map[string]*whProperty),
	}

	return s, s, s
}

func (s *whTestStage) and() *whTestStage {
	return s
}

func (s *whTestStage) nothing() *whTestStage {
	return s
}

func (s *whTestStage) status_code_is_200() *whTestStage {
	require.Equal(s.t, http.StatusOK, s.responseCode)
	return s
}

func (s *whTestStage) status_code_is_401() *whTestStage {
	require.Equal(s.t, http.StatusUnauthorized, s.responseCode)
	return s
}

func (s *whTestStage) status_code_is_404() *whTestStage {
	require.Equal(s.t, http.StatusNotFound, s.responseCode)
	return s
}

func (s *whTestStage) new_wh_property() *whTestStage {
	s.newWhProperty = &warhammer.Property{
		Name:         "new_wh_property",
		Description:  "new_wh_property description",
		Type:         warhammer.PropertyTypeQuality,
		ApplicableTo: []warhammer.ItemType{warhammer.ItemTypeMelee, warhammer.ItemTypeArmour},
		Shared:       true,
		Source:       map[warhammer.Source]string{warhammer.SourceCustom: "", warhammer.SourceAltdorf: "123"},
	}

	return s
}

func (s *whTestStage) another_new_wh_property() *whTestStage {
	s.anotherNewWhProperty = &warhammer.Property{
		Name:         "another_new_wh_property",
		Description:  "another_new_wh_property description",
		Type:         warhammer.PropertyTypeQuality,
		ApplicableTo: []warhammer.ItemType{warhammer.ItemTypeMelee, warhammer.ItemTypeArmour},
		Shared:       true,
		Source:       map[warhammer.Source]string{warhammer.SourceCustom: "", warhammer.SourceAltdorf: "123"},
	}

	return s
}

func (s *whTestStage) new_wh_property_not_shared() *whTestStage {
	s.newWhProperty = &warhammer.Property{
		Name:         "new_wh_property",
		Description:  "new_wh_property description",
		Type:         warhammer.PropertyTypeQuality,
		ApplicableTo: []warhammer.ItemType{warhammer.ItemTypeMelee, warhammer.ItemTypeArmour},
		Shared:       false,
		Source:       map[warhammer.Source]string{warhammer.SourceCustom: "", warhammer.SourceAltdorf: "123"},
	}

	return s
}

func (s *whTestStage) already_present_user() *whTestStage {
	s.user = &whUser{
		Id:       "000000000000000000000001",
		Username: "user1@test.com",
		Password: "111111",
	}

	return s
}

func (s *whTestStage) already_present_other_user() *whTestStage {
	s.otherUser = &whUser{
		Id:       "000000000000000000000002",
		Username: "user2@test.com",
		Password: "111111",
	}

	return s
}

func (s *whTestStage) already_present_user_with_shared_accounts() *whTestStage {
	s.userWithSharedAccounts = &whUser{
		Id:       "000000000000000000000003",
		Username: "user3@test.com",
		Password: "111111",
	}

	return s
}

func (s *whTestStage) already_present_admin_user() *whTestStage {
	s.adminUser = &whUser{
		Id:       "000000000000000000000000",
		Username: "user0@test.com",
		Password: "123456",
	}

	return s
}

func (s *whTestStage) user_is_authenticated() *whTestStage {
	require.NotNil(s.t, s.user)

	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.user.Username, s.user.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *whTestStage) admin_user_is_authenticated() *whTestStage {
	require.NotNil(s.t, s.adminUser)

	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.adminUser.Username, s.adminUser.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *whTestStage) new_wh_property_is_created() *whTestStage {
	require.NotNil(s.t, s.newWhProperty)
	s.upsertWh(s.newWhProperty, s.testUrl+"/api/wh/property", true)
	return s
}

func (s *whTestStage) upsertWh(whProperty *warhammer.Property, url string, create bool) {
	var method string
	if create {
		method = "POST"
	} else {
		method = "PUT"
	}

	payloadBytes, err := json.Marshal(whProperty)
	require.NoError(s.t, err)
	req, err := http.NewRequest(method, url, bytes.NewReader(payloadBytes))
	require.NoError(s.t, err)
	if s.authorizationHeader != "" {
		req.Header.Set("Authorization", s.authorizationHeader)
	}
	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)
}

func (s *whTestStage) response_body_contains_wh_property() *whTestStage {
	responseFull := whResponseFull{}
	err := json.Unmarshal(s.responseBody, &responseFull)
	require.NoError(s.t, err)
	require.NotNil(s.t, responseFull.Data)
	s.responseWh = responseFull.Data

	return s
}

func (s *whTestStage) response_wh_object_is_new_wh_property() *whTestStage {
	require.NotNil(s.t, s.newWhProperty)

	s.compareWhProperty(s.newWhProperty, s.responseWh.Object)
	return s
}

func (s *whTestStage) compareWhProperty(wh1 *warhammer.Property, wh2 *warhammer.Property) {
	require.Equal(s.t, wh1.Name, wh2.Name)
	require.Equal(s.t, wh1.Description, wh2.Description)
	require.Equal(s.t, wh1.Type, wh2.Type)
	require.Equal(s.t, wh1.Shared, wh2.Shared)
	require.Equal(s.t, wh1.ApplicableTo, wh2.ApplicableTo)
	require.Equal(s.t, wh1.Source, wh2.Source)
}

func (s *whTestStage) owner_is_user_and_can_edit() *whTestStage {
	require.NotNil(s.t, s.user)

	require.Equal(s.t, s.user.Id, s.responseWh.OwnerId)
	require.Equal(s.t, true, s.responseWh.CanEdit)

	return s
}

func (s *whTestStage) owner_is_admin_literal_and_can_edit() *whTestStage {
	require.Equal(s.t, "admin", s.responseWh.OwnerId)
	require.Equal(s.t, true, s.responseWh.CanEdit)

	return s
}

func (s *whTestStage) new_wh_property_is_querried() *whTestStage {
	s.getWh(s.testUrl + "/api/wh/property/" + s.newWhPropertyId)
	return s
}

func (s *whTestStage) getWh(url string) {
	req, err := http.NewRequest("GET", url, nil)
	require.NoError(s.t, err)

	if s.authorizationHeader != "" {
		req.Header.Set("Authorization", s.authorizationHeader)
	}

	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode
	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)
}

func (s *whTestStage) owner_is_admin_and_can_not_edit() *whTestStage {
	require.Equal(s.t, "admin", s.responseWh.OwnerId)
	require.Equal(s.t, false, s.responseWh.CanEdit)

	return s
}

func (s *whTestStage) response_body_contains_new_wh_id() *whTestStage {
	s.newWhPropertyId = s.getIdFromBody()
	return s
}

func (s *whTestStage) getIdFromBody() string {
	responseFull := whResponseFull{}
	err := json.Unmarshal(s.responseBody, &responseFull)
	require.NoError(s.t, err)
	require.NotNil(s.t, responseFull.Data)
	return responseFull.Data.Id
}

func (s *whTestStage) other_user_is_authenticated() *whTestStage {
	require.NotNil(s.t, s.otherUser)

	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.otherUser.Username, s.otherUser.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *whTestStage) user_with_shared_accounts_is_authenticated() *whTestStage {
	require.NotNil(s.t, s.userWithSharedAccounts)

	accessToken, err := authUser(s.testUrl+"/api/token", s.client, s.userWithSharedAccounts.Username, s.userWithSharedAccounts.Password)
	require.NoError(s.t, err)
	s.authorizationHeader = "Bearer " + accessToken
	return s
}

func (s *whTestStage) owner_is_user_and_can_not_edit() *whTestStage {
	require.NotNil(s.t, s.user)

	require.Equal(s.t, s.user.Id, s.responseWh.OwnerId)
	require.Equal(s.t, false, s.responseWh.CanEdit)

	return s
}

func (s *whTestStage) another_new_wh_property_is_created() *whTestStage {
	require.NotNil(s.t, s.anotherNewWhProperty)

	s.upsertWh(s.anotherNewWhProperty, s.testUrl+"/api/wh/property", true)
	return s
}

func (s *whTestStage) response_body_contains_another_new_wh_id() *whTestStage {
	s.anotherNewWhPropertyId = s.getIdFromBody()
	return s
}

func (s *whTestStage) wh_property_is_listed() *whTestStage {
	s.getWh(s.testUrl + "/api/wh/property/")
	return s
}

func (s *whTestStage) response_body_contains_new_wh() *whTestStage {
	require.NotNil(s.t, s.newWhProperty)

	wh, ok := s.responseWhMap[s.newWhPropertyId]
	require.True(s.t, ok)
	s.compareWhProperty(s.newWhProperty, wh.Object)
	return s
}

func (s *whTestStage) response_body_contains_another_new_wh() *whTestStage {
	require.NotNil(s.t, s.anotherNewWhProperty)

	wh, ok := s.responseWhMap[s.anotherNewWhPropertyId]
	require.True(s.t, ok)
	s.compareWhProperty(s.anotherNewWhProperty, wh.Object)
	return s
}

func (s *whTestStage) response_contains_wh_list() *whTestStage {
	response := whResponseList{}

	err := json.Unmarshal(s.responseBody, &response)
	require.NoError(s.t, err)
	require.NotNil(s.t, response.Data)

	for _, item := range response.Data {
		s.responseWhMap[item.Id] = item
	}

	return s
}

func (s *whTestStage) response_body_does_not_contain_new_wh() *whTestStage {
	_, ok := s.responseWhMap[s.newWhPropertyId]
	require.False(s.t, ok)
	return s
}

func (s *whTestStage) new_wh_in_list_owner_is_admin_and_can_not_edit() *whTestStage {
	require.Equal(s.t, "admin", s.responseWhMap[s.newWhPropertyId].OwnerId)
	require.Equal(s.t, false, s.responseWhMap[s.newWhPropertyId].CanEdit)

	return s
}

func (s *whTestStage) new_wh_in_list_owner_is_user_and_can_edit() *whTestStage {
	require.Equal(s.t, s.user.Id, s.responseWhMap[s.newWhPropertyId].OwnerId)
	require.Equal(s.t, true, s.responseWhMap[s.newWhPropertyId].CanEdit)

	return s
}

func (s *whTestStage) another_new_wh_in_list_owner_is_user_and_can_edit() *whTestStage {
	require.Equal(s.t, s.user.Id, s.responseWhMap[s.anotherNewWhPropertyId].OwnerId)
	require.Equal(s.t, true, s.responseWhMap[s.anotherNewWhPropertyId].CanEdit)

	return s
}

func (s *whTestStage) new_wh_in_list_owner_is_user_and_can_not_edit() *whTestStage {
	require.Equal(s.t, s.user.Id, s.responseWhMap[s.newWhPropertyId].OwnerId)
	require.Equal(s.t, false, s.responseWhMap[s.newWhPropertyId].CanEdit)

	return s
}

func (s *whTestStage) new_wh_property_is_updated_with_another_new_wh_property() *whTestStage {
	require.NotNil(s.t, s.anotherNewWhProperty)
	s.upsertWh(s.anotherNewWhProperty, s.testUrl+"/api/wh/property/"+s.newWhPropertyId, false)
	return s
}

func (s *whTestStage) user_is_not_authenticated() *whTestStage {
	s.authorizationHeader = ""
	return s
}

func (s *whTestStage) response_wh_object_is_another_new_wh_property() *whTestStage {
	require.NotNil(s.t, s.anotherNewWhProperty)

	s.compareWhProperty(s.anotherNewWhProperty, s.responseWh.Object)
	return s
}
