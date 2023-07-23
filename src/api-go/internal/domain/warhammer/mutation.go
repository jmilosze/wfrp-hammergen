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

func (mutation *Mutation) IsShared() bool {
	return mutation.Shared
}

func (mutation *Mutation) Copy() WhObject {
	if mutation == nil {
		return nil
	}

	return &Mutation{
		Name:        mutation.Name,
		Description: mutation.Description,
		Type:        mutation.Type,
		Modifiers:   mutation.Modifiers.Copy(),
		Shared:      mutation.Shared,
		Source:      mutation.Source.Copy(),
	}
}

//func (mutation *Mutation) InitNilPointers() {
//	if mutation.Modifiers == nil {
//		mutation.Modifiers = NewModifiers()
//	}
//
//	if mutation.Source == nil {
//		mutation.Source = NewSourceMap()
//	}
//}

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
