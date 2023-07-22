package warhammer

import (
	"fmt"
	"strings"
)

type SkillType int

const (
	SkillTypeBasic    = 0
	SkillTypeAdvanced = 1
	SkillTypeMixed    = 2
)

func skillTypeValues() string {
	return formatIntegerValues([]ItemType{
		SkillTypeBasic,
		SkillTypeAdvanced,
		SkillTypeMixed,
	})
}

func (input SkillType) InitAndCopy() SkillType {
	return input
}

type Skill struct {
	Name        string    `json:"name" validate:"name_valid"`
	Description string    `json:"description" validate:"desc_valid"`
	Attribute   Attribute `json:"attribute" validate:"att_type_valid"`
	Type        SkillType `json:"type" validate:"skill_type_valid"`
	IsGroup     bool      `json:"isGroup" validate:"boolean"`
	DisplayZero bool      `json:"displayZero" validate:"boolean"`
	Group       []string  `json:"group" validate:"dive,id_valid"`
	Shared      bool      `json:"shared" validate:"shared_valid"`
	Source      SourceMap `json:"source" validate:"source_valid"`
}

func (s Skill) IsShared() bool {
	return s.Shared
}

func (s Skill) InitAndCopy() WhObject {
	return Skill{
		Name:        strings.Clone(s.Name),
		Description: strings.Clone(s.Description),
		Attribute:   s.Attribute.InitAndCopy(),
		Type:        s.Type.InitAndCopy(),
		IsGroup:     s.IsGroup,
		DisplayZero: s.DisplayZero,
		Group:       copyStringArray(s.Group),
		Shared:      s.Shared,
		Source:      s.Source.InitAndCopy(),
	}
}

func GetSkillValidationAliases() map[string]string {
	return map[string]string{
		"skill_type_valid": fmt.Sprintf("oneof=%s", skillTypeValues()),
	}
}
