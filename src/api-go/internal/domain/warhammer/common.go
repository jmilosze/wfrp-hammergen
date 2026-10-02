package warhammer

import (
	"strconv"
	"strings"
)

func GetCommonValidationAliases() map[string]string {
	return map[string]string{
		"name_valid":          "min=0,max=200,excludesall=<>",
		"desc_valid":          "min=0,max=100000,excludesall=<>",
		"medium_string_valid": "min=0,max=200,excludesall=<>",
		"id_valid":            "hexadecimal,len=24",
		"value_valid":         "max=20,excludesall=<>",
	}
}

func formatIntegerValues[T ~int](list []T) string {
	values := make([]string, 0, len(list))
	for _, v := range list {
		values = append(values, strconv.Itoa(int(v)))
	}
	return strings.Join(values, " ")
}

func formatStringValues[T ~string](list []T) string {
	values := make([]string, 0, len(list))
	for _, v := range list {
		values = append(values, string(v))
	}
	return strings.Join(values, " ")
}

func whListToIdWhMap(whList []*Wh) map[string]*Wh {
	allWhMap := make(map[string]*Wh, len(whList))
	for _, v := range whList {
		allWhMap[v.Id] = v
	}
	return allWhMap
}

func idListToWhList(idList []string, allIdWhMap map[string]*Wh) []*Wh {
	if len(idList) == 0 {
		return []*Wh{}
	}

	whList := make([]*Wh, 0, len(idList))
	for _, v := range idList {
		if wh, ok := allIdWhMap[v]; ok {
			whList = append(whList, wh)
		}
	}
	return whList
}

// IdValue references an entity together with its value, e.g. Ward with "8" or Hatred with "Elves".
// The value is shown only for entities that have HasValue set.
type IdValue struct {
	Id    string `json:"id" validate:"id_valid"`
	Value string `json:"value" validate:"value_valid"`
}

type WhValue struct {
	Wh    *Wh    `json:"wh"`
	Value string `json:"value"`
}

func idValueListToWhValueList(idValueList []IdValue, allIdWhMap map[string]*Wh) []WhValue {
	whValueList := make([]WhValue, 0, len(idValueList))
	for _, v := range idValueList {
		if wh, ok := allIdWhMap[v.Id]; ok {
			whValueList = append(whValueList, WhValue{Wh: wh, Value: v.Value})
		}
	}
	return whValueList
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
