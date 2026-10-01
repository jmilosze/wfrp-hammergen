package warhammer

import (
	"fmt"
	"slices"
)

type EffectType int

const (
	EffectTypeHardy      = 0
	EffectTypeStrongBack = 1
	EffectTypeSturdy     = 2
)

func effectTypeValues() string {
	return formatIntegerValues([]EffectType{
		EffectTypeHardy,
		EffectTypeStrongBack,
		EffectTypeSturdy,
	})
}

// effectTypesByEdition lists the effects used by each edition's rules.
var effectTypesByEdition = map[Edition][]EffectType{
	Edition4e: {EffectTypeHardy},
	Edition5e: {EffectTypeHardy, EffectTypeStrongBack, EffectTypeSturdy},
}

type Modifiers struct {
	Size       int          `json:"size" validate:"min=-3,max=3"`
	Movement   int          `json:"movement" validate:"min=-3,max=3"`
	Attributes Attributes   `json:"attributes"`
	Effects    []EffectType `json:"effects" validate:"unique,dive,effect_valid"`
}

func (modifiers *Modifiers) Init() {
	if modifiers.Effects == nil {
		modifiers.Effects = []EffectType{}
	}
}

// ValidateEdition checks that every effect is used by the edition's rules.
func (modifiers *Modifiers) ValidateEdition(e Edition) error {
	for _, effect := range modifiers.Effects {
		if !slices.Contains(effectTypesByEdition[e], effect) {
			return fmt.Errorf("effect %d is not available in %s", effect, e)
		}
	}
	return nil
}

func GetModifierValidationAliases() map[string]string {
	return map[string]string{
		"effect_valid": fmt.Sprintf("oneof=%s", effectTypeValues()),
	}
}
