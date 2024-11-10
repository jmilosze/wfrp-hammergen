package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var rune0 = wh.Wh{
	Id:      "rune00000000000000000000",
	OwnerId: "admin",
	Object: &wh.Rune{
		Name:         "rune 0",
		Description:  "owned by admin",
		Labels:       []wh.RuneLabel{wh.RuneLabelArmour, wh.RuneLabelMaster},
		ApplicableTo: []wh.ItemType{0, 1, 2},
		Shared:       false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var rune1 = wh.Wh{
	Id:      "rune00000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Rune{
		Name:        "rune 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockRunes() []*wh.Wh {
	return []*wh.Wh{&rune0, &rune1}
}
