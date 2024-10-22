package warhammer

import (
	"errors"
	"fmt"
	"log"
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
	CareerPath        []*IdNumber      `json:"careerPath" validate:"dive"`
	Career            *IdNumber        `json:"career"`
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
	Prayers           []string         `json:"prayers" validate:"dive,id_valid"`
	Traits            []string         `json:"traits" validate:"dive,id_valid"`
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
		CareerPath:        copyArrayIdNumber(character.CareerPath),
		Career:            character.Career.Copy(),
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
		Spells:            copyArray(character.Spells),
		Prayers:           copyArray(character.Prayers),
		Traits:            copyArray(character.Traits),
		Sin:               character.Sin,
		Corruption:        character.Corruption,
		Mutations:         copyArray(character.Mutations),
		Shared:            character.Shared,
	}
}

func (character *Character) ToFull(
	allItems []*Wh, allSkills []*Wh, allTalents []*Wh, allMutations []*Wh,
	allSpells []*Wh, allPrayers []*Wh, allTraits []*Wh, allCareers []*Wh,
) (*CharacterFull, error) {
	if allItems == nil {
		return nil, errors.New("allItems is nil")
	}
	if allSkills == nil {
		return nil, errors.New("allSkills is nil")
	}
	if allTalents == nil {
		return nil, errors.New("allTalents is nil")
	}
	if allMutations == nil {
		return nil, errors.New("allMutations is nil")
	}
	if allSpells == nil {
		return nil, errors.New("allSpells is nil")
	}
	if allPrayers == nil {
		return nil, errors.New("allPrayers is nil")
	}
	if allTraits == nil {
		return nil, errors.New("allTraits is nil")
	}
	if allCareers == nil {
		return nil, errors.New("allCareers is nil")
	}

	allItemIdMap := whListToIdWhMap(allItems)
	equippedItems := idNumberListToWhNumberList(character.EquippedItems, allItemIdMap)
	carriedItems := idNumberListToWhNumberList(character.CarriedItems, allItemIdMap)
	storedItems := idNumberListToWhNumberList(character.StoredItems, allItemIdMap)

	skills, err := skillIdNumberListToWhNumberList(character.Skills, allSkills)
	if err != nil {
		return nil, err
	}
	talents := idNumberListToWhNumberList(character.Talents, whListToIdWhMap(allTalents))
	spells := idListToWhList(character.Spells, whListToIdWhMap(allSpells))
	prayers := idListToWhList(character.Prayers, whListToIdWhMap(allPrayers))
	traits := idListToWhList(character.Traits, whListToIdWhMap(allTraits))
	mutations := idListToWhList(character.Mutations, whListToIdWhMap(allMutations))

	allCareerIdMap := whListToIdWhMap(allCareers)
	careerPath := idNumberListToWhNumberList(character.CareerPath, allCareerIdMap)
	career, err := idNumberToWhNumber(character.Career, allCareerIdMap)
	if err != nil {
		if character.Career != nil {
			log.Printf("Error finding career %s, using empty career instead", character.Career.Id)
			newCareer := &Career{}
			err = newCareer.InitNilPointers()
			if err != nil {
				return nil, err
			}
			career = &WhNumber{Wh: &Wh{Id: "000000000000000000000000", Object: newCareer}, Number: 1}
		} else {
			return nil, err
		}
	}

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
		Prayers:           prayers,
		Traits:            traits,
		Sin:               character.Sin,
		Corruption:        character.Corruption,
		Mutations:         mutations,
		Shared:            character.Shared,
	}, nil
}

