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

type whTestStage struct {
	t                   *testing.T
	client              *http.Client
	testUrl             string
	user                *user
	authorizationHeader string
	newWhProperty       *warhammer.Property
	responseCode        int
	responseBody        []byte
	responseWh          *warhammer.Wh
}

type whResponseFull struct {
	Data *warhammer.Wh
}

func whTest(t *testing.T, testUrl string, parallel bool) (*whTestStage, *whTestStage, *whTestStage) {
	if parallel {
		t.Parallel()
	}

	client := &http.Client{}
	s := &whTestStage{
		t:       t,
		client:  client,
		testUrl: testUrl,
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

func (s *whTestStage) already_present_user() *whTestStage {
	s.user = &user{
		Id:             "000000000000000000000001",
		Username:       "user1@test.com",
		Password:       "111111",
		SharedAccounts: []string{"user0@test.com"},
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

func (s *whTestStage) new_wh_property_is_created() *whTestStage {
	s.createWh(s.testUrl + "/api/wh/property")
	return s
}

func (s *whTestStage) createWh(url string) {
	require.NotNil(s.t, s.newWhProperty)

	payloadBytes, err := json.Marshal(s.newWhProperty)
	require.NoError(s.t, err)
	req, err := http.NewRequest("POST", url, bytes.NewReader(payloadBytes))
	require.NoError(s.t, err)
	req.Header.Set("Authorization", s.authorizationHeader)
	resp, err := s.client.Do(req)
	require.NoError(s.t, err)

	s.responseCode = resp.StatusCode

	s.responseBody, err = io.ReadAll(resp.Body)
	require.NoError(s.t, err)
}

func (s *whTestStage) response_body_contains_wh_property() *whTestStage {
	responseFull := whResponseFull{
		Data: &warhammer.Wh{
			Object: &warhammer.Property{},
		},
	}
	err := json.Unmarshal(s.responseBody, &responseFull)
	require.NoError(s.t, err)
	require.NotNil(s.t, responseFull.Data)
	s.responseWh = responseFull.Data

	return s
}

func (s *whTestStage) response_wh_object_is_new_wh_property() *whTestStage {
	whPropertyFromResponse, ok := s.responseWh.Object.(*warhammer.Property)
	require.True(s.t, ok)

	require.Equal(s.t, s.newWhProperty.Name, whPropertyFromResponse.Name)
	require.Equal(s.t, s.newWhProperty.Description, whPropertyFromResponse.Description)
	require.Equal(s.t, s.newWhProperty.Type, whPropertyFromResponse.Type)
	require.Equal(s.t, s.newWhProperty.Shared, whPropertyFromResponse.Shared)
	require.Equal(s.t, s.newWhProperty.ApplicableTo, whPropertyFromResponse.ApplicableTo)
	require.Equal(s.t, s.newWhProperty.Source, whPropertyFromResponse.Source)

	return s
}

func (s *whTestStage) user_is_response_wh_owner_and_has_edit_right() *whTestStage {
	require.Equal(s.t, s.user.Id, s.responseWh.OwnerId)
	require.Equal(s.t, true, s.responseWh.CanEdit)

	return s
}
