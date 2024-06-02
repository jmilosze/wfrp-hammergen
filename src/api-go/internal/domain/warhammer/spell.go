package warhammer

import (
	"errors"
	"github.com/go-playground/validator/v10"
	"golang.org/x/exp/slices"
)

type SpellType int

const (
	SpellTypeOther  = 0
	SpellTypePetty  = 1
	SpellTypeArcane = 2
	SpellTypeLore   = 3
)

type SpellLabel int

const (
	SpellLabelBeasts       = 0
	SpellLabelDeath        = 1
	SpellLabelFire         = 3
	SpellLabelHeavens      = 4
	SpellLabelLife         = 5
	SpellLabelLight        = 6
	SpellLabelMetal        = 7
	SpellLabelShadows      = 8
	SpellLabelDaemonology  = 9
	SpellLabelNecromancy   = 10
	SpellLabelHedgecraft   = 11
	SpellLabelWitchcraft   = 12
	SpellLabelNurgle       = 13
	SpellLabelSlaanesh     = 14
	SpellLabelTzeentch     = 15
	SpellLabelHighGeneral  = 16
	SpellLabelHighSlann    = 17
	SpellLabelBigWaaagh    = 18
	SpellLabelLittleWaaagh = 19
	SpellLabelPlague       = 20
	SpellLabelRuin         = 21
	SpellLabelStealth      = 22
	SpellLabelGreatMaw     = 23

	SpellLabelCustom     = 1000
	SpellLabelRitual     = 1001
	SpellLabelSkaven     = 1002
	SpellLabelChaos      = 1003
	SpellLabelFimirMarsh = 1004
)

var SpellTypes = []SpellType{SpellTypeOther, SpellTypePetty, SpellTypeArcane, SpellTypeLore}

var SpellLabels = map[SpellType][]SpellLabel{
	SpellTypePetty: []SpellLabel{
		SpellLabelSkaven,
		SpellLabelChaos,
	},
	SpellTypeArcane: []SpellLabel{
		SpellLabelSkaven,
		SpellLabelChaos,
	},
	SpellTypeLore: []SpellLabel{
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
		SpellLabelHedgecraft,
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
		SpellLabelRitual,
	},
	SpellTypeOther: []SpellLabel{
		SpellLabelFimirMarsh,
		SpellLabelCustom,
	},
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

	if !isUnique(sc.Labels) {
		return false
	}

	return true
}
