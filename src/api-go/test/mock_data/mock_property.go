package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var property0 = wh.Wh{
	Id:         "300000000000000000000000",
	OwnerId:    user0.Id,
	Visibility: wh.VisibilityPublic,
	Object: &wh.Property{
		Name:         "property 0",
		Description:  fmt.Sprintf("owned by %s", user0.Username),
		Type:         0,
		ApplicableTo: []wh.ItemType{0, 1, 2},
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var property1 = wh.Wh{
	Id:         "300000000000000000000001",
	OwnerId:    user1.Id,
	Visibility: wh.VisibilityPrivate,
	Object: &wh.Property{
		Name:        "property 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockProperties() []*wh.Wh {
	return []*wh.Wh{&property0, &property1}
}
