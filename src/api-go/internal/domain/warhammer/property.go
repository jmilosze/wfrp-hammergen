package warhammer

import (
	"errors"
	"fmt"
)

type Property struct {
	Name         string            `json:"name" validate:"name_valid"`
	Description  string            `json:"description" validate:"desc_valid"`
	Type         PropertyType      `json:"type" validate:"property_type_valid"`
	ApplicableTo []ItemType        `json:"applicableTo" validate:"dive,item_type_valid"`
	Shared       bool              `json:"shared" validate:"shared_valid"`
	Source       map[Source]string `json:"source" validate:"source_valid"`
}

func (property *Property) IsShared() (bool, error) {
	if property == nil {
		return false, errors.New("property pointer is nil")
	}

	return property.Shared, nil
}

func (property *Property) Copy() WhObject {
	if property == nil {
		return nil
	}

	return &Property{
		Name:         property.Name,
		Description:  property.Description,
		Type:         property.Type,
		ApplicableTo: copyArray(property.ApplicableTo),
		Shared:       property.Shared,
		Source:       copySourceMap(property.Source),
	}
}

func (property *Property) InitNilPointers() error {
	if property == nil {
		return errors.New("property pointer is nil")
	}

	if property.ApplicableTo == nil {
		property.ApplicableTo = []ItemType{}
	}

	if property.Source == nil {
		property.Source = map[Source]string{}
	}

	return nil
}

type PropertyType int

const (
	PropertyTypeQuality = 0
	PropertyTypeFlaw    = 1
	PropertyRune        = 2
)

func getAllowedPropertyTypeValues() string {
	return formatIntegerValues([]PropertyType{PropertyTypeQuality, PropertyTypeFlaw, PropertyRune})
}

func GetPropertyValidationAliases() map[string]string {
	return map[string]string{
		"property_type_valid": fmt.Sprintf("oneof=%s", getAllowedPropertyTypeValues()),
	}
}
