package warhammer

import (
	"errors"
	"fmt"
	"slices"
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
	// IncomeSkill is the skill used to earn income. Optional: many existing careers have none.
	IncomeSkill string `json:"incomeSkill,omitempty" bson:"incomeskill,omitempty" validate:"omitempty,id_valid"`
}

// ValidateEdition checks rules that depend on the edition:
//   - income skill (every edition): when set, it must be one of the level 1 skills;
//   - species (5e): only the five 5e species.
func (career *Career) ValidateEdition(e Edition) error {
	if career.IncomeSkill != "" && !slices.Contains(career.Level1.Skills, career.IncomeSkill) {
		return errors.New("income skill must be one of the level 1 skills")
	}
	if e == Edition5e {
		for _, s := range career.Species {
			if !slices.Contains(careerSpecies5e, s) {
				return fmt.Errorf("species %d is not available in 5e", s)
			}
		}
	}
	return nil
}

func (career *Career) Init() {
	if career.Species == nil {
		career.Species = []CareerSpecies{}
	}
	if career.Source == nil {
		career.Source = map[Source]string{}
	}
	career.Level1.Init()
	career.Level2.Init()
	career.Level3.Init()
	career.Level4.Init()
	career.Level5.Init()
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

func (cl *CareerLevel) Init() {
	if cl.Attributes == nil {
		cl.Attributes = []Attribute{}
	}
	if cl.Skills == nil {
		cl.Skills = []string{}
	}
	if cl.Talents == nil {
		cl.Talents = []string{}
	}
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
	CareerClassRogue     = 6
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
		CareerClassRogue,
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

// careerSpecies5e are the species 5e careers can be open to.
var careerSpecies5e = []CareerSpecies{
	CareerSpeciesHuman,
	CareerSpeciesHalfling,
	CareerSpeciesDwarf,
	CareerSpeciesHighElf,
	CareerSpeciesWoodElf,
}

func careerSpeciesValues() string {
	return formatIntegerValues([]CareerSpecies{
		CareerSpeciesHuman,
		CareerSpeciesHalfling,
		CareerSpeciesDwarf,
		CareerSpeciesHighElf,
		CareerSpeciesWoodElf,
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
