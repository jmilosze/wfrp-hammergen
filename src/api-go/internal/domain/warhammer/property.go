package warhammer

import (
	"fmt"
)

type Property struct {
	Name         string            `json:"name" validate:"name_valid"`
	Description  string            `json:"description" validate:"desc_valid"`
	Type         PropertyType      `json:"type" validate:"property_type_valid"`
	ApplicableTo []ItemType        `json:"applicableTo" validate:"unique,dive,item_type_valid"`
	Source       map[Source]string `json:"source" validate:"source_valid"`
}

type PropertyType int

const (
	PropertyTypeQuality = 0
	PropertyTypeFlaw    = 1
)

func getAllowedPropertyTypeValues() string {
	return formatIntegerValues([]PropertyType{PropertyTypeQuality, PropertyTypeFlaw})
}

func GetPropertyValidationAliases() map[string]string {
	return map[string]string{
		"property_type_valid": fmt.Sprintf("oneof=%s", getAllowedPropertyTypeValues()),
	}
}
