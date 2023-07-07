package warhammer

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Wh struct {
	Id      string
	OwnerId string
	CanEdit bool
	Object  WhObject
}

const (
	WhTypeMutation  = "mutation"
	WhTypeSpell     = "spell"
	WhTypeProperty  = "property"
	WhTypeItem      = "item"
	WhTypeTalent    = "talent"
	WhTypeSkill     = "skill"
	WhTypeCareer    = "career"
	WhTypeCharacter = "character"
	WhTypeOther     = "other"
)

type WhType string

var WhApiTypes = []WhType{
	WhTypeMutation,
	WhTypeSpell,
	WhTypeProperty,
	WhTypeItem,
	WhTypeTalent,
	WhTypeSkill,
	WhTypeCareer,
	WhTypeCharacter,
}

func NewApiWh(t WhType) (Wh, error) {
	var wh Wh

	switch t {
	case WhTypeMutation:
		wh.Object = &WhMutation{}
	case WhTypeSpell:
		wh.Object = &WhSpell{}
	case WhTypeProperty:
		wh.Object = &WhProperty{}
	case WhTypeItem:
		wh.Object = &WhItem{}
	case WhTypeTalent:
		wh.Object = &WhTalent{}
	case WhTypeSkill:
		wh.Object = &WhSkill{}
	case WhTypeCareer:
		wh.Object = &WhCareer{}
	case WhTypeCharacter:
		wh.Object = &WhCharacter{}
	default:
		return wh, fmt.Errorf("invalid Wh type %s", t)
	}

	return wh, nil
}

func (w Wh) InitAndCopy() Wh {
	return Wh{
		Id:      strings.Clone(w.Id),
		OwnerId: strings.Clone(w.OwnerId),
		CanEdit: w.CanEdit,
		Object:  w.Object.InitAndCopy(),
	}
}

func (w Wh) CopyHeaders() Wh {
	return Wh{
		Id:      strings.Clone(w.Id),
		OwnerId: strings.Clone(w.OwnerId),
		CanEdit: w.CanEdit,
	}
}

func (w Wh) PointToCopy() *Wh {
	cpy := w.InitAndCopy()
	return &cpy
}

func (w Wh) IsShared() bool {
	return w.Object.IsShared()
}

type WhObject interface {
	InitAndCopy() WhObject
	IsShared() bool
}

func (w Wh) ToMap() (map[string]any, error) {
	whMap, err := structToMap(w)
	if err != nil {
		return map[string]any{}, fmt.Errorf("error while mapping wh structure %s", err)
	}
	return whMap, nil
}

func structToMap(m any) (map[string]any, error) {
	a, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}
	var res map[string]any
	err = json.Unmarshal(a, &res)
	if err != nil {
		return nil, err
	}

	if res == nil {
		res = map[string]any{}
	}

	return res, nil
}
