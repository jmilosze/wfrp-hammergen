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

func (p *Property) IsShared() bool {
	return p.Shared
}

func (p *Property) Copy() WhObject {
	return &Property{
		Name:         p.Name,
		Description:  p.Description,
		Type:         p.Type,
		ApplicableTo: append([]ItemType(nil), p.ApplicableTo...),
		Shared:       p.Shared,
		Source:       p.Source.Copy(),
	}
}

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
