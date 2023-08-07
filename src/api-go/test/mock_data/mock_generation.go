package mock_data

import (
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

func NewMockGenProps() *wh.GenProps {
	return &wh.GenProps{
		Name: "generationProps",
		ClassItems: map[wh.CareerClass]*wh.GenItems{
			wh.CareerClassBurghers: {
				Equipped: wh.IdStringMap{itemMelee.Id: "1", itemArmour.Id: "1"},
				Carried:  wh.IdStringMap{itemOther.Id: "2"},
				Stored:   wh.IdStringMap{itemOther.Id: "2"},
			},
		},
		RandomTalents: []*wh.GenRandomTalent{
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
		SpeciesTalents: map[wh.CharacterSpecies][]string{
			wh.CharacterSpeciesDwarfAltdorf: {talent0.Id, talent1.Id, talent0.Id + "," + talent1.Id, talent0.Id + "," + talent1.Id},
		},
		SpeciesSkills: map[wh.CharacterSpecies][]string{
			wh.CharacterSpeciesDwarfNorse: {advanced0.Id, advanced1.Id},
		},
	}
}
