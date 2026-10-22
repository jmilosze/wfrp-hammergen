package warhammer

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

// diceRegexp matches a fixed number ("10") or dice with an optional modifier ("1d10", "2d6+3", "1d10-1").
var diceRegexp = regexp.MustCompile(`^([1-9][0-9]{0,3}|[1-9][0-9]{0,2}d[1-9][0-9]{0,2}([+-][1-9][0-9]{0,3})?)$`)

func DiceValidator(fl validator.FieldLevel) bool {
	return diceRegexp.MatchString(fl.Field().String())
}
