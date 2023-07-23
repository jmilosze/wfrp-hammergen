package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var career0 = warhammer.Wh{
	Id:      "700000000000000000000000",
	OwnerId: user1.Id,
	Object: &warhammer.Career{
		Name:        "career 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Class:       warhammer.CareerClassRanger,
		Species:     []warhammer.CareerSpecies{warhammer.CareerSpeciesDwarf, warhammer.CareerSpeciesHuman},
		Level1: &warhammer.CareerLevel{
			Name:       "career 0 level 1",
			Status:     warhammer.StatusGold,
			Standing:   warhammer.StandingTwo,
			Attributes: []warhammer.Attribute{warhammer.AttBS, warhammer.AttWS, warhammer.AttDex},
			Skills:     []string{skill0.Id, skill1.Id},
			Talents:    []string{talent0.Id, talent1.Id},
			Items:      "some items",
		},
		Level2: &warhammer.CareerLevel{
			Name:       "career 0 level 2",
			Status:     warhammer.StatusGold,
			Standing:   warhammer.StandingFive,
			Attributes: []warhammer.Attribute{warhammer.AttInt},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "more items",
		},
		Level3: &warhammer.CareerLevel{
			Name:       "career 0 level 3",
			Status:     warhammer.StatusGold,
			Standing:   warhammer.StandingFive,
			Attributes: []warhammer.Attribute{warhammer.AttS},
			Skills:     []string{skill0.Id},
			Talents:    []string{talent0.Id},
			Items:      "even more items",
		},
		Level4: &warhammer.CareerLevel{
			Name:       "career 0 level 4",
			Status:     warhammer.StatusGold,
			Standing:   warhammer.StandingFive,
			Attributes: []warhammer.Attribute{},
			Skills:     []string{},
			Talents:    []string{},
			Items:      "more more more items",
		},
		Shared: false,
		Source: map[warhammer.Source]string{
			warhammer.SourceArchivesOfTheEmpireVolI: "d",
			warhammer.SourceSeaOfClaws:              "e",
		},
	},
}

var career1 = warhammer.Wh{
	Id:      "700000000000000000000001",
	OwnerId: user1.Id,
	Object: &warhammer.Career{
		Name:        "career 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockCareers() []*warhammer.Wh {
	return []*warhammer.Wh{&career0, &career1}
}
