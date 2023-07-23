package warhammer

import (
	"fmt"
)

type Attribute int

const (
	AttNone    = 0
	AttWS      = 1
	AttBS      = 2
	AttS       = 3
	AttT       = 4
	AttI       = 5
	AttAg      = 6
	AttDex     = 7
	AttInt     = 8
	AttWP      = 9
	AttFel     = 10
	AttVarious = 11
)

func attributeValues() string {
	return formatIntegerValues([]Attribute{
		AttNone,
		AttWS,
		AttBS,
		AttS,
		AttT,
		AttI,
		AttAg,
		AttDex,
		AttInt,
		AttWP,
		AttFel,
		AttVarious,
	})
}

func GetAttributeValidationAliases() map[string]string {
	return map[string]string{
		"att_type_valid": fmt.Sprintf("oneof=%s", attributeValues()),
	}
}

type Attributes struct {
	WS  int `json:"WS" validate:"min=-99,max=99"`
	BS  int `json:"BS" validate:"min=-99,max=99"`
	S   int `json:"S" validate:"min=-99,max=99"`
	T   int `json:"T" validate:"min=-99,max=99"`
	I   int `json:"I" validate:"min=-99,max=99"`
	Ag  int `json:"Ag" validate:"min=-99,max=99"`
	Dex int `json:"Dex" validate:"min=-99,max=99"`
	Int int `json:"Int" validate:"min=-99,max=99"`
	WP  int `json:"WP" validate:"min=-99,max=99"`
	Fel int `json:"Fel" validate:"min=-99,max=99"`
}

func (attributes *Attributes) Copy() *Attributes {
	if attributes == nil {
		return nil
	}

	return &Attributes{
		WS:  attributes.WS,
		BS:  attributes.BS,
		S:   attributes.S,
		T:   attributes.T,
		I:   attributes.I,
		Ag:  attributes.Ag,
		Dex: attributes.Dex,
		Int: attributes.Int,
		WP:  attributes.WP,
		Fel: attributes.Fel,
	}
}

func NewAttributes() *Attributes {
	return &Attributes{}
}
