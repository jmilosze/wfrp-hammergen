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

type WhObject = any

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
	switch t {
	case WhTypeMutation:
		return &Mutation{Source: map[Source]string{}}
	case WhTypeSpell:
		return &Spell{Source: map[Source]string{}}
	case WhTypePrayer:
		return &Prayer{Source: map[Source]string{}}
	case WhTypeProperty:
		return &Property{ApplicableTo: []ItemType{}, Source: map[Source]string{}}
	case WhTypeItem:
		return &Item{
			Properties: []string{},
			Runes:      []IdNumber{},
			Source:     map[Source]string{},
			Armour:     ItemArmour{Location: []ItemArmourLocation{}},
			Grimoire:   ItemGrimoire{Spells: []string{}},
		}
	case WhTypeTalent:
		return &Talent{Group: []string{}, Source: map[Source]string{}}
	case WhTypeSkill:
		return &Skill{Group: []string{}, Source: map[Source]string{}}
	case WhTypeCareer:
		return &Career{
			Species: []CareerSpecies{},
			Source:  map[Source]string{},
			Level1:  CareerLevel{Attributes: []Attribute{}, Skills: []string{}, Talents: []string{}},
			Level2:  CareerLevel{Attributes: []Attribute{}, Skills: []string{}, Talents: []string{}},
			Level3:  CareerLevel{Attributes: []Attribute{}, Skills: []string{}, Talents: []string{}},
			Level4:  CareerLevel{Attributes: []Attribute{}, Skills: []string{}, Talents: []string{}},
			Level5:  CareerLevel{Attributes: []Attribute{}, Skills: []string{}, Talents: []string{}},
		}
	case WhTypeCharacter:
		return &Character{
			EquippedItems: []IdNumber{},
			CarriedItems:  []IdNumber{},
			StoredItems:   []IdNumber{},
			Skills:        []IdNumber{},
			Talents:       []IdNumber{},
			CareerPath:    []IdNumber{},
			Spells:        []string{},
			Prayers:       []string{},
			Traits:        []string{},
			Mutations:     []string{},
		}
	case WhTypeItemFull:
		return &ItemFull{
			Properties: []*Wh{},
			Runes:      []WhNumber{},
			Source:     map[Source]string{},
			Armour:     ItemArmour{Location: []ItemArmourLocation{}},
			Grimoire:   ItemGrimoireFull{Spells: []*Wh{}},
		}
	case WhTypeCharacterFull:
		return &CharacterFull{
			EquippedItems: []WhNumber{},
			CarriedItems:  []WhNumber{},
			StoredItems:   []WhNumber{},
			Skills:        []WhNumber{},
			Talents:       []WhNumber{},
			CareerPath:    []WhNumber{},
			Spells:        []*Wh{},
			Prayers:       []*Wh{},
			Traits:        []*Wh{},
			Mutations:     []*Wh{},
		}
	case WhTypeTrait:
		return &Trait{Source: map[Source]string{}}
	case WhTypeRune:
		return &Rune{Labels: []RuneLabel{}, ApplicableTo: []ItemType{}, Source: map[Source]string{}}
	}

	return &Character{}
}
