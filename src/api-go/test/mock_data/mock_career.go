package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var career0 = warhammer.Wh{
	Id:      "700000000000000000000000",
	OwnerId: user1.Id,
	Object: warhammer.WhCareer{
		Name:        "career 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Class:       warhammer.WhCareerClassRanger,
		Species:     warhammer.WhCareerSpeciesDwarf,
		Level1: warhammer.WhCareerLevel{
			Name:       "career 0 level 1",
			Status:     warhammer.WhStatusGold,
			Standing:   warhammer.WhStandingTwo,
			Attributes: []warhammer.WhAttribute{warhammer.WhAttBS, warhammer.WhAttWS, warhammer.WhAttDex},
			Skills:     []string{skill0.Id, skill1.Id},
			Talents:    []string{talent0.Id, talent1.Id},
			Items:      "some items",
		},
		Level2: warhammer.WhCareerLevel{
			Name:       "career 0 level 2",
			Status:     warhammer.WhStatusGold,
			Standing:   warhammer.WhStandingFive,
			Attributes: []warhammer.WhAttribute{warhammer.WhAttInt},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "more items",
		},
		Level3: warhammer.WhCareerLevel{
			Name:       "career 0 level 3",
			Status:     warhammer.WhStatusGold,
			Standing:   warhammer.WhStandingFive,
			Attributes: []warhammer.WhAttribute{warhammer.WhAttS},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "even more items",
		},
		Level4: warhammer.WhCareerLevel{
			Name:       "career 0 level 4",
			Status:     warhammer.WhStatusGold,
			Standing:   warhammer.WhStandingFive,
			Attributes: []warhammer.WhAttribute{},
			Skills:     []string{},
			Talents:    []string{},
			Items:      "more more more items",
		},
		Shared: false,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceArchivesOfTheEmpireVolI: "d",
			warhammer.WhSourceSeaOfClaws:              "e",
		},
	},
}

var career1 = warhammer.Wh{
	Id:      "700000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.WhCareer{
		Name:        "career 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockCareers() []*warhammer.Wh {
	return []*warhammer.Wh{&career0, &career1}
}
