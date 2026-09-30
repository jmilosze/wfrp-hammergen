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

type Edition string

const (
	Edition4e Edition = "4e"
	Edition5e Edition = "5e"
)

var Editions = []Edition{Edition4e, Edition5e}

type WhObject interface {
	Init()
}

// Wh is a content document or a character.
// Content holds its edition variants in Editions. A character has one fixed Edition and its data in Object.
type Wh struct {
	Id         string               `json:"id"`
	OwnerId    string               `json:"ownerId"`
	Visibility Visibility           `json:"visibility" validate:"visibility_valid"`
	Edition    Edition              `json:"edition,omitempty"`
	Object     WhObject             `json:"object,omitempty"`
	Editions   map[Edition]WhObject `json:"editions,omitempty" validate:"dive"`
}

func (w *Wh) Init() {
	if w == nil {
		return
	}
	if w.Object != nil {
		w.Object.Init()
	}
	for _, v := range w.Editions {
		v.Init()
	}
}

// HasEditions tells whether documents of the type hold edition variants (content) or a single edition (characters).
func HasEditions(t WhType) bool {
	return t != WhTypeCharacter
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
		Edition:    w.Edition,
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
