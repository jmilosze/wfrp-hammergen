package warhammer

import (
	"fmt"
)

type Mutation struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Type        MutationType      `json:"type" validate:"mutation_type_valid"`
	Modifiers   Modifiers         `json:"modifiers"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
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
