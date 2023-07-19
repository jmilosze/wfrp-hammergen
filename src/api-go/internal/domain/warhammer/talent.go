package warhammer

import "strings"

type Talent struct {
	Name        string    `json:"name" validate:"name_valid"`
	Description string    `json:"description" validate:"desc_valid"`
	Tests       string    `json:"tests" validate:"medium_string_valid"`
	MaxRank     int       `json:"maxRank" validate:"gte=0,lte=99"`
	Attribute   Attribute `json:"attribute" validate:"att_type_valid"`
	IsGroup     bool      `json:"isGroup" validate:"boolean"`
	Modifiers   Modifiers `json:"modifiers"`
	Group       []string  `json:"group" validate:"dive,id_valid"`
	Shared      bool      `json:"shared" validate:"shared_valid"`
	Source      SourceMap `json:"source" validate:"source_valid"`
}

func (t Talent) IsShared() bool {
	return t.Shared
}

func (t Talent) InitAndCopy() WhObject {
	return Talent{
		Name:        strings.Clone(t.Name),
		Description: strings.Clone(t.Description),
		Tests:       strings.Clone(t.Tests),
		MaxRank:     t.MaxRank,
		Attribute:   t.Attribute.InitAndCopy(),
		IsGroup:     t.IsGroup,
		Modifiers:   t.Modifiers.InitAndCopy(),
		Group:       copyStringArray(t.Group),
		Shared:      t.Shared,
		Source:      t.Source.InitAndCopy(),
	}
}
