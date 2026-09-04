package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var prayer0 = wh.Wh{
	Id:         "900000000000000000000000",
	OwnerId:    user0.Id,
	Visibility: wh.VisibilityPublic,
	Object: &wh.Prayer{
		Name:        "prayer 0",
		Description: fmt.Sprintf("owned by %s", user0.Username),
		Range:       "10",
		Target:      "2",
		Duration:    "5",
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var prayer1 = wh.Wh{
	Id:         "900000000000000000000001",
	OwnerId:    user1.Id,
	Visibility: wh.VisibilityPrivate,
	Object: &wh.Prayer{
		Name:        "prayer 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockPrayers() []*wh.Wh {
	return []*wh.Wh{&prayer0, &prayer1}
}
