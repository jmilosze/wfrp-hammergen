package warhammer

import (
	"fmt"
	"strings"
)

type Status int

const (
	StatusBrass  = 0
	StatusSilver = 1
	StatusGold   = 2
)

func statusValues() string {
	return formatIntegerValues([]Status{StatusBrass, StatusSilver, StatusGold})
}

func (input Status) InitAndCopy() Status {
	return input
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
	})
}

func (input Standing) InitAndCopy() Standing {
	return input
}

type CareerLevel struct {
	Name       string      `json:"name" validate:"name_valid"`
	Status     Status      `json:"status" validate:"status_valid"`
	Standing   Standing    `json:"standing" validate:"standing_valid"`
	Attributes []Attribute `json:"attributes" validate:"dive,att_type_valid"`
	Skills     []string    `json:"skills" validate:"dive,id_valid"`
	Talents    []string    `json:"talents" validate:"dive,id_valid"`
	Items      string      `json:"items" validate:"desc_valid"`
}

func (input CareerLevel) InitAndCopy() CareerLevel {
	return CareerLevel{
		Name:       strings.Clone(input.Name),
		Status:     input.Status.InitAndCopy(),
		Standing:   input.Standing.InitAndCopy(),
		Attributes: copyIntArray(input.Attributes),
		Skills:     copyStringArray(input.Skills),
		Talents:    copyStringArray(input.Talents),
		Items:      strings.Clone(input.Items),
	}
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

func (input CareerClass) InitAndCopy() CareerClass {
	return input
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

func (input CareerSpecies) InitAndCopy() CareerSpecies {
	return input
}

type WhCareer struct {
	Name        string        `json:"name" validate:"name_valid"`
	Description string        `json:"description" validate:"desc_valid"`
	Class       CareerClass   `json:"class" validate:"class_valid"`
	Species     CareerSpecies `json:"species" validate:"career_species_valid"`
	Level1      CareerLevel   `json:"level1"`
	Level2      CareerLevel   `json:"level2"`
	Level3      CareerLevel   `json:"level3"`
	Level4      CareerLevel   `json:"level4"`
	Shared      bool          `json:"shared" validate:"shared_valid"`
	Source      SourceMap     `json:"source" validate:"source_valid"`
}

func (c WhCareer) IsShared() bool {
	return c.Shared
}

func (c WhCareer) InitAndCopy() WhObject {
	return WhCareer{
		Name:        strings.Clone(c.Name),
		Description: strings.Clone(c.Description),
		Class:       c.Class.InitAndCopy(),
		Species:     c.Species.InitAndCopy(),
		Level1:      c.Level1.InitAndCopy(),
		Level2:      c.Level2.InitAndCopy(),
		Level3:      c.Level3.InitAndCopy(),
		Level4:      c.Level4.InitAndCopy(),
		Shared:      c.Shared,
		Source:      c.Source.InitAndCopy(),
	}
}

func GetWhCareerValidationAliases() map[string]string {
	return map[string]string{
		"status_valid":         fmt.Sprintf("oneof=%s", statusValues()),
		"standing_valid":       fmt.Sprintf("oneof=%s", standingValues()),
		"class_valid":          fmt.Sprintf("oneof=%s", classValues()),
		"career_species_valid": fmt.Sprintf("oneof=%s", careerSpeciesValues()),
	}
}
