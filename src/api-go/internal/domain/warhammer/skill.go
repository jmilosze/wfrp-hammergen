package warhammer

import (
	"fmt"
)

type Skill struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Attribute   Attribute         `json:"attribute" validate:"att_type_valid"`
	Type        SkillType         `json:"type" validate:"skill_type_valid"`
	IsGroup     bool              `json:"isGroup" validate:"boolean"`
	DisplayZero bool              `json:"displayZero" validate:"boolean"`
	Group       []string          `json:"group" validate:"dive,id_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (skill *Skill) Init() {
	if skill.Group == nil {
		skill.Group = []string{}
	}
	if skill.Source == nil {
		skill.Source = map[Source]string{}
	}
}

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

func GetSkillValidationAliases() map[string]string {
	return map[string]string{
		"skill_type_valid": fmt.Sprintf("oneof=%s", skillTypeValues()),
	}
}
