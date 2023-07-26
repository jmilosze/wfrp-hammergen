package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var career0 = wh.Wh{
	Id:      "700000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Career{
		Name:        "career 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Class:       wh.CareerClassRanger,
		Species:     []wh.CareerSpecies{wh.CareerSpeciesDwarf, wh.CareerSpeciesHuman},
		Level1: &wh.CareerLevel{
			Name:       "career 0 level 1",
			Status:     wh.StatusGold,
			Standing:   wh.StandingTwo,
			Attributes: []wh.Attribute{wh.AttBS, wh.AttWS, wh.AttDex},
			Skills:     []string{skill0.Id, skill1.Id},
			Talents:    []string{talent0.Id, talent1.Id},
			Items:      "some items",
		},
		Level2: &wh.CareerLevel{
			Name:       "career 0 level 2",
			Status:     wh.StatusGold,
			Standing:   wh.StandingFive,
			Attributes: []wh.Attribute{wh.AttInt},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "more items",
		},
		Level3: &wh.CareerLevel{
			Name:       "career 0 level 3",
			Status:     wh.StatusGold,
			Standing:   wh.StandingFive,
			Attributes: []wh.Attribute{wh.AttS},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "even more items",
		},
		Level4: &wh.CareerLevel{
			Name:       "career 0 level 4",
			Status:     wh.StatusGold,
			Standing:   wh.StandingFive,
			Attributes: []wh.Attribute{},
			Skills:     []string{},
			Talents:    []string{},
			Items:      "more more more items",
		},
		Shared: false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var career1 = wh.Wh{
	Id:      "700000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Career{
		Name:        "career 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

var career2 = wh.Wh{
	Id:      "700000000000000000000002",
	OwnerId: "admin",
	Object: &wh.Career{
		Name:        "career 2",
		Description: fmt.Sprintf("owned by admin"),
	},
}

func NewMockCareers() []*wh.Wh {
	return []*wh.Wh{&career0, &career1, &career2}
}
