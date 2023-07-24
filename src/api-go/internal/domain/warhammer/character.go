package warhammer

import (
	"errors"
	"fmt"
)

type Character struct {
	Name              string           `json:"name" validate:"name_valid"`
	Description       string           `json:"description" validate:"desc_valid"`
	Notes             string           `json:"notes" validate:"desc_valid"`
	EquippedItems     []*IdNumber      `json:"equippedItems" validate:"dive"`
	CarriedItems      []*IdNumber      `json:"carriedItems" validate:"dive"`
	StoredItems       []*IdNumber      `json:"storedItems" validate:"dive"`
	Skills            []*IdNumber      `json:"skills" validate:"dive"`
	Talents           []*IdNumber      `json:"talents" validate:"dive"`
	Species           CharacterSpecies `json:"species" validate:"character_species_valid"`
	BaseAttributes    *Attributes      `json:"baseAttributes"`
	AttributeAdvances *Attributes      `json:"attributeAdvances"`
	CareerPath        []string         `json:"careerPath" validate:"dive,id_valid"`
	Career            string           `json:"career" validate:"id_valid"`
	Fate              int              `json:"fate" validate:"gte=0,lte=1000"`
	Fortune           int              `json:"fortune" validate:"gte=0,lte=1000"`
	Resilience        int              `json:"resilience" validate:"gte=0,lte=1000"`
	Resolve           int              `json:"resolve" validate:"gte=0,lte=1000"`
	CurrentExp        int              `json:"currentExp" validate:"gte=0,lte=10000000"`
	SpentExp          int              `json:"spentExp" validate:"gte=0,lte=10000000"`
	Status            Status           `json:"status" validate:"status_valid"`
	Standing          Standing         `json:"standing" validate:"standing_valid"`
	Brass             int              `json:"brass" validate:"gte=0,lte=1000000"`
	Silver            int              `json:"silver" validate:"gte=0,lte=1000000"`
	Gold              int              `json:"gold" validate:"gte=0,lte=1000000"`
	Spells            []string         `json:"spells" validate:"dive,id_valid"`
	Sin               int              `json:"sin" validate:"gte=0,lte=1000"`
	Corruption        int              `json:"corruption" validate:"gte=0,lte=1000"`
	Mutations         []string         `json:"mutations" validate:"dive,id_valid"`
	Shared            bool             `json:"shared" validate:"shared_valid"`
}

func (character *Character) IsShared() (bool, error) {
	if character == nil {
		return false, errors.New("character pointer is nil")
	}

	return character.Shared, nil
}

func (character *Character) Copy() WhObject {
	if character == nil {
		return nil
	}

	return &Character{
		Name:              character.Name,
		Description:       character.Description,
		Notes:             character.Notes,
		EquippedItems:     copyArrayIdNumber(character.EquippedItems),
		CarriedItems:      copyArrayIdNumber(character.CarriedItems),
		StoredItems:       copyArrayIdNumber(character.StoredItems),
		Skills:            copyArrayIdNumber(character.Skills),
		Talents:           copyArrayIdNumber(character.Talents),
		Species:           character.Species,
		BaseAttributes:    character.BaseAttributes.Copy(),
		AttributeAdvances: character.AttributeAdvances.Copy(),
		CareerPath:        append([]string(nil), character.CareerPath...),
		Career:            character.Career,
		Fate:              character.Fate,
		Fortune:           character.Fortune,
		Resilience:        character.Resilience,
		Resolve:           character.Resolve,
		CurrentExp:        character.CurrentExp,
		SpentExp:          character.SpentExp,
		Status:            character.Status,
		Standing:          character.Standing,
		Brass:             character.Brass,
		Silver:            character.Silver,
		Gold:              character.Gold,
		Spells:            append([]string(nil), character.Spells...),
		Sin:               character.Sin,
		Corruption:        character.Corruption,
		Mutations:         append([]string(nil), character.Mutations...),
		Shared:            character.Shared,
	}
}

