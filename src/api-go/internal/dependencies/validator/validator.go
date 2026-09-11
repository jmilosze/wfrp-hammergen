package validator

import (
	"fmt"

	v "github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

func NewValidator() (*v.Validate, error) {
	validate := v.New()
	if err := configure(validate); err != nil {
		return nil, err
	}
	return validate, nil
}

func configure(v *v.Validate) error {
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
	for k, r := range warhammer.GetRuneValidationAliases() {
		v.RegisterAlias(k, r)
	}
	for k, r := range warhammer.GetWhValidationAliases() {
		v.RegisterAlias(k, r)
	}

	if err := v.RegisterValidation("spell_classification_valid", warhammer.SpellClassificationValidator); err != nil {
		return fmt.Errorf("failed to register spell_classification_valid validator: %w", err)
	}
	return nil
}
