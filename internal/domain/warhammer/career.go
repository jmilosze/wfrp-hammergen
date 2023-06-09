package warhammer

import (
	"fmt"
	"strings"
)

type WhCareerStatus int

const (
	WhCareerStatusBrass  = 0
	WhCareerStatusSilver = 1
	WhCareerStatusGold   = 2
)

func statusValues() string {
	return formatIntegerValues([]WhCareerStatus{WhCareerStatusBrass, WhCareerStatusSilver, WhCareerStatusGold})
}

func (input WhCareerStatus) InitAndCopy() WhCareerStatus {
	return input
}

type WhCareerStanding int

const (
	WhCareerStandingZero  = 0
	WhCareerStandingOne   = 1
	WhCareerStandingTwo   = 2
	WhCareerStandingThree = 3
	WhCareerStandingFour  = 4
	WhCareerStandingFive  = 5
	WhCareerStandingSix   = 6
	WhCareerStandingSeven = 7
)

func standingValues() string {
	return formatIntegerValues([]WhCareerStanding{
		WhCareerStandingZero,
		WhCareerStandingOne,
		WhCareerStandingTwo,
		WhCareerStandingThree,
		WhCareerStandingFour,
		WhCareerStandingFive,
		WhCareerStandingSix,
		WhCareerStandingSeven,
	})
}

func (input WhCareerStanding) InitAndCopy() WhCareerStanding {
	return input
}

type WhCareerLevel struct {
	Name       string           `json:"name" validate:"name_valid"`
	Status     WhCareerStatus   `json:"status" validate:"status_valid"`
	Standing   WhCareerStanding `json:"standing" validate:"standing_valid"`
	Attributes []WhAttribute    `json:"attributes" validate:"dive,att_type_valid"`
	Skills     []string         `json:"skills" validate:"dive,id_valid"`
	Talents    []string         `json:"talents" validate:"dive,id_valid"`
	Items      string           `json:"items" validate:"desc_valid"`
}

func (input WhCareerLevel) InitAndCopy() WhCareerLevel {
	return WhCareerLevel{
		Name:       strings.Clone(input.Name),
		Status:     input.Status.InitAndCopy(),
		Standing:   input.Standing.InitAndCopy(),
		Attributes: copyIntArray(input.Attributes),
		Skills:     copyStringArray(input.Skills),
		Talents:    copyStringArray(input.Talents),
		Items:      strings.Clone(input.Items),
	}
}

type WhCareerClass int

const (
	WhCareerClassAcademic  = 0
	WhCareerClassBurghers  = 1
	WhCareerClassCourtier  = 2
	WhCareerClassPeasant   = 3
	WhCareerClassRanger    = 4
	WhCareerClassRiverfolk = 5
	WhCareerClassRouge     = 6
	WhCareerClassWarrior   = 7
	WhCareerClassSeafarer  = 8
)

func classValues() string {
	return formatIntegerValues([]WhCareerClass{
		WhCareerClassAcademic,
		WhCareerClassBurghers,
		WhCareerClassCourtier,
		WhCareerClassPeasant,
		WhCareerClassRanger,
		WhCareerClassRiverfolk,
		WhCareerClassRouge,
		WhCareerClassWarrior,
		WhCareerClassSeafarer,
	})
}

func (input WhCareerClass) InitAndCopy() WhCareerClass {
	return input
}

type WhCareerSpecies int

const (
	WhCareerSpeciesHuman    = 0
	WhCareerSpeciesHalfling = 1
	WhCareerSpeciesDwarf    = 2
	WhCareerSpeciesHighElf  = 3
	WhCareerSpeciesWoodElf  = 4
	WhCareerSpeciesGnome    = 5
	WhCareerSpeciesOgre     = 6
)

func speciesValues() string {
	return formatIntegerValues([]WhCareerSpecies{
		WhCareerSpeciesHuman,
		WhCareerSpeciesHalfling,
		WhCareerSpeciesDwarf,
		WhCareerSpeciesHighElf,
		WhCareerSpeciesWoodElf,
		WhCareerClassRiverfolk,
		WhCareerSpeciesGnome,
		WhCareerSpeciesOgre,
	})
}

func (input WhCareerSpecies) InitAndCopy() WhCareerSpecies {
	return input
}

type WhCareer struct {
	Name        string          `json:"name" validate:"name_valid"`
	Description string          `json:"description" validate:"desc_valid"`
	Class       WhCareerClass   `json:"class" validate:"class_valid"`
	Species     WhCareerSpecies `json:"species" validate:"species_valid"`
	Level1      WhCareerLevel   `json:"level1"`
	Level2      WhCareerLevel   `json:"level2"`
	Level3      WhCareerLevel   `json:"level3"`
	Level4      WhCareerLevel   `json:"level4"`
	Shared      bool            `json:"shared" validate:"shared_valid"`
	Source      WhSourceMap     `json:"source" validate:"source_valid"`
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
		"status_valid":   fmt.Sprintf("oneof=%s", statusValues()),
		"standing_valid": fmt.Sprintf("oneof=%s", standingValues()),
		"class_valid":    fmt.Sprintf("oneof=%s", classValues()),
		"species_valid":  fmt.Sprintf("oneof=%s", speciesValues()),
	}
}
