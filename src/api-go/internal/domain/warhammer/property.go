package warhammer

import (
	"fmt"
	"strings"
)

type WhProperty struct {
	Name         string         `json:"name" validate:"name_valid"`
	Description  string         `json:"description" validate:"desc_valid"`
	Type         WhPropertyType `json:"type" validate:"property_type_valid"`
	ApplicableTo []WhItemType   `json:"applicableTo" validate:"dive,item_type_valid"`
	Shared       bool           `json:"shared" validate:"shared_valid"`
	Source       WhSourceMap    `json:"source" validate:"source_valid"`
}

func (p WhProperty) IsShared() bool {
	return p.Shared
}

func (p WhProperty) InitAndCopy() WhObject {
	return WhProperty{
		Name:         strings.Clone(p.Name),
		Description:  strings.Clone(p.Description),
		Type:         p.Type.InitAndCopy(),
		ApplicableTo: copyApplicableTo(p.ApplicableTo),
		Shared:       p.Shared,
		Source:       p.Source.InitAndCopy(),
	}
}

func copyApplicableTo(input []WhItemType) []WhItemType {
	output := make([]WhItemType, len(input))
	for i, v := range input {
		output[i] = v.InitAndCopy()
	}
	return output
}

type WhPropertyType int

func (input WhPropertyType) InitAndCopy() WhPropertyType {
	return input
}

func getAllowedPropertyType() string {
	return formatAllowedIntTypesFromMap(map[string]int{
		"quality": 0,
		"flaw":    1,
	})
}

func GetWhPropertyValidationAliases() map[string]string {
	return map[string]string{
		"property_type_valid": fmt.Sprintf("oneof=%s", getAllowedPropertyType()),
	}
}
