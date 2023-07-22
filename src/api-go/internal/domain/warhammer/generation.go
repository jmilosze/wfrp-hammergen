package warhammer

import (
	"fmt"
	"strings"
)

type IdNumberMap map[string]int

func (input IdNumberMap) InitAndCopy() IdNumberMap {
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

func (input GenItems) InitAndCopy() GenItems {
	return GenItems{
		Equipped: input.Equipped.InitAndCopy(),
		Carried:  input.Carried.InitAndCopy(),
		Stored:   input.Stored.InitAndCopy(),
	}
}

type GenRandomTalent struct {
	Id      string `json:"id"`
	MinRoll int    `json:"minRoll"`
	MaxRoll int    `json:"maxRoll"`
}

func (input GenRandomTalent) InitAndCopy() GenRandomTalent {
	return GenRandomTalent{
		Id:      strings.Clone(input.Id),
		MinRoll: input.MinRoll,
		MaxRoll: input.MaxRoll,
	}
}

type GenSpeciesTalents struct {
	Single   []string   `json:"single"`
	Multiple [][]string `json:"multiple"`
}

func (input GenSpeciesTalents) InitAndCopy() GenSpeciesTalents {
	single := make([]string, len(input.Single))
	for k, v := range input.Single {
		single[k] = strings.Clone(v)
	}

	multiple := make([][]string, len(input.Multiple))
	for k1, v1 := range input.Multiple {
		multiple[k1] = make([]string, len(v1))
		for k2, v2 := range v1 {
			multiple[k1][k2] = strings.Clone(v2)
		}
	}

	return GenSpeciesTalents{Single: single, Multiple: multiple}
}

type GenProps struct {
	Name           string
	ClassItems     map[CareerClass]GenItems               `json:"classItems"`
	RandomTalents  []GenRandomTalent                      `json:"randomTalents"`
	SpeciesTalents map[CharacterSpecies]GenSpeciesTalents `json:"speciesTalents"`
	SpeciesSkills  map[CharacterSpecies][]string          `json:"speciesSkills"`
}

func (gp GenProps) InitAndCopy() GenProps {
	classItems := make(map[CareerClass]GenItems, len(gp.ClassItems))
	for k, v := range gp.ClassItems {
		classItems[k] = v.InitAndCopy()
	}

	randomTalents := make([]GenRandomTalent, len(gp.RandomTalents))
	for k, v := range gp.RandomTalents {
		randomTalents[k] = v.InitAndCopy()
	}

	speciesTalents := make(map[CharacterSpecies]GenSpeciesTalents, len(gp.SpeciesTalents))
	for k, v := range gp.SpeciesTalents {
		speciesTalents[k] = v.InitAndCopy()
	}

	speciesSkills := make(map[CharacterSpecies][]string, len(gp.SpeciesSkills))
	for k1, v1 := range gp.SpeciesSkills {
		skills := make([]string, len(v1))
		for k2, v2 := range v1 {
			skills[k2] = strings.Clone(v2)
		}
		speciesSkills[k1] = skills
	}

	return GenProps{
		Name:           strings.Clone(gp.Name),
		ClassItems:     classItems,
		RandomTalents:  randomTalents,
		SpeciesTalents: speciesTalents,
		SpeciesSkills:  speciesSkills,
	}
}

func (gp GenProps) PointToCopy() *GenProps {
	cpy := gp.InitAndCopy()
	return &cpy
}

func (gp GenProps) ToMap() (map[string]any, error) {
	gMap, err := structToMap(gp)
	if err != nil {
		return map[string]any{}, fmt.Errorf("error while mapping wh structure %s", err)
	}
	return gMap, nil
}

func GetGenPropsValidationAliases() map[string]string {
	return map[string]string{
		"id_number_map_valid": "dive,keys,id_valid,endkeys,gte=1,lte=1000",
	}
}
