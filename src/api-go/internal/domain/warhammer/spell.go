package warhammer

import "errors"

type SpellType int

const (
	SpellTypePetty   = 0
	SpellTypeRitual  = 1
	SpellTypeRegular = 2
	SpellTypeOther   = 3
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
	SpellLabelFire         = 13
	SpellLabelBeasts       = 14
	SpellLabelDaemonology  = 15
	SpellLabelNecromancy   = 16
	SpellLabelHedgeCraft   = 17
	SpellLabelWitchcraft   = 18
	SpellLabelNurgle       = 19
	SpellLabelSlaanesh     = 20
	SpellLabelTzeentch     = 21
	SpellLabelHighGeneral  = 22
	SpellLabelHighSlann    = 22
	SpellLabelGreatMaw     = 23
	SpellLabelLittleWaaagh = 24
	SpellLabelBigWaaagh    = 25
	SpellLabelPlague       = 26
	SpellLabelStealth      = 27
	SpellLabelRuin         = 28
	SpellLabelCustom       = 29
	SpellLabelArcane       = 30
)

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

type Spell struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Cn          int               `json:"cn" validate:"min=0,max=99"`
	Range       string            `json:"range" validate:"medium_string_valid"`
	Target      string            `json:"target" validate:"medium_string_valid"`
	Duration    string            `json:"duration" validate:"medium_string_valid"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
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
		Name:        spell.Name,
		Description: spell.Description,
		Cn:          spell.Cn,
		Range:       spell.Range,
		Target:      spell.Target,
		Duration:    spell.Duration,
		Shared:      spell.Shared,
		Source:      copySourceMap(spell.Source),
	}
}

func (spell *Spell) InitNilPointers() error {
	if spell == nil {
		return errors.New("spell pointer is nil")
	}

	if spell.Source == nil {
		spell.Source = map[Source]string{}
	}

	return nil
}
