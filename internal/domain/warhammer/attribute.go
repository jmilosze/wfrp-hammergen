package warhammer

import (
	"fmt"
)

type WhAttribute int

const (
	WhAttNone    = 0
	WhAttWS      = 1
	WhAttBS      = 2
	WhAttS       = 3
	WhAttT       = 4
	WhAttI       = 5
	WhAttAg      = 6
	WhAttDex     = 7
	WhAttInt     = 8
	WhAttWP      = 9
	WhAttFel     = 10
	WhAttVarious = 11
)

func attributeValues() string {
	return formatIntegerValues([]WhAttribute{
		WhAttNone,
		WhAttWS,
		WhAttBS,
		WhAttS,
		WhAttT,
		WhAttI,
		WhAttAg,
		WhAttDex,
		WhAttInt,
		WhAttWP,
		WhAttFel,
		WhAttVarious,
	})
}

func (input WhAttribute) InitAndCopy() WhAttribute {
	return input
}

func GetWhAttributeValidationAliases() map[string]string {
	return map[string]string{
		"att_type_valid": fmt.Sprintf("oneof=%s", attributeValues()),
	}
}
