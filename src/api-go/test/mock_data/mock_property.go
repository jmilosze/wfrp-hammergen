package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var property0 = warhammer.Wh{
	Id:      "300000000000000000000000",
	OwnerId: "admin",
	Object: warhammer.WhProperty{
		Name:         "property 0",
		Description:  "owned by admin",
		Type:         0,
		ApplicableTo: []warhammer.WhItemType{0, 1, 2},
		Shared:       false,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceArchivesOfTheEmpireVolI: "d",
			warhammer.WhSourceSeaOfClaws:              "e",
		},
	},
}

var property1 = warhammer.Wh{
	Id:      "300000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.WhProperty{
		Name:        "property 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Shared:      false,
	},
}

func NewMockProperties() []*warhammer.Wh {
	return []*warhammer.Wh{&property0, &property1}
}
