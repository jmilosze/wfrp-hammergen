package warhammer

import (
	"errors"
	"fmt"
)

type Career struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Class       CareerClass       `json:"class" validate:"class_valid"`
	Species     []CareerSpecies   `json:"species" validate:"dive,career_species_valid"`
	Level1      *CareerLevel      `json:"level1"`
	Level2      *CareerLevel      `json:"level2"`
	Level3      *CareerLevel      `json:"level3"`
	Level4      *CareerLevel      `json:"level4"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (career *Career) IsShared() (bool, error) {
	if career == nil {
		return false, errors.New("career pointer is nil")
	}

	return career.Shared, nil
}

func (career *Career) Copy() WhObject {
	if career == nil {
		return nil
	}

	return &Career{
		Name:        career.Name,
		Description: career.Description,
		Class:       career.Class,
		Species:     copyArray(career.Species),
		Level1:      career.Level1.Copy(),
		Level2:      career.Level2.Copy(),
		Level3:      career.Level3.Copy(),
		Level4:      career.Level4.Copy(),
		Shared:      career.Shared,
		Source:      copySourceMap(career.Source),
	}
}

func (career *Career) InitNilPointers() error {
	if career == nil {
		return errors.New("career pointer is nil")
	}

	if career.Species == nil {
		career.Species = []CareerSpecies{}
	}

	if career.Level1 == nil {
		career.Level1 = &CareerLevel{}
	}
	err := career.Level1.InitNilPointers()
	if err != nil {
		return err
	}

	if career.Level2 == nil {
		career.Level2 = &CareerLevel{}
	}
	err = career.Level2.InitNilPointers()
	if err != nil {
		return err
	}

	if career.Level3 == nil {
		career.Level3 = &CareerLevel{}
	}
	err = career.Level3.InitNilPointers()
	if err != nil {
		return err
	}

	if career.Level4 == nil {
		career.Level4 = &CareerLevel{}
	}
	err = career.Level4.InitNilPointers()
	if err != nil {
		return err
	}

	if career.Source == nil {
		career.Source = map[Source]string{}
	}

	return nil
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

func (careerLevel *CareerLevel) Copy() *CareerLevel {
	if careerLevel == nil {
		return nil
	}

	return &CareerLevel{
		Name:       careerLevel.Name,
		Status:     careerLevel.Status,
		Standing:   careerLevel.Standing,
		Attributes: copyArray(careerLevel.Attributes),
		Skills:     copyArray(careerLevel.Skills),
		Talents:    copyArray(careerLevel.Talents),
		Items:      careerLevel.Items,
	}
}

func (careerLevel *CareerLevel) InitNilPointers() error {
	if careerLevel == nil {
		return errors.New("careerLevel pointer is nil")
	}

	if careerLevel.Attributes == nil {
		careerLevel.Attributes = []Attribute{}
	}

	if careerLevel.Skills == nil {
		careerLevel.Skills = []string{}
	}

	if careerLevel.Talents == nil {
		careerLevel.Talents = []string{}
	}

	return nil
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
