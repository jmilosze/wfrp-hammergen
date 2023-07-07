package mock_data

import (
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

func NewMockGenProps() *warhammer.WhGenerationProps {
	return &warhammer.WhGenerationProps{
		Name: "generationProps",
		ClassItems: map[warhammer.WhCareerClass]warhammer.WhItems{
			warhammer.WhCareerClassBurghers: {
				Equipped: warhammer.WhIdNumberMap{itemMelee.Id: 1, itemArmour.Id: 1},
				Carried:  warhammer.WhIdNumberMap{itemOther.Id: 2},
				Stored:   warhammer.WhIdNumberMap{itemOther.Id: 2},
			},
		},
		RandomTalents: []warhammer.WhRandomTalent{
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
		SpeciesTalents: map[warhammer.WhCharacterSpecies]warhammer.WhSpeciesTalents{
			warhammer.WhCharacterSpeciesDwarfAltdorf: {
				Single:   []string{talent0.Id, talent1.Id},
				Multiple: [][]string{{talent0.Id, talent1.Id}, {talent0.Id, talent1.Id}},
			},
		},
		SpeciesSkills: map[warhammer.WhCharacterSpecies][]string{
			warhammer.WhCharacterSpeciesDwarfNorse: {skill1.Id, skill0.Id},
		},
	}
}
