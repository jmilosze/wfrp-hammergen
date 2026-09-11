package warhammer

import (
	"fmt"
)

type EffectType int

const (
	EffectTypeHardy = 0
)

func effectTypeValues() string {
	return formatIntegerValues([]EffectType{
		EffectTypeHardy,
	})
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

func GetModifierValidationAliases() map[string]string {
	return map[string]string{
		"effect_valid": fmt.Sprintf("oneof=%s", effectTypeValues()),
	}
}
