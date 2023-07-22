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

func (input Attribute) InitAndCopy() Attribute {
	return input
}

func GetAttributeValidationAliases() map[string]string {
	return map[string]string{
		"att_type_valid": fmt.Sprintf("oneof=%s", attributeValues()),
	}
}