func (character *Character) ToFull(allItems []*Wh, allSkills []*Wh, allTalents []*Wh, allMutations []*Wh, allSpells []*Wh, allCareers []*Wh) *CharacterFull {
	allItemIdMap := whListToIdWhMap(allItems)

	equippedItems := idNumberListToWhNumberList(character.EquippedItems, allItemIdMap)
	carriedItems := idNumberListToWhNumberList(character.CarriedItems, allItemIdMap)
	storedItems := idNumberListToWhNumberList(character.StoredItems, allItemIdMap)

	skills := idNumberListToWhNumberList(character.Skills, whListToIdWhMap(allSkills))
	talents := idNumberListToWhNumberList(character.Talents, whListToIdWhMap(allTalents))
	careerPath := idListToWhList(character.CareerPath, whListToIdWhMap(allCareers))
	spells := idListToWhList(character.Spells, whListToIdWhMap(allSpells))
	mutations := idListToWhList(character.Mutations, whListToIdWhMap(allMutations))
	career := idToWh(character.Career, whListToIdWhMap(allCareers), WhTypeCareer)

	return &CharacterFull{
		Name:              character.Name,
		Description:       character.Description,
		Notes:             character.Notes,
		EquippedItems:     equippedItems,
		CarriedItems:      carriedItems,
		StoredItems:       storedItems,
		Skills:            skills,
		Talents:           talents,
		Species:           character.Species,
		BaseAttributes:    character.BaseAttributes.Copy(),
		AttributeAdvances: character.AttributeAdvances.Copy(),
		CareerPath:        careerPath,
		Career:            career,
		Fate:              character.Fate,
		Fortune:           character.Fortune,
		Resilience:        character.Resilience,
		Resolve:           character.Resolve,
		CurrentExp:        character.CurrentExp,
		SpentExp:          character.SpentExp,
		Status:            character.Status,
		Standing:          character.Standing,
		Brass:             character.Brass,
		Silver:            character.Silver,
		Gold:              character.Gold,
		Spells:            spells,
		Sin:               character.Sin,
		Corruption:        character.Corruption,
		Mutations:         mutations,
		Shared:            character.Shared,
	}
}

func (character *Character) InitNilPointers() {
	if character == nil {
		return
	}

	if character.EquippedItems == nil {
		character.EquippedItems = []*IdNumber{}
	}

	if character.CarriedItems == nil {
		character.CarriedItems = []*IdNumber{}
	}

	if character.StoredItems == nil {
		character.StoredItems = []*IdNumber{}
	}

	if character.Skills == nil {
		character.Skills = []*IdNumber{}
	}

	if character.Talents == nil {
		character.Talents = []*IdNumber{}
	}

	if character.BaseAttributes == nil {
		character.BaseAttributes = &Attributes{}
	}

	if character.AttributeAdvances == nil {
		character.AttributeAdvances = &Attributes{}
	}

	if character.CareerPath == nil {
		character.CareerPath = []string{}
	}

	if character.Spells == nil {
		character.Spells = []string{}
	}

	if character.Mutations == nil {
		character.Mutations = []string{}
	}
}

func idNumberListToWhNumberList(idNumberList []*IdNumber, allIdWhMap map[string]*Wh) []*WhNumber {
	if idNumberList == nil {
		return nil
	}

	whNumberList := make([]*WhNumber, 0)
	for _, v := range idNumberList {
		wh, ok := allIdWhMap[v.Id]
		if ok {
			whNumberList = append(whNumberList, &WhNumber{Wh: wh.Copy(), Number: v.Number})
		}
	}

	return whNumberList
}

func idToWh(id string, allIdWhMap map[string]*Wh, whType WhType) *Wh {
	wh, ok := allIdWhMap[id]
	if ok {
		return wh.Copy()
	}
	if len(allIdWhMap) > 0 {
		for _, v := range allIdWhMap {
			return v.Copy()
		}
	}

	newWh := &Wh{}
	newWh.InitNilPointers(whType)
	return newWh
}

