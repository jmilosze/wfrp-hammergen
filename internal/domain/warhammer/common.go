package warhammer

import (
	"strconv"
	"strings"
)

func GetWhCommonValidationAliases() map[string]string {
	return map[string]string{
		"name_valid":          "min=0,max=200,excludesall=<>",
		"desc_valid":          "min=0,max=100000,excludesall=<>",
		"shared_valid":        "boolean",
		"medium_string_valid": "min=0,max=200,excludesall=<>",
		"id_valid":            "hexadecimal,len=24",
	}
}

func formatAllowedIntTypesFromMap[T ~int](list map[string]T) string {
	values := make([]string, len(list))
	for _, v := range list {
		values = append(values, strconv.Itoa(int(v)))
	}
	return strings.Join(values, " ")
}

func formatIntegerValues[T ~int](list []T) string {
	values := make([]string, len(list))
	for _, v := range list {
		values = append(values, strconv.Itoa(int(v)))
	}
	return strings.Join(values, " ")
}

func formatStringValues[T ~string](list []T) string {
	values := make([]string, len(list))
	for _, v := range list {
		values = append(values, string(v))
	}
	return strings.Join(values, " ")
}

func copyStringArray(input []string) []string {
	output := make([]string, len(input))
	for i, v := range input {
		output[i] = strings.Clone(v)
	}
	return output
}
