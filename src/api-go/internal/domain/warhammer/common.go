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

func copyWhArray(input []*Wh) []*Wh {
	output := make([]*Wh, len(input))
	for i, v := range input {
		output[i] = v.Copy()
	}
	return output
}

func idListToWhList(idList []string, allWh []*Wh) []*Wh {
	if idList == nil {
		return nil
	}

	allWhMap := make(map[string]*Wh, 0)
	for _, v := range allWh {
		allWhMap[v.Id] = v
	}

	whList := make([]*Wh, 0)
	for _, v := range idList {
		wh, ok := allWhMap[v]
		if ok {
			whList = append(whList, wh.Copy())
		} else {
			blankWh := New(WhTypeNone)
			whList = append(whList, blankWh)
		}
	}
	return whList
}