type IdNumber struct {
	Id     string `json:"id" validate:"id_valid"`
	Number int    `json:"number" validate:"gte=1,lte=1000"`
}

func (idNumber *IdNumber) Copy() *IdNumber {
	if idNumber == nil {
		return nil
	}

	return &IdNumber{
		Id:     idNumber.Id,
		Number: idNumber.Number,
	}
}

func copyArrayIdNumber(input []*IdNumber) []*IdNumber {
	if input == nil {
		return nil
	}

	output := make([]*IdNumber, len(input))
	for i, v := range input {
		output[i] = v.Copy()
	}
	return output
}

type CharacterSpecies string

const (
	CharacterSpeciesHumanDefault             = "0000"
	CharacterSpeciesHumanReikland            = "0001"
	CharacterSpeciesHumanAltdorfSouthBank    = "0002"
	CharacterSpeciesHumanAltdorfEastend      = "0003"
	CharacterSpeciesHumanAltdorfHexxerbezrik = "0004"
	CharacterSpeciesHumanAltdorfDocklands    = "0005"
	CharacterSpeciesHumanMiddenheim          = "0006"
	CharacterSpeciesHumanMiddenland          = "0007"
	CharacterSpeciesHumanNordland            = "0008"
	CharacterSpeciesHumanSalzenmund          = "0009"
	CharacterSpeciesHumanTilea               = "0010"
	CharacterSpeciesHumanNorseBjornling      = "0011"
	CharacterSpeciesHumanNorseSarl           = "0012"
	CharacterSpeciesHumanNorseSkaeling       = "0013"
	CharacterSpeciesHalflingDefault          = "0100"
	CharacterSpeciesHalflingAshfield         = "0101"
	CharacterSpeciesHalflingBrambledown      = "0102"
	CharacterSpeciesHalflingBrandysnap       = "0103"
	CharacterSpeciesHalflingHayfoot          = "0104"
	CharacterSpeciesHalflingHollyfoot        = "0105"
	CharacterSpeciesHalflingHayfootHollyfoot = "0106"
	CharacterSpeciesHalflingLostpockets      = "0107"
	CharacterSpeciesHalflingLowhaven         = "0108"
	CharacterSpeciesHalflingRumster          = "0109"
	CharacterSpeciesHalflingSkelfsider       = "0110"
	CharacterSpeciesHalflingThorncobble      = "0111"
	CharacterSpeciesHalflingTumbleberry      = "0112"
	CharacterSpeciesDwarfDefault             = "0200"
	CharacterSpeciesDwarfAltdorf             = "0201"
	CharacterSpeciesDwarfCragforgeClan       = "0202"
	CharacterSpeciesDwarfGrumssonClan        = "0203"
	CharacterSpeciesDwarfNorse               = "0204"
	CharacterSpeciesHighElfDefault           = "0300"
	CharacterSpeciesWoodElfDefault           = "0400"
	CharacterSpeciesGnomeDefault             = "0500"
	CharacterSpeciesOgreDefault              = "0600"
)

