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
	SpellLabelFimirMarsh   = 2
	SpellLabelLight        = 3
	SpellLabelMetal        = 4
	SpellLabelLife         = 5
	SpellLabelHeavens      = 6
	SpellLabelShadows      = 7
	SpellLabelDeath        = 8
	SpellLabelFire         = 9
	SpellLabelBeasts       = 10
	SpellLabelDaemonology  = 11
	SpellLabelNecromancy   = 12
	SpellLabelHedgeCraft   = 13
	SpellLabelWitchcraft   = 14
	SpellLabelNurgle       = 15
	SpellLabelSlaanesh     = 16
	SpellLabelTzeentch     = 17
	SpellLabelHighGeneral  = 18
	SpellLabelHighSlann    = 19
	SpellLabelGreatMaw     = 20
	SpellLabelLittleWaaagh = 21
	SpellLabelBigWaaagh    = 22
	SpellLabelPlague       = 23
	SpellLabelStealth      = 24
	SpellLabelRuin         = 25
	SpellLabelCustom       = 26
	SpellLabelArcane       = 27
)

var SpellTypes = []SpellType{SpellTypeOther, SpellTypePetty, SpellTypeRitual, SpellTypeRegular}

var SpellLabels = map[SpellType][]SpellLabel{
	SpellTypePetty: []SpellLabel{SpellLabelSkaven, SpellLabelChaos},
	SpellTypeRitual: []SpellLabel{
		SpellLabelSkaven,
		SpellLabelChaos,
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
