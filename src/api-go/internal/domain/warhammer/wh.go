package warhammer

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Wh struct {
	Id      string   `json:"id"`
	OwnerId string   `json:"ownerId"`
	CanEdit bool     `json:"canEdit"`
	Object  WhObject `json:"object"`
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

func NewWhObject(t WhType) (WhObject, error) {
	switch t {
	case WhTypeMutation:
		return Mutation{}, nil
	case WhTypeSpell:
		return Spell{}, nil
	case WhTypeProperty:
		return Property{}, nil
	case WhTypeItem:
		return Item{}, nil
	case WhTypeTalent:
		return Talent{}, nil
	case WhTypeSkill:
		return Skill{}, nil
	case WhTypeCareer:
		return Career{}, nil
	case WhTypeCharacter:
		return Character{}, nil
	default:
		return nil, fmt.Errorf("invalid Wh type %s", t)
	}
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
