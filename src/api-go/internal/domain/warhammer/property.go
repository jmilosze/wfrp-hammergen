package warhammer

import (
	"fmt"
	"strings"
)

type Property struct {
	Name         string       `json:"name" validate:"name_valid"`
	Description  string       `json:"description" validate:"desc_valid"`
	Type         PropertyType `json:"type" validate:"property_type_valid"`
	ApplicableTo []ItemType   `json:"applicableTo" validate:"dive,item_type_valid"`
	Shared       bool         `json:"shared" validate:"shared_valid"`
	Source       SourceMap    `json:"source" validate:"source_valid"`
}

func (p Property) IsShared() bool {
	return p.Shared
}

func (p Property) InitAndCopy() WhObject {
	return Property{
		Name:         strings.Clone(p.Name),
		Description:  strings.Clone(p.Description),
		Type:         p.Type.InitAndCopy(),
		ApplicableTo: copyApplicableTo(p.ApplicableTo),
		Shared:       p.Shared,
		Source:       p.Source.InitAndCopy(),
	}
}

func copyApplicableTo(input []ItemType) []ItemType {
	output := make([]ItemType, len(input))
	for i, v := range input {
		output[i] = v.InitAndCopy()
	}
	return output
}

type PropertyType int

const (
	PropertyTypeQuality = 0
	PropertyTypeFlaw    = 1
)

func getAllowedPropertyTypeValues() string {
	return formatIntegerValues([]PropertyType{PropertyTypeQuality, PropertyTypeFlaw})
}

func (input PropertyType) InitAndCopy() PropertyType {
	return input
}

func GetPropertyValidationAliases() map[string]string {
	return map[string]string{
		"property_type_valid": fmt.Sprintf("oneof=%s", getAllowedPropertyTypeValues()),
	}
}
