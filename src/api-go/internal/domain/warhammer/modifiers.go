package warhammer

import (
	"errors"
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
	Attributes *Attributes  `json:"attributes"`
	Effects    []EffectType `json:"effects" validate:"unique,dive,effect_valid"`
}

func (modifiers *Modifiers) Copy() *Modifiers {
	if modifiers == nil {
		return nil
	}

	return &Modifiers{
		Size:       modifiers.Size,
		Movement:   modifiers.Movement,
		Attributes: modifiers.Attributes.Copy(),
		Effects:    copyArray(modifiers.Effects),
	}
}

func (modifiers *Modifiers) InitNilPointers() error {
	if modifiers == nil {
		return errors.New("talent pointer is nil")
	}

	if modifiers.Attributes == nil {
		modifiers.Attributes = &Attributes{}
	}

	if modifiers.Effects == nil {
		modifiers.Effects = []EffectType{}
	}

	return nil
}

func GetModifierValidationAliases() map[string]string {
	return map[string]string{
		"effect_valid": fmt.Sprintf("oneof=%s", effectTypeValues()),
	}
}
