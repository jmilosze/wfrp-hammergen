package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var spell0 = warhammer.Wh{
	Id:      "200000000000000000000000",
	OwnerId: "admin",
	Object: warhammer.Spell{
		Name:        "spell 0",
		Description: "owned by admin",
		Cn:          1,
		Range:       "10",
		Target:      "2",
		Duration:    "5",
		Shared:      false,
		Source: map[warhammer.Source]string{
			warhammer.SourceArchivesOfTheEmpireVolI: "d",
			warhammer.SourceSeaOfClaws:              "e",
		},
	},
}

var spell1 = warhammer.Wh{
	Id:      "200000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.Spell{
		Name:        "spell 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Shared:      false,
	},
}

func NewMockSpells() []*warhammer.Wh {
	return []*warhammer.Wh{&spell0, &spell1}
}
