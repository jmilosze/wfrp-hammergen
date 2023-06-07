package warhammer

import (
	"fmt"
	"strings"
)

type WhSource string

const (
	WhSourceCustom                    = "0"
	WhSourceWFRP                      = "1"
	WhSourceRoughNightsAndHardDays    = "2"
	WhSourceArchivesOfTheEmpireVolI   = "3"
	WhSourceArchivesOfTheEmpireVolII  = "4"
	WhSourceArchivesOfTheEmpireVolIII = "5"
	WhSourceUpInArms                  = "6"
	WhSourceWindsOfMagic              = "7"
	WhSourceMiddenheim                = "8"
	WhSourceSalzenmund                = "9"
	WhSourceSeaOfClaws                = "10"
	WhSourceLustria                   = "11"
)

func sourceValues() string {
	return formatStringValues([]WhSource{
		WhSourceCustom,
		WhSourceWFRP,
		WhSourceRoughNightsAndHardDays,
		WhSourceArchivesOfTheEmpireVolI,
		WhSourceArchivesOfTheEmpireVolII,
		WhSourceArchivesOfTheEmpireVolIII,
		WhSourceUpInArms,
		WhSourceWindsOfMagic,
		WhSourceMiddenheim,
		WhSourceSalzenmund,
		WhSourceSeaOfClaws,
		WhSourceLustria,
	})
}

type WhSourceMap map[WhSource]string

func (input WhSourceMap) InitAndCopy() WhSourceMap {
	output := make(WhSourceMap, len(input))
	for key, value := range input {
		output[key] = strings.Clone(value)
	}
	return output
}

func GetWhSourceValidationAliases() map[string]string {
	return map[string]string{
		"source_valid": fmt.Sprintf("dive,keys,oneof=%s,endkeys,min=0,max=15,excludesall=<>", sourceValues()),
	}
}
