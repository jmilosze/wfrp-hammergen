package warhammer

import (
	"fmt"
)

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

func (skill *Skill) IsShared() bool {
	return skill.Shared
}

func (skill *Skill) Copy() WhObject {
	if skill == nil {
		return nil
	}

	return &Skill{
		Name:        skill.Name,
		Description: skill.Description,
		Attribute:   skill.Attribute,
		Type:        skill.Type,
		IsGroup:     skill.IsGroup,
		DisplayZero: skill.DisplayZero,
		Group:       append([]string(nil), skill.Group...),
		Shared:      skill.Shared,
		Source:      skill.Source.Copy(),
	}
}

//func (skill *Skill) InitNilPointers() {
//	if skill.Group == nil {
//		skill.Group = []string{}
//	}
//
//	if skill.Source == nil {
//		skill.Source = NewSourceMap()
//	}
//}

func NewSkill() *Skill {
	return &Skill{
		Group:  []string{},
		Source: NewSourceMap(),
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
