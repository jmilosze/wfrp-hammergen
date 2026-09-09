package warhammer

import (
	"fmt"
)

type Career struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Class       CareerClass       `json:"class" validate:"class_valid"`
	Species     []CareerSpecies   `json:"species" validate:"dive,career_species_valid"`
	Level1      CareerLevel       `json:"level1"`
	Level2      CareerLevel       `json:"level2"`
	Level3      CareerLevel       `json:"level3"`
	Level4      CareerLevel       `json:"level4"`
	Level5      CareerLevel       `json:"level5"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

type CareerLevel struct {
	Exists     bool        `json:"exists" validate:"boolean"`
	Name       string      `json:"name" validate:"name_valid"`
	Status     Status      `json:"status" validate:"status_valid"`
	Standing   Standing    `json:"standing" validate:"standing_valid"`
	Attributes []Attribute `json:"attributes" validate:"dive,att_type_valid"`
	Skills     []string    `json:"skills" validate:"dive,id_valid"`
	Talents    []string    `json:"talents" validate:"dive,id_valid"`
	Items      string      `json:"items" validate:"desc_valid"`
}

type Status int

const (
	StatusBrass  = 0
	StatusSilver = 1
	StatusGold   = 2
)

func statusValues() string {
	return formatIntegerValues([]Status{StatusBrass, StatusSilver, StatusGold})
}

type Standing int

const (
	StandingZero  = 0
	StandingOne   = 1
	StandingTwo   = 2
	StandingThree = 3
	StandingFour  = 4
	StandingFive  = 5
	StandingSix   = 6
	StandingSeven = 7
	StandingEight = 8
)

func standingValues() string {
	return formatIntegerValues([]Standing{
		StandingZero,
		StandingOne,
		StandingTwo,
		StandingThree,
		StandingFour,
		StandingFive,
		StandingSix,
		StandingSeven,
		StandingEight,
	})
}

type CareerClass int

const (
	CareerClassAcademic  = 0
	CareerClassBurghers  = 1
	CareerClassCourtier  = 2
	CareerClassPeasant   = 3
	CareerClassRanger    = 4
	CareerClassRiverfolk = 5
	CareerClassRouge     = 6
	CareerClassWarrior   = 7
	CareerClassSeafarer  = 8
)

func classValues() string {
	return formatIntegerValues([]CareerClass{
		CareerClassAcademic,
		CareerClassBurghers,
		CareerClassCourtier,
		CareerClassPeasant,
		CareerClassRanger,
		CareerClassRiverfolk,
		CareerClassRouge,
		CareerClassWarrior,
		CareerClassSeafarer,
	})
}

type CareerSpecies int

const (
	CareerSpeciesHuman    = 0
	CareerSpeciesHalfling = 1
	CareerSpeciesDwarf    = 2
	CareerSpeciesHighElf  = 3
	CareerSpeciesWoodElf  = 4
	CareerSpeciesGnome    = 5
	CareerSpeciesOgre     = 6
)

func careerSpeciesValues() string {
	return formatIntegerValues([]CareerSpecies{
		CareerSpeciesHuman,
		CareerSpeciesHalfling,
		CareerSpeciesDwarf,
		CareerSpeciesHighElf,
		CareerSpeciesWoodElf,
		CareerClassRiverfolk,
		CareerSpeciesGnome,
		CareerSpeciesOgre,
	})
}

func GetWhCareerValidationAliases() map[string]string {
	return map[string]string{
		"status_valid":         fmt.Sprintf("oneof=%s", statusValues()),
		"standing_valid":       fmt.Sprintf("oneof=%s", standingValues()),
		"class_valid":          fmt.Sprintf("oneof=%s", classValues()),
		"career_species_valid": fmt.Sprintf("oneof=%s", careerSpeciesValues()),
	}
}
