package warhammer

import (
	"fmt"
	"strings"
)

type WhStatus int

const (
	WhStatusBrass  = 0
	WhStatusSilver = 1
	WhStatusGold   = 2
)

func statusValues() string {
	return formatIntegerValues([]WhStatus{WhStatusBrass, WhStatusSilver, WhStatusGold})
}

func (input WhStatus) InitAndCopy() WhStatus {
	return input
}

type WhStanding int

const (
	WhStandingZero  = 0
	WhStandingOne   = 1
	WhStandingTwo   = 2
	WhStandingThree = 3
	WhStandingFour  = 4
	WhStandingFive  = 5
	WhStandingSix   = 6
	WhStandingSeven = 7
)

func standingValues() string {
	return formatIntegerValues([]WhStanding{
		WhStandingZero,
		WhStandingOne,
		WhStandingTwo,
		WhStandingThree,
		WhStandingFour,
		WhStandingFive,
		WhStandingSix,
		WhStandingSeven,
	})
}

func (input WhStanding) InitAndCopy() WhStanding {
	return input
}

type WhCareerLevel struct {
	Name       string        `json:"name" validate:"name_valid"`
	Status     WhStatus      `json:"status" validate:"status_valid"`
	Standing   WhStanding    `json:"standing" validate:"standing_valid"`
	Attributes []WhAttribute `json:"attributes" validate:"dive,att_type_valid"`
	Skills     []string      `json:"skills" validate:"dive,id_valid"`
	Talents    []string      `json:"talents" validate:"dive,id_valid"`
	Items      string        `json:"items" validate:"desc_valid"`
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

func careerSpeciesValues() string {
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
	Species     WhCareerSpecies `json:"species" validate:"career_species_valid"`
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
		"status_valid":         fmt.Sprintf("oneof=%s", statusValues()),
		"standing_valid":       fmt.Sprintf("oneof=%s", standingValues()),
		"class_valid":          fmt.Sprintf("oneof=%s", classValues()),
		"career_species_valid": fmt.Sprintf("oneof=%s", careerSpeciesValues()),
	}
}
