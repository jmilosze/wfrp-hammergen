package warhammer

import (
	"fmt"
)

type RuneLabel int

const (
	RuneLabelWeapon      = 0
	RuneLabelArmour      = 1
	RuneLabelTalisman    = 2
	RuneLabelProtection  = 3
	RuneLabelEngineering = 4
	RuneLabelDoom        = 5
	RuneLabelMaster      = 6
)

func runeLabelValues() string {
	return formatIntegerValues([]RuneLabel{
		RuneLabelWeapon,
		RuneLabelArmour,
		RuneLabelTalisman,
		RuneLabelProtection,
		RuneLabelEngineering,
		RuneLabelDoom,
		RuneLabelMaster,
	})
}

type Rune struct {
	Name         string            `json:"name" validate:"name_valid"`
	Description  string            `json:"description" validate:"desc_valid"`
	Labels       []RuneLabel       `json:"labels" validate:"unique,dive,rune_label_valid"`
	ApplicableTo []ItemType        `json:"applicableTo" validate:"unique,dive,item_type_valid"`
	Source       map[Source]string `json:"source" validate:"source_valid"`
}

func (rune *Rune) Init() {
	if rune.Labels == nil {
		rune.Labels = []RuneLabel{}
	}
	if rune.ApplicableTo == nil {
		rune.ApplicableTo = []ItemType{}
	}
	if rune.Source == nil {
		rune.Source = map[Source]string{}
	}
}

func GetRuneValidationAliases() map[string]string {
	return map[string]string{
		"rune_label_valid": fmt.Sprintf("oneof=%s", runeLabelValues()),
	}
}