func (character *Character) InitNilPointers() error {
	if character == nil {
		return errors.New("character pointer is nil")
	}

	if character.EquippedItems == nil {
		character.EquippedItems = []*IdNumber{}
	}
	for _, v := range character.EquippedItems {
		if v == nil {
			return errors.New("equipped items idNumber pointer is nil")
		}
	}

	if character.CarriedItems == nil {
		character.CarriedItems = []*IdNumber{}
	}
	for _, v := range character.CarriedItems {
		if v == nil {
			return errors.New("carried items idNumber pointer is nil")
		}
	}

	if character.StoredItems == nil {
		character.StoredItems = []*IdNumber{}
	}
	for _, v := range character.StoredItems {
		if v == nil {
			return errors.New("stored items idNumber pointer is nil")
		}
	}

	if character.Skills == nil {
		character.Skills = []*IdNumber{}
	}
	for _, v := range character.Skills {
		if v == nil {
			return errors.New("skills idNumber pointer is nil")
		}
	}

	if character.Talents == nil {
		character.Talents = []*IdNumber{}
	}
	for _, v := range character.Talents {
		if v == nil {
			return errors.New("talents idNumber pointer is nil")
		}
	}

	if character.BaseAttributes == nil {
		character.BaseAttributes = &Attributes{}
	}

	if character.AttributeAdvances == nil {
		character.AttributeAdvances = &Attributes{}
	}

	if character.Career == nil {
		character.Career = &IdNumber{}
	}

	if character.CareerPath == nil {
		character.CareerPath = []*IdNumber{}
	}

	if character.Spells == nil {
		character.Spells = []string{}
	}

	if character.Prayers == nil {
		character.Prayers = []string{}
	}

	if character.Traits == nil {
		character.Traits = []string{}
	}

	if character.Mutations == nil {
		character.Mutations = []string{}
	}

	return nil
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

func skillIdNumberListToWhNumberList(skillIdNumberList []*IdNumber, allSkills []*Wh) ([]*WhNumber, error) {
	if skillIdNumberList == nil {
		return nil, nil
	}

	whNumberList := make([]*WhNumber, 0)

	var skillMap = make(map[string]int, len(skillIdNumberList))
	for _, v := range skillIdNumberList {
		skillMap[v.Id] = v.Number
	}

	for _, v := range allSkills {
		skillNumber, ok := skillMap[v.Id]
		if ok {
			whNumberList = append(whNumberList, &WhNumber{Wh: v.Copy(), Number: skillNumber})
		} else {
			allSkill, ok := v.Object.(*Skill)
			if !ok {
				return nil, errors.New("error asserting skill")
			}
			if allSkill.Type == SkillTypeBasic && allSkill.DisplayZero && allSkill.Attribute != AttVarious {
				whNumberList = append(whNumberList, &WhNumber{Wh: v.Copy(), Number: 0})
			}
		}
	}

	return whNumberList, nil
}

func idNumberToWhNumber(idNumer *IdNumber, allIdWhMap map[string]*Wh) (*WhNumber, error) {
	if allIdWhMap == nil {
		return nil, errors.New("allIdWhMap is nil")
	}

	if idNumer == nil {
		return nil, errors.New("idNumer is nil")
	}

	wh, ok := allIdWhMap[idNumer.Id]
	if ok {
		whNum := WhNumber{Wh: wh.Copy(), Number: idNumer.Number}
		return &whNum, nil
	}
	if len(allIdWhMap) > 0 {
		for _, v := range allIdWhMap {
			whNum := WhNumber{Wh: v.Copy(), Number: idNumer.Number}
			return &whNum, nil
		}
	}

	return nil, fmt.Errorf("could not find id %s in allIdWhMap", idNumer.Id)
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
	CareerPath        []*WhNumber      `json:"careerPath"`
	Career            *WhNumber        `json:"career"`
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
	Prayers           []*Wh            `json:"prayers"`
	Traits            []*Wh            `json:"traits"`
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
		CareerPath:        copyWhNumberArray(characterFull.CareerPath),
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
		Prayers:           copyWhArray(characterFull.Prayers),
		Traits:            copyWhArray(characterFull.Traits),
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

func (characterFull *CharacterFull) InitNilPointers() error {
	if characterFull == nil {
		return errors.New("characterFull pointer is nil")
	}

	if characterFull.EquippedItems == nil {
		characterFull.EquippedItems = []*WhNumber{}
	}
	err := initNilPointersInWhNumberList(characterFull.EquippedItems, WhTypeItem)
	if err != nil {
		return err
	}

	if characterFull.CarriedItems == nil {
		characterFull.CarriedItems = []*WhNumber{}
	}
	err = initNilPointersInWhNumberList(characterFull.CarriedItems, WhTypeItem)
	if err != nil {
		return err
	}

	if characterFull.StoredItems == nil {
		characterFull.StoredItems = []*WhNumber{}
	}
	err = initNilPointersInWhNumberList(characterFull.StoredItems, WhTypeItem)
	if err != nil {
		return err
	}

	if characterFull.Skills == nil {
		characterFull.Skills = []*WhNumber{}
	}
	err = initNilPointersInWhNumberList(characterFull.Skills, WhTypeSkill)
	if err != nil {
		return err
	}

	if characterFull.Talents == nil {
		characterFull.Talents = []*WhNumber{}
	}
	err = initNilPointersInWhNumberList(characterFull.Talents, WhTypeTalent)
	if err != nil {
		return err
	}

	if characterFull.BaseAttributes == nil {
		characterFull.BaseAttributes = &Attributes{}
	}

	if characterFull.AttributeAdvances == nil {
		characterFull.AttributeAdvances = &Attributes{}
	}

	if characterFull.CareerPath == nil {
		characterFull.CareerPath = []*WhNumber{}
	}
	err = initNilPointersInWhNumberList(characterFull.CareerPath, WhTypeCareer)
	if err != nil {
		return err
	}

	if characterFull.Spells == nil {
		characterFull.Spells = []*Wh{}
	}
	err = initNilPointersInWhList(characterFull.Spells)
	if err != nil {
		return err
	}

	if characterFull.Prayers == nil {
		characterFull.Prayers = []*Wh{}
	}
	err = initNilPointersInWhList(characterFull.Prayers)
	if err != nil {
		return err
	}

	if characterFull.Traits == nil {
		characterFull.Traits = []*Wh{}
	}
	err = initNilPointersInWhList(characterFull.Traits)
	if err != nil {
		return err
	}

	if characterFull.Mutations == nil {
		characterFull.Mutations = []*Wh{}
	}
	err = initNilPointersInWhList(characterFull.Mutations)
	if err != nil {
		return err
	}

	if characterFull.Career == nil {
		characterFull.Career = &WhNumber{}
	}

	return characterFull.Career.Wh.InitNilPointers()
}

func initNilPointersInWhNumberList(list []*WhNumber, t WhType) error {
	for _, v := range list {
		if v == nil {
			return errors.New(fmt.Sprintf("%s idWh pointer is nil", t))
		}
		err := v.Wh.InitNilPointers()
		if err != nil {
			return err
		}
	}
	return nil
}

func initNilPointersInWhList(list []*Wh) error {
	for _, v := range list {
		err := v.InitNilPointers()
		if err != nil {
			return err
		}
	}
	return nil
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
