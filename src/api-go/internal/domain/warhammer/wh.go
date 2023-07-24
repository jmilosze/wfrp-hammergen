package warhammer

import (
	"encoding/json"
	"errors"
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
	WhTypeMutation      = "mutation"
	WhTypeSpell         = "spell"
	WhTypeProperty      = "property"
	WhTypeItem          = "item"
	WhTypeTalent        = "talent"
	WhTypeSkill         = "skill"
	WhTypeCareer        = "career"
	WhTypeCharacter     = "character"
	WhTypeOther         = "other"
	WhTypeItemFull      = "itemFull"
	WhTypeCharacterFull = "characterFull"
)

type WhType string

var WhCoreTypes = []WhType{
	WhTypeMutation,
	WhTypeSpell,
	WhTypeProperty,
	WhTypeItem,
	WhTypeTalent,
	WhTypeSkill,
	WhTypeCareer,
	WhTypeCharacter,
}

func (w *Wh) Copy() *Wh {
	if w == nil {
		return nil
	}

	wh := Wh{
		Id:      strings.Clone(w.Id),
		OwnerId: strings.Clone(w.OwnerId),
		CanEdit: w.CanEdit,
	}

	if w.Object != nil {
		wh.Object = w.Object.Copy()
	}

	return &wh
}

func (w *Wh) CopyHeaders() *Wh {
	if w == nil {
		return nil
	}

	return &Wh{
		Id:      strings.Clone(w.Id),
		OwnerId: strings.Clone(w.OwnerId),
		CanEdit: w.CanEdit,
	}
}

func (w *Wh) IsShared() (bool, error) {
	if w == nil {
		return false, errors.New("wh is nil")
	}

	if w.Object == nil {
		return false, errors.New("wh.object is nil")
	}

	return w.Object.IsShared(), nil
}

func NewWhObject(t WhType) WhObject {
	switch t {
	case WhTypeMutation:
		return &Mutation{}
	case WhTypeSpell:
		return &Spell{}
	case WhTypeProperty:
		return &Property{}
	case WhTypeItem:
		return &Item{}
	case WhTypeTalent:
		return &Talent{}
	case WhTypeSkill:
		return &Skill{}
	case WhTypeCareer:
		return &Career{}
	case WhTypeCharacter:
		return &Character{}
	case WhTypeItemFull:
		return &ItemFull{}
	case WhTypeCharacterFull:
		return &CharacterFull{}
	}

	return &Character{}
}

func (w *Wh) InitNilPointers(t WhType) {
	if w == nil {
		return
	}

	if w.Object == nil {
		w.Object = NewWhObject(t)
	}

	w.Object.InitNilPointers()

}

type WhObject interface {
	Copy() WhObject
	IsShared() bool
	InitNilPointers()
}

func (w *Wh) ToMap() (map[string]any, error) {
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
