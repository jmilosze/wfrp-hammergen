package warhammer

import (
	"errors"
	"fmt"
	"strings"
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

type Wh struct {
	Id         string     `json:"id"`
	OwnerId    string     `json:"ownerId"`
	Visibility Visibility `json:"visibility" validate:"visibility_valid"`
	Object     WhObject   `json:"object"`
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

func (w *Wh) Copy() *Wh {
	if w == nil {
		return nil
	}

	wh := Wh{
		Id:         strings.Clone(w.Id),
		OwnerId:    strings.Clone(w.OwnerId),
		Visibility: w.Visibility,
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
		Id:         strings.Clone(w.Id),
		OwnerId:    strings.Clone(w.OwnerId),
		Visibility: w.Visibility,
	}
}

func NewWhObject(t WhType) WhObject {
	switch t {
	case WhTypeMutation:
		return &Mutation{}
	case WhTypeSpell:
		return &Spell{}
	case WhTypePrayer:
		return &Prayer{}
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
	case WhTypeTrait:
		return &Trait{}
	case WhTypeRune:
		return &Rune{}
	}

	return &Character{}
}

func (w *Wh) InitNilPointers() error {
	if w == nil {
		return errors.New("wh pointer is nil")
	}

	if w.Object == nil {
		return errors.New("wh.object pointer is nil")
	}

	return w.Object.InitNilPointers()
}

type WhObject interface {
	Copy() WhObject
	InitNilPointers() error
}