func characterSpeciesValues() string {
	return formatStringValues([]CharacterSpecies{
		CharacterSpeciesHumanDefault,
		CharacterSpeciesHumanReikland,
		CharacterSpeciesHumanAltdorfSouthBank,
		CharacterSpeciesHumanAltdorfEastend,
		CharacterSpeciesHumanAltdorfHexxerbezrik,
		CharacterSpeciesHumanAltdorfDocklands,
		CharacterSpeciesHumanMiddenheim,
		CharacterSpeciesHumanMiddenland,
		CharacterSpeciesHumanNordland,
		CharacterSpeciesHumanSalzenmund,
		CharacterSpeciesHumanTilea,
		CharacterSpeciesHumanNorseBjornling,
		CharacterSpeciesHumanNorseSarl,
		CharacterSpeciesHumanNorseSkaeling,
		CharacterSpeciesHalflingDefault,
		CharacterSpeciesHalflingAshfield,
		CharacterSpeciesHalflingBrambledown,
		CharacterSpeciesHalflingBrandysnap,
		CharacterSpeciesHalflingHayfoot,
		CharacterSpeciesHalflingHollyfoot,
		CharacterSpeciesHalflingHayfootHollyfoot,
		CharacterSpeciesHalflingLostpockets,
		CharacterSpeciesHalflingLowhaven,
		CharacterSpeciesHalflingRumster,
		CharacterSpeciesHalflingSkelfsider,
		CharacterSpeciesHalflingThorncobble,
		CharacterSpeciesHalflingTumbleberry,
		CharacterSpeciesDwarfDefault,
		CharacterSpeciesDwarfAltdorf,
		CharacterSpeciesDwarfCragforgeClan,
		CharacterSpeciesDwarfGrumssonClan,
		CharacterSpeciesDwarfNorse,
		CharacterSpeciesHighElfDefault,
		CharacterSpeciesWoodElfDefault,
		CharacterSpeciesGnomeDefault,
		CharacterSpeciesOgreDefault,
	})
}

func GetCharacterValidationAliases() map[string]string {
	return map[string]string{
		"character_species_valid": fmt.Sprintf("oneof=%s", characterSpeciesValues()),
	}
}

type CharacterFull struct {
	Name              string           `json:"name"`
	Description       string           `json:"description"`
	Notes             string           `json:"notes"`
	EquippedItems     []*WhNumber      `json:"equippedItems"`
	CarriedItems      []*WhNumber      `json:"carriedItems"`
	StoredItems       []*WhNumber      `json:"storedItems"`
	Skills            []*WhNumber      `json:"skills"`
	Talents           []*WhNumber      `json:"talents"`
	Species           CharacterSpecies `json:"species"`
	BaseAttributes    *Attributes      `json:"baseAttributes"`
	AttributeAdvances *Attributes      `json:"attributeAdvances"`
	CareerPath        []*Wh            `json:"careerPath"`
	Career            *Wh              `json:"career"`
	Fate              int              `json:"fate"`
	Fortune           int              `json:"fortune"`
	Resilience        int              `json:"resilience"`
	Resolve           int              `json:"resolve"`
	CurrentExp        int              `json:"currentExp"`
	SpentExp          int              `json:"spentExp"`
	Status            Status           `json:"status"`
	Standing          Standing         `json:"standing"`
	Brass             int              `json:"brass"`
	Silver            int              `json:"silver"`
	Gold              int              `json:"gold"`
	Spells            []*Wh            `json:"spells"`
	Sin               int              `json:"sin"`
	Corruption        int              `json:"corruption"`
	Mutations         []*Wh            `json:"mutations"`
	Shared            bool             `json:"shared"`
}

func (characterFull *CharacterFull) IsShared() (bool, error) {
	if characterFull == nil {
		return false, errors.New("characterFull pointer is nil")
	}

	return characterFull.Shared, nil
}

