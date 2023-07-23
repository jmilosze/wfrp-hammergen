package warhammer

import (
	"fmt"
	"strings"
)

type GenProps struct {
	Name           string
	ClassItems     map[CareerClass]*GenItems               `json:"classItems"`
	RandomTalents  []*GenRandomTalent                      `json:"randomTalents"`
	SpeciesTalents map[CharacterSpecies]*GenSpeciesTalents `json:"speciesTalents"`
	SpeciesSkills  map[CharacterSpecies][]string           `json:"speciesSkills"`
}

func (genProps *GenProps) Copy() *GenProps {
	if genProps == nil {
		return nil
	}

	var classItems map[CareerClass]*GenItems
	if genProps.ClassItems != nil {
		classItems = map[CareerClass]*GenItems{}
		for k, v := range genProps.ClassItems {
			classItems[k] = v.Copy()
		}
	}

	var randomTalents []*GenRandomTalent
	if genProps.RandomTalents != nil {
		randomTalents = []*GenRandomTalent{}
		for k, v := range genProps.RandomTalents {
			randomTalents[k] = v.Copy()
		}
	}

	var speciesTalents map[CharacterSpecies]*GenSpeciesTalents
	if genProps.SpeciesTalents != nil {
		speciesTalents = map[CharacterSpecies]*GenSpeciesTalents{}
		for k, v := range genProps.SpeciesTalents {
			speciesTalents[k] = v.Copy()
		}
	}

	var speciesSkills map[CharacterSpecies][]string
	if genProps.SpeciesSkills != nil {
		speciesSkills = map[CharacterSpecies][]string{}
		for k1, v1 := range genProps.SpeciesSkills {
			skills := make([]string, len(v1))
			for k2, v2 := range v1 {
				skills[k2] = v2
			}
			speciesSkills[k1] = skills
		}
	}

	return &GenProps{
		Name:           strings.Clone(genProps.Name),
		ClassItems:     classItems,
		RandomTalents:  randomTalents,
		SpeciesTalents: speciesTalents,
		SpeciesSkills:  speciesSkills,
	}
}

func (genProps GenProps) ToMap() (map[string]any, error) {
	gMap, err := structToMap(genProps)
	if err != nil {
		return map[string]any{}, fmt.Errorf("error while mapping wh structure %s", err)
	}
	return gMap, nil
}

type IdNumberMap map[string]int

func (input IdNumberMap) Copy() IdNumberMap {
	if input == nil {
		return nil
	}

	output := make(IdNumberMap, len(input))
	for key, value := range input {
		output[key] = value
	}
	return output
}

type GenItems struct {
	Equipped IdNumberMap `json:"equipped"`
	Carried  IdNumberMap `json:"carried"`
	Stored   IdNumberMap `json:"stored"`
}

func (input *GenItems) Copy() *GenItems {
	if input == nil {
		return nil
	}

	return &GenItems{
		Equipped: input.Equipped.Copy(),
		Carried:  input.Carried.Copy(),
		Stored:   input.Stored.Copy(),
	}
}

type GenRandomTalent struct {
	Id      string `json:"id"`
	MinRoll int    `json:"minRoll"`
	MaxRoll int    `json:"maxRoll"`
}

func (input *GenRandomTalent) Copy() *GenRandomTalent {
	if input == nil {
		return nil
	}

	return &GenRandomTalent{
		Id:      input.Id,
		MinRoll: input.MinRoll,
		MaxRoll: input.MaxRoll,
	}
}

type GenSpeciesTalents struct {
	Single   []string   `json:"single"`
	Multiple [][]string `json:"multiple"`
}

func (input *GenSpeciesTalents) Copy() *GenSpeciesTalents {
	if input == nil {
		return nil
	}

	var single []string
	if input.Single != nil {
		single = []string{}
		for k, v := range input.Single {
			single[k] = v
		}
	}

	var multiple [][]string
	if input.Multiple != nil {
		multiple = [][]string{}
		for k1, v1 := range input.Multiple {
			if v1 != nil {
				multiple[k1] = make([]string, len(v1))
				for k2, v2 := range v1 {
					multiple[k1][k2] = v2
				}
			} else {
				multiple[k1] = nil
			}
		}
	}

	return &GenSpeciesTalents{Single: single, Multiple: multiple}
}

func GetGenPropsValidationAliases() map[string]string {
	return map[string]string{
		"id_number_map_valid": "dive,keys,id_valid,endkeys,gte=1,lte=1000",
	}
}
