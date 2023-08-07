package warhammer

import (
	"fmt"
	"strings"
)

type GenProps struct {
	Name           string
	ClassItems     map[CareerClass]*GenItems     `json:"classItems"`
	RandomTalents  []*GenRandomTalent            `json:"randomTalents"`
	SpeciesTalents map[CharacterSpecies][]string `json:"speciesTalents"`
	SpeciesSkills  map[CharacterSpecies][]string `json:"speciesSkills"`
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
		randomTalents = make([]*GenRandomTalent, len(genProps.RandomTalents))
		for k, v := range genProps.RandomTalents {
			randomTalents[k] = v.Copy()
		}
	}

	var speciesTalents map[CharacterSpecies][]string
	if genProps.SpeciesTalents != nil {
		speciesTalents = map[CharacterSpecies][]string{}
		for k1, v1 := range genProps.SpeciesTalents {
			talents := make([]string, len(v1))
			for k2, v2 := range v1 {
				talents[k2] = v2
			}
			speciesTalents[k1] = talents
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

func (genProps *GenProps) ToMap() (map[string]any, error) {
	gMap, err := structToMap(genProps)
	if err != nil {
		return map[string]any{}, fmt.Errorf("error while mapping wh structure %s", err)
	}
	return gMap, nil
}

type IdStringMap map[string]string

func (input IdStringMap) Copy() IdStringMap {
	if input == nil {
		return nil
	}

	output := make(IdStringMap, len(input))
	for key, value := range input {
		output[key] = value
	}
	return output
}

type GenItems struct {
	Equipped IdStringMap `json:"equipped"`
	Carried  IdStringMap `json:"carried"`
	Stored   IdStringMap `json:"stored"`
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
