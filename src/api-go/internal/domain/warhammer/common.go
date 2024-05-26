package warhammer

import (
	"strconv"
	"strings"
)

func GetCommonValidationAliases() map[string]string {
	return map[string]string{
		"name_valid":          "min=0,max=200,excludesall=<>",
		"desc_valid":          "min=0,max=100000,excludesall=<>",
		"shared_valid":        "boolean",
		"medium_string_valid": "min=0,max=200,excludesall=<>",
		"id_valid":            "hexadecimal,len=24",
	}
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

func copyArray[T any](arr []T) []T {
	if arr != nil && len(arr) == 0 {
		return make([]T, 0)
	}
	return append([]T(nil), arr...)
}

func copyWhArray(input []*Wh) []*Wh {
	if input == nil {
		return nil
	}

	output := make([]*Wh, len(input))
	for i, v := range input {
		output[i] = v.Copy()
	}
	return output
}

func whListToIdWhMap(whList []*Wh) map[string]*Wh {
	allWhMap := make(map[string]*Wh, 0)
	for _, v := range whList {
		allWhMap[v.Id] = v
	}
	return allWhMap
}

func idListToWhList(idList []string, allIdWhMap map[string]*Wh) []*Wh {
	if idList == nil {
		return nil
	}

	whList := make([]*Wh, 0)
	for _, v := range idList {
		wh, ok := allIdWhMap[v]
		if ok {
			whList = append(whList, wh.Copy())
		}
	}
	return whList
}

func isUnique[T ~int](arr []T) bool {
	seen := make(map[T]bool)

	for _, value := range arr {
		if _, exists := seen[value]; exists {
			return false
		}
		seen[value] = true
	}

	return true
}
