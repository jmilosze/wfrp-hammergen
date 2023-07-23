package warhammer

import (
	"fmt"
)

type Source string

const (
	SourceCustom                    = "0"
	SourceWFRP                      = "1"
	SourceRoughNightsAndHardDays    = "2"
	SourceArchivesOfTheEmpireVolI   = "3"
	SourceArchivesOfTheEmpireVolII  = "4"
	SourceArchivesOfTheEmpireVolIII = "5"
	SourceUpInArms                  = "6"
	SourceWindsOfMagic              = "7"
	SourceMiddenheim                = "8"
	SourceSalzenmund                = "9"
	SourceSeaOfClaws                = "10"
	SourceLustria                   = "11"
)

func sourceValues() string {
	return formatStringValues([]Source{
		SourceCustom,
		SourceWFRP,
		SourceRoughNightsAndHardDays,
		SourceArchivesOfTheEmpireVolI,
		SourceArchivesOfTheEmpireVolII,
		SourceArchivesOfTheEmpireVolIII,
		SourceUpInArms,
		SourceWindsOfMagic,
		SourceMiddenheim,
		SourceSalzenmund,
		SourceSeaOfClaws,
		SourceLustria,
	})
}

func copySourceMap(input map[Source]string) map[Source]string {
	if input == nil {
		return nil
	}

	output := make(map[Source]string, len(input))
	for key, value := range input {
		output[key] = value
	}
	return output
}

func GetSourceValidationAliases() map[string]string {
	return map[string]string{
		"source_valid": fmt.Sprintf("dive,keys,oneof=%s,endkeys,min=0,max=15,excludesall=<>", sourceValues()),
	}
}
