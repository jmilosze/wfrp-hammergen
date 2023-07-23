package mock_data

import (
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

func NewMockGenProps() *warhammer.GenProps {
	return &warhammer.GenProps{
		Name: "generationProps",
		ClassItems: map[warhammer.CareerClass]*warhammer.GenItems{
			warhammer.CareerClassBurghers: {
				Equipped: warhammer.IdNumberMap{itemMelee.Id: 1, itemArmour.Id: 1},
				Carried:  warhammer.IdNumberMap{itemOther.Id: 2},
				Stored:   warhammer.IdNumberMap{itemOther.Id: 2},
			},
		},
		RandomTalents: []*warhammer.GenRandomTalent{
			{
				Id:      talent1.Id,
				MinRoll: 1,
				MaxRoll: 50,
			},
			{
				Id:      talent0.Id,
				MinRoll: 51,
				MaxRoll: 101,
			},
		},
		SpeciesTalents: map[warhammer.CharacterSpecies]*warhammer.GenSpeciesTalents{
			warhammer.CharacterSpeciesDwarfAltdorf: {
				Single:   []string{talent0.Id, talent1.Id},
				Multiple: [][]string{{talent0.Id, talent1.Id}, {talent0.Id, talent1.Id}},
			},
		},
		SpeciesSkills: map[warhammer.CharacterSpecies][]string{
			warhammer.CharacterSpeciesDwarfNorse: {skill1.Id, skill0.Id},
		},
	}
}
