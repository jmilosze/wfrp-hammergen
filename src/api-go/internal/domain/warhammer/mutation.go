package warhammer

import (
	"fmt"
	"strings"
)

type Mutation struct {
	Name        string       `json:"name" validate:"name_valid"`
	Description string       `json:"description" validate:"desc_valid"`
	Type        MutationType `json:"type" validate:"mutation_type_valid"`
	Modifiers   Modifiers    `json:"modifiers"`
	Shared      bool         `json:"shared" validate:"shared_valid"`
	Source      SourceMap    `json:"source" validate:"source_valid"`
}

func (m Mutation) IsShared() bool {
	return m.Shared
}

func (m Mutation) InitAndCopy() WhObject {
	return Mutation{
		Name:        strings.Clone(m.Name),
		Description: strings.Clone(m.Description),
		Type:        m.Type.InitAndCopy(),
		Modifiers:   m.Modifiers.InitAndCopy(),
		Shared:      m.Shared,
		Source:      m.Source.InitAndCopy(),
	}
}

type MutationType int

const (
	MutationTypePhysical = 0
	MutationTypeMental   = 1
)

func mutationTypeValues() string {
	return formatIntegerValues([]MutationType{MutationTypePhysical, MutationTypeMental})
}

func (input MutationType) InitAndCopy() MutationType {
	return input
}

func GetMutationValidationAliases() map[string]string {
	return map[string]string{
		"mutation_type_valid": fmt.Sprintf("oneof=%s", mutationTypeValues()),
	}
}