func (characterFull *CharacterFull) Copy() WhObject {
	if characterFull == nil {
		return nil
	}

	return &CharacterFull{
		Name:              characterFull.Name,
		Description:       characterFull.Description,
		Notes:             characterFull.Notes,
		EquippedItems:     copyWhNumberArray(characterFull.EquippedItems),
		CarriedItems:      copyWhNumberArray(characterFull.CarriedItems),
		StoredItems:       copyWhNumberArray(characterFull.StoredItems),
		Skills:            copyWhNumberArray(characterFull.Skills),
		Talents:           copyWhNumberArray(characterFull.Talents),
		Species:           characterFull.Species,
		BaseAttributes:    characterFull.BaseAttributes.Copy(),
		AttributeAdvances: characterFull.AttributeAdvances.Copy(),
		CareerPath:        copyWhArray(characterFull.CareerPath),
		Career:            characterFull.Career.Copy(),
		Fate:              characterFull.Fate,
		Fortune:           characterFull.Fortune,
		Resilience:        characterFull.Resilience,
		Resolve:           characterFull.Resolve,
		CurrentExp:        characterFull.CurrentExp,
		SpentExp:          characterFull.SpentExp,
		Status:            characterFull.Status,
		Standing:          characterFull.Standing,
		Brass:             characterFull.Brass,
		Silver:            characterFull.Silver,
		Gold:              characterFull.Gold,
		Spells:            copyWhArray(characterFull.Spells),
		Sin:               characterFull.Sin,
		Corruption:        characterFull.Corruption,
		Mutations:         copyWhArray(characterFull.Mutations),
		Shared:            characterFull.Shared,
	}
}

func copyWhNumberArray(input []*WhNumber) []*WhNumber {
	if input == nil {
		return nil
	}

	output := make([]*WhNumber, len(input))
	for i, v := range input {
		output[i] = v.Copy()
	}
	return output
}

func (characterFull *CharacterFull) InitNilPointers() {
	if characterFull == nil {
		return
	}

	if characterFull.EquippedItems == nil {
		characterFull.EquippedItems = []*WhNumber{}
	}
	initNilPointersInWhNumberList(characterFull.EquippedItems, WhTypeItem)

	if characterFull.CarriedItems == nil {
		characterFull.CarriedItems = []*WhNumber{}
	}
	initNilPointersInWhNumberList(characterFull.CarriedItems, WhTypeItem)

	if characterFull.StoredItems == nil {
		characterFull.StoredItems = []*WhNumber{}
	}
	initNilPointersInWhNumberList(characterFull.StoredItems, WhTypeItem)

	if characterFull.Skills == nil {
		characterFull.Skills = []*WhNumber{}
	}
	initNilPointersInWhNumberList(characterFull.Skills, WhTypeSkill)

	if characterFull.Talents == nil {
		characterFull.Talents = []*WhNumber{}
	}
	initNilPointersInWhNumberList(characterFull.Talents, WhTypeTalent)

	if characterFull.BaseAttributes == nil {
		characterFull.BaseAttributes = &Attributes{}
	}

	if characterFull.AttributeAdvances == nil {
		characterFull.AttributeAdvances = &Attributes{}
	}

	if characterFull.CareerPath == nil {
		characterFull.CareerPath = []*Wh{}
	}
	initNilPointersInWhList(characterFull.CareerPath, WhTypeCareer)

	if characterFull.Spells == nil {
		characterFull.Spells = []*Wh{}
	}
	initNilPointersInWhList(characterFull.Spells, WhTypeSpell)

	if characterFull.Mutations == nil {
		characterFull.Mutations = []*Wh{}
	}
	initNilPointersInWhList(characterFull.Mutations, WhTypeMutation)

	if characterFull.Mutations == nil {
		characterFull.Mutations = []*Wh{}
	}

	characterFull.Career.InitNilPointers(WhTypeCareer)
}

func initNilPointersInWhNumberList(list []*WhNumber, t WhType) {
	if list == nil {
		return
	}
	for _, v := range list {
		if v == nil {
			v.Wh.InitNilPointers(t)
		}
	}
}

func initNilPointersInWhList(list []*Wh, t WhType) {
	if list == nil {
		return
	}
	for _, v := range list {
		v.InitNilPointers(t)
	}
}

type WhNumber struct {
	Wh     *Wh `json:"wh"`
	Number int `json:"number"`
}

func (input *WhNumber) Copy() *WhNumber {
	if input == nil {
		return nil
	}

	return &WhNumber{
		Wh:     input.Wh.Copy(),
		Number: input.Number,
	}
}
