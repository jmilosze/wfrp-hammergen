package warhammer

import "testing"

func TestCareerValidateEdition(t *testing.T) {
	const skillId = "dddddddddddddddddddddddd"
	const otherId = "eeeeeeeeeeeeeeeeeeeeeeee"

	for name, tc := range map[string]struct {
		edition     Edition
		incomeSkill string
		wantErr     bool
	}{
		"4e without income skill":           {Edition4e, "", false},
		"4e with level 1 income skill":      {Edition4e, skillId, false},
		"4e with income skill not in level": {Edition4e, otherId, true},
		"5e without income skill":           {Edition5e, "", false},
		"5e with level 1 income skill":      {Edition5e, skillId, false},
		"5e with income skill not in level": {Edition5e, otherId, true},
	} {
		t.Run(name, func(t *testing.T) {
			career := &Career{Level1: CareerLevel{Skills: []string{skillId}}, IncomeSkill: tc.incomeSkill}
			if err := career.ValidateEdition(tc.edition); (err != nil) != tc.wantErr {
				t.Errorf("got error %v, want error %v", err, tc.wantErr)
			}
		})
	}
}

func TestCareerValidateEditionSpecies(t *testing.T) {
	all := []CareerSpecies{
		CareerSpeciesHuman, CareerSpeciesHalfling, CareerSpeciesDwarf, CareerSpeciesHighElf,
		CareerSpeciesWoodElf, CareerSpeciesGnome, CareerSpeciesOgre,
	}

	for name, tc := range map[string]struct {
		edition Edition
		species []CareerSpecies
		wantErr bool
	}{
		"4e with all species": {Edition4e, all, false},
		"5e with 5e species":  {Edition5e, all[:5], false},
		"5e with no species":  {Edition5e, []CareerSpecies{}, false},
		"5e with gnome":       {Edition5e, []CareerSpecies{CareerSpeciesHuman, CareerSpeciesGnome}, true},
		"5e with ogre":        {Edition5e, []CareerSpecies{CareerSpeciesOgre}, true},
	} {
		t.Run(name, func(t *testing.T) {
			career := &Career{Species: tc.species}
			if err := career.ValidateEdition(tc.edition); (err != nil) != tc.wantErr {
				t.Errorf("got error %v, want error %v", err, tc.wantErr)
			}
		})
	}
}
