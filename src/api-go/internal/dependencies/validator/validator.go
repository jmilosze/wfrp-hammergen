package validator

import (
	v "github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"log"
)

func NewValidator() *v.Validate {
	validate := v.New()
	configure(validate)
	return validate
}

func configure(v *v.Validate) {
	for k, r := range warhammer.GetCommonValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetSourceValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetAttributeValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetMutationValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetPropertyValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetItemValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetSkillValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhCareerValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetCharacterValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetModifierValidationAliases() {
		v.RegisterAlias(k, r)
	}

	if err := v.RegisterValidation("spell_classification_valid", warhammer.CustomClassificationValidator); err != nil {
		log.Fatal(err)
	}
}
