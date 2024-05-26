package warhammer

import (
	"errors"
	"github.com/go-playground/validator/v10"
	"golang.org/x/exp/slices"
)

type SpellType int

const (
	SpellTypeOther   = 0
	SpellTypePetty   = 1
	SpellTypeRitual  = 2
	SpellTypeRegular = 3
)

type SpellLabel int

const (
	SpellLabelSkaven       = 0
	SpellLabelChaos        = 1
	SpellLabelColour       = 2
	SpellLabelDark         = 3
	SpellLabelWitch        = 4
	SpellLabelHigh         = 5
	SpellLabelWaaagh       = 6
	SpellLabelFimirMarsh   = 7
	SpellLabelLight        = 8
	SpellLabelMetal        = 9
	SpellLabelLife         = 10
	SpellLabelHeavens      = 11
	SpellLabelShadows      = 12
	SpellLabelDeath        = 13
	SpellLabelFire         = 14
	SpellLabelBeasts       = 15
	SpellLabelDaemonology  = 16
	SpellLabelNecromancy   = 17
	SpellLabelHedgeCraft   = 18
	SpellLabelWitchcraft   = 19
	SpellLabelNurgle       = 20
	SpellLabelSlaanesh     = 21
	SpellLabelTzeentch     = 22
	SpellLabelHighGeneral  = 23
	SpellLabelHighSlann    = 24
	SpellLabelGreatMaw     = 25
	SpellLabelLittleWaaagh = 26
	SpellLabelBigWaaagh    = 27
	SpellLabelPlague       = 28
	SpellLabelStealth      = 29
	SpellLabelRuin         = 30
	SpellLabelCustom       = 31
	SpellLabelArcane       = 32
)

var SpellTypes = []SpellType{SpellTypeOther, SpellTypePetty, SpellTypeRitual, SpellTypeRegular}

var SpellLabels = map[SpellType][]SpellLabel{
	SpellTypePetty: []SpellLabel{SpellLabelSkaven, SpellLabelChaos},
	SpellTypeRitual: []SpellLabel{
		SpellLabelSkaven,
		SpellLabelChaos,
		SpellLabelColour,
		SpellLabelDark,
		SpellLabelWitch,
		SpellLabelHigh,
		SpellLabelWaaagh,
		SpellLabelLight,
		SpellLabelMetal,
		SpellLabelLife,
		SpellLabelHeavens,
		SpellLabelShadows,
		SpellLabelDeath,
		SpellLabelFire,
		SpellLabelBeasts,
		SpellLabelDaemonology,
		SpellLabelNecromancy,
		SpellLabelHedgeCraft,
		SpellLabelWitchcraft,
		SpellLabelNurgle,
		SpellLabelSlaanesh,
		SpellLabelTzeentch,
		SpellLabelHighGeneral,
		SpellLabelHighSlann,
		SpellLabelGreatMaw,
		SpellLabelLittleWaaagh,
		SpellLabelBigWaaagh,
		SpellLabelPlague,
		SpellLabelStealth,
		SpellLabelRuin,
		SpellLabelCustom,
	},
	SpellTypeRegular: []SpellLabel{
		SpellLabelSkaven,
		SpellLabelChaos,
		SpellLabelColour,
		SpellLabelDark,
		SpellLabelWitch,
		SpellLabelHigh,
		SpellLabelWaaagh,
		SpellLabelLight,
		SpellLabelMetal,
		SpellLabelLife,
		SpellLabelHeavens,
		SpellLabelShadows,
		SpellLabelDeath,
		SpellLabelFire,
		SpellLabelBeasts,
		SpellLabelDaemonology,
		SpellLabelNecromancy,
		SpellLabelHedgeCraft,
		SpellLabelWitchcraft,
		SpellLabelNurgle,
		SpellLabelSlaanesh,
		SpellLabelTzeentch,
		SpellLabelHighGeneral,
		SpellLabelHighSlann,
		SpellLabelGreatMaw,
		SpellLabelLittleWaaagh,
		SpellLabelBigWaaagh,
		SpellLabelPlague,
		SpellLabelStealth,
		SpellLabelRuin,
		SpellLabelCustom,
		SpellLabelArcane,
	},
	SpellTypeOther: []SpellLabel{SpellLabelFimirMarsh, SpellLabelCustom},
}

type SpellClassification struct {
	Type   SpellType    `json:"type"`
	Labels []SpellLabel `json:"labels"`
}

func (classification *SpellClassification) Copy() *SpellClassification {
	if classification == nil {
		return nil
	}

	return &SpellClassification{
		Type:   classification.Type,
		Labels: copyArray(classification.Labels),
	}
}

type Spell struct {
	Name           string               `json:"name" validate:"name_valid"`
	Description    string               `json:"description" validate:"desc_valid"`
	Cn             int                  `json:"cn" validate:"min=0,max=99"`
	Range          string               `json:"range" validate:"medium_string_valid"`
	Target         string               `json:"target" validate:"medium_string_valid"`
	Duration       string               `json:"duration" validate:"medium_string_valid"`
	Classification *SpellClassification `json:"classification" validate:"spell_classification_valid"`
	Shared         bool                 `json:"shared" validate:"shared_valid"`
	Source         map[Source]string    `json:"source" validate:"source_valid"`
}

func (spell *Spell) IsShared() (bool, error) {
	if spell == nil {
		return false, errors.New("spell pointer is nil")
	}

	return spell.Shared, nil
}

func (spell *Spell) Copy() WhObject {
	if spell == nil {
		return nil
	}

	return &Spell{
		Name:           spell.Name,
		Description:    spell.Description,
		Cn:             spell.Cn,
		Range:          spell.Range,
		Target:         spell.Target,
		Duration:       spell.Duration,
		Classification: spell.Classification.Copy(),
		Shared:         spell.Shared,
		Source:         copySourceMap(spell.Source),
	}
}

func (spell *Spell) InitNilPointers() error {
	if spell == nil {
		return errors.New("spell pointer is nil")
	}

	if spell.Source == nil {
		spell.Source = map[Source]string{}
	}

	if spell.Classification == nil {
		spell.Classification = &SpellClassification{
			Type:   SpellTypeOther,
			Labels: []SpellLabel{},
		}
	}

	if spell.Classification.Labels == nil {
		spell.Classification.Labels = []SpellLabel{}
	}

	return nil
}

func CustomClassificationValidator(fl validator.FieldLevel) bool {
	sc, ok := fl.Field().Interface().(SpellClassification)
	if !ok {
		return false
	}

	if !slices.Contains(SpellTypes, sc.Type) {
		return false
	}

	if sc.Labels == nil {
		return false
	}

	for _, label := range sc.Labels {
		if !slices.Contains(SpellLabels[sc.Type], label) {
			return false
		}
	}

	return true
}
