package validator

import v "github.com/go-playground/validator/v10"

func NewValidator() *v.Validate {
	validate := v.New()
	configure(validate)
	return validate
}

func configure(v *v.Validate) {
	v.RegisterAlias("source_valid", "dive,keys,oneof=0 1 2 3 4 5 6 7 8 9 10 11,endkeys,min=0,max=15,excludesall=<>")
	v.RegisterAlias("name_valid", "min=0,max=200,excludesall=<>")
	v.RegisterAlias("desc_valid", "min=0,max=100000,excludesall=<>")
	v.RegisterAlias("shared_valid", "boolean")
	v.RegisterAlias("medium_string_valid", "min=0,max=200,excludesall=<>")
}
