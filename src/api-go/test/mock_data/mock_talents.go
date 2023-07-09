package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var talent0 = warhammer.Wh{
	Id:      "500000000000000000000000",
	OwnerId: user1.Id,
	Object: warhammer.WhTalent{
		Name:        "talent 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Tests:       "tests",
		MaxRank:     3,
		Attribute:   warhammer.WhAttBS,
		IsGroup:     false,
		Modifiers: warhammer.WhModifiers{
			Size:     1,
			Movement: 1,
			Attributes: warhammer.WhAttributes{
				WS:  1,
				BS:  2,
				S:   3,
				T:   4,
				I:   5,
				Ag:  6,
				Dex: 7,
				Int: 8,
				WP:  9,
				Fel: 10,
			},
		},
		Group:  []string{talent1.Id},
		Shared: false,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceArchivesOfTheEmpireVolI: "d",
			warhammer.WhSourceSeaOfClaws:              "e",
		},
	},
}

var talent1 = warhammer.Wh{
	Id:      "500000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.WhTalent{
		Name:        "talent 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockTalents() []*warhammer.Wh {
	return []*warhammer.Wh{&talent0, &talent1}
}
