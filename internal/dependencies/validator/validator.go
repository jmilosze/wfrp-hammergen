package validator

import (
	v "github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

func NewValidator() *v.Validate {
	validate := v.New()
	configure(validate)
	return validate
}

func configure(v *v.Validate) {
	for k, r := range warhammer.GetWhCommonValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhSourceValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhAttributeValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhMutationValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhPropertyValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhItemValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhSkillValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhCareerValidationAliases() {
		v.RegisterAlias(k, r)
	}
}
