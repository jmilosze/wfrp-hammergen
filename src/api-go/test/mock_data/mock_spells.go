package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var spell0 = wh.Wh{
	Id:         "200000000000000000000000",
	OwnerId:    user0.Id,
	Visibility: wh.VisibilityPublic,
	Object: &wh.Spell{
		Name:           "spell 0",
		Description:    fmt.Sprintf("owned by %s", user0.Username),
		Cn:             1,
		Range:          "10",
		Target:         "2",
		Duration:       "5",
		Classification: &wh.SpellClassification{Type: wh.SpellTypeLore, Labels: []wh.SpellLabel{wh.SpellLabelHedgecraft, wh.SpellLabelLight}},
		Shared:         false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var spell1 = wh.Wh{
	Id:      "200000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Spell{
		Name:        "spell 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockSpells() []*wh.Wh {
	return []*wh.Wh{&spell0, &spell1}
}
