package warhammer

import (
	"fmt"
)

type Visibility int

const (
	VisibilityPrivate Visibility = 0
	VisibilityShared  Visibility = 1
	VisibilityPublic  Visibility = 2
)

func getAllowedVisibilityValues() string {
	return formatIntegerValues([]Visibility{VisibilityPrivate, VisibilityShared, VisibilityPublic})
}

func GetWhValidationAliases() map[string]string {
	return map[string]string{
		"visibility_valid": fmt.Sprintf("oneof=%s", getAllowedVisibilityValues()),
	}
}

type WhObject interface {
	Init()
}

type Wh struct {
	Id         string     `json:"id"`
	OwnerId    string     `json:"ownerId"`
	Visibility Visibility `json:"visibility" validate:"visibility_valid"`
	Object     WhObject   `json:"object"`
}

func (w *Wh) Init() {
	if w != nil && w.Object != nil {
		w.Object.Init()
	}
}

const (
	WhTypeMutation      = "mutation"
	WhTypeSpell         = "spell"
	WhTypePrayer        = "prayer"
	WhTypeProperty      = "property"
	WhTypeItem          = "item"
	WhTypeTalent        = "talent"
	WhTypeSkill         = "skill"
	WhTypeCareer        = "career"
	WhTypeCharacter     = "character"
	WhTypeOther         = "other"
	WhTypeItemFull      = "itemFull"
	WhTypeCharacterFull = "characterFull"
	WhTypeTrait         = "trait"
	WhTypeRune          = "rune"
)

type WhType string

var WhCoreTypes = []WhType{
	WhTypeMutation,
	WhTypeSpell,
	WhTypePrayer,
	WhTypeProperty,
	WhTypeItem,
	WhTypeTalent,
	WhTypeSkill,
	WhTypeCareer,
	WhTypeCharacter,
	WhTypeTrait,
	WhTypeRune,
}

func (w *Wh) CopyHeaders() *Wh {
	if w == nil {
		return nil
	}

	return &Wh{
		Id:         w.Id,
		OwnerId:    w.OwnerId,
		Visibility: w.Visibility,
	}
}

func NewWhObject(t WhType) WhObject {
	var obj WhObject
	switch t {
	case WhTypeMutation:
		obj = &Mutation{}
	case WhTypeSpell:
		obj = &Spell{}
	case WhTypePrayer:
		obj = &Prayer{}
	case WhTypeProperty:
		obj = &Property{}
	case WhTypeItem:
		obj = &Item{}
	case WhTypeTalent:
		obj = &Talent{}
	case WhTypeSkill:
		obj = &Skill{}
	case WhTypeCareer:
		obj = &Career{}
	case WhTypeCharacter:
		obj = &Character{}
	case WhTypeItemFull:
		obj = &ItemFull{}
	case WhTypeCharacterFull:
		obj = &CharacterFull{}
	case WhTypeTrait:
		obj = &Trait{}
	case WhTypeRune:
		obj = &Rune{}
	default:
		return nil
	}
	obj.Init()
	return obj
}
