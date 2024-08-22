package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var trait0 = wh.Wh{
	Id:      "900000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Trait{
		Name:        "trait 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Modifiers: &wh.Modifiers{
			Size:     1,
			Movement: 1,
			Attributes: &wh.Attributes{
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
		Shared: false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var trait1 = wh.Wh{
	Id:      "900000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Trait{
		Name:        "trait 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockTraits() []*wh.Wh {
	return []*wh.Wh{&trait0, &trait1}
}
