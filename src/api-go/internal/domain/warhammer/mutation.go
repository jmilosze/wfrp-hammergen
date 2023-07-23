package warhammer

import (
	"fmt"
)

type Mutation struct {
	Name        string       `json:"name" validate:"name_valid"`
	Description string       `json:"description" validate:"desc_valid"`
	Type        MutationType `json:"type" validate:"mutation_type_valid"`
	Modifiers   *Modifiers   `json:"modifiers"`
	Shared      bool         `json:"shared" validate:"shared_valid"`
	Source      SourceMap    `json:"source" validate:"source_valid"`
}

func (m *Mutation) IsShared() bool {
	return m.Shared
}

func (m *Mutation) Copy() WhObject {
	return &Mutation{
		Name:        m.Name,
		Description: m.Description,
		Type:        m.Type,
		Modifiers:   m.Modifiers.Copy(),
		Shared:      m.Shared,
		Source:      m.Source.Copy(),
	}
}

func NewMutation() *Mutation {
	return &Mutation{
		Modifiers: NewModifiers(),
		Source:    NewSourceMap(),
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

func GetMutationValidationAliases() map[string]string {
	return map[string]string{
		"mutation_type_valid": fmt.Sprintf("oneof=%s", mutationTypeValues()),
	}
}
