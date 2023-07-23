package warhammer

import (
	"fmt"
)

type Property struct {
	Name         string       `json:"name" validate:"name_valid"`
	Description  string       `json:"description" validate:"desc_valid"`
	Type         PropertyType `json:"type" validate:"property_type_valid"`
	ApplicableTo []ItemType   `json:"applicableTo" validate:"dive,item_type_valid"`
	Shared       bool         `json:"shared" validate:"shared_valid"`
	Source       SourceMap    `json:"source" validate:"source_valid"`
}

func (property *Property) IsShared() bool {
	return property.Shared
}

func (property *Property) Copy() WhObject {
	if property == nil {
		return nil
	}

	return &Property{
		Name:         property.Name,
		Description:  property.Description,
		Type:         property.Type,
		ApplicableTo: append([]ItemType(nil), property.ApplicableTo...),
		Shared:       property.Shared,
		Source:       property.Source.Copy(),
	}
}

//func (property *Property) InitNilPointers() {
//	if property.ApplicableTo == nil {
//		property.ApplicableTo = []ItemType{}
//	}
//
//	if property.Source == nil {
//		property.Source = NewSourceMap()
//	}
//}

func NewProperty() WhObject {
	return &Property{
		ApplicableTo: []ItemType{},
		Source:       NewSourceMap(),
	}
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
