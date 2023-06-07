package warhammer

import (
	"fmt"
	"strings"
)

type WhSkillType int

const (
	WhSkillTypeBasic    = 0
	WhSkillTypeAdvanced = 1
	WhSkillTypeMixed    = 2
)

func skillTypeValues() string {
	return formatIntegerValues([]WhItemType{
		WhSkillTypeBasic,
		WhSkillTypeAdvanced,
		WhSkillTypeMixed,
	})
}

func (input WhSkillType) InitAndCopy() WhSkillType {
	return input
}

type WhSkill struct {
	Name        string      `json:"name" validate:"name_valid"`
	Description string      `json:"description" validate:"desc_valid"`
	Attribute   WhAttribute `json:"attribute" validate:"att_type_valid"`
	Type        WhSkillType `json:"type" validate:"skill_type_valid"`
	IsGroup     bool        `json:"isGroup" validate:"boolean"`
	DisplayZero bool        `json:"displayZero" validate:"boolean"`
	Group       []string    `json:"group" validate:"dive,id_valid"`
	Shared      bool        `json:"shared" validate:"shared_valid"`
	Source      WhSourceMap `json:"source" validate:"source_valid"`
}

func (t WhSkill) IsShared() bool {
	return t.Shared
}

func (t WhSkill) InitAndCopy() WhObject {
	return WhSkill{
		Name:        strings.Clone(t.Name),
		Description: strings.Clone(t.Description),
		Attribute:   t.Attribute.InitAndCopy(),
		Type:        t.Type.InitAndCopy(),
		IsGroup:     t.IsGroup,
		DisplayZero: t.DisplayZero,
		Group:       copyStringArray(t.Group),
		Shared:      t.Shared,
		Source:      t.Source.InitAndCopy(),
	}
}

func GetWhSkillValidationAliases() map[string]string {
	return map[string]string{
		"skill_type_valid": fmt.Sprintf("oneof=%s", skillTypeValues()),
	}
}
