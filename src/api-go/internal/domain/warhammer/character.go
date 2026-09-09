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
	EquippedItems     []IdNumber       `json:"equippedItems" validate:"dive"`
	CarriedItems      []IdNumber       `json:"carriedItems" validate:"dive"`
	StoredItems       []IdNumber       `json:"storedItems" validate:"dive"`
	Skills            []IdNumber       `json:"skills" validate:"dive"`
	Talents           []IdNumber       `json:"talents" validate:"dive"`
	Species           CharacterSpecies `json:"species" validate:"character_species_valid"`
	BaseAttributes    Attributes       `json:"baseAttributes"`
	AttributeAdvances Attributes       `json:"attributeAdvances"`
	CareerPath        []IdNumber       `json:"careerPath" validate:"dive"`
	Career            IdNumber         `json:"career"`
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
}

func (character *Character) Init() {
	if character.EquippedItems == nil {
		character.EquippedItems = []IdNumber{}
	}
	if character.CarriedItems == nil {
		character.CarriedItems = []IdNumber{}
	}
	if character.StoredItems == nil {
		character.StoredItems = []IdNumber{}
	}
	if character.Skills == nil {
		character.Skills = []IdNumber{}
	}
	if character.Talents == nil {
		character.Talents = []IdNumber{}
	}
	if character.CareerPath == nil {
		character.CareerPath = []IdNumber{}
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
		if character.Career.Id != "" {
			log.Printf("Error finding career %s, using empty career instead", character.Career.Id)
			careerWh := &Wh{Id: "000000000000000000000000", Object: &Career{}}
			careerWh.Init()
			career = WhNumber{Wh: careerWh, Number: 1}
		} else {
			return nil, err
		}
	}

	fullChar := &CharacterFull{
		Name:              character.Name,
		Description:       character.Description,
		Notes:             character.Notes,
		EquippedItems:     equippedItems,
		CarriedItems:      carriedItems,
		StoredItems:       storedItems,
		Skills:            skills,
		Talents:           talents,
		Species:           character.Species,
		BaseAttributes:    character.BaseAttributes,
		AttributeAdvances: character.AttributeAdvances,
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
	}
	fullChar.Init()
	return fullChar, nil
}

func idNumberListToWhNumberList(idNumberList []IdNumber, allIdWhMap map[string]*Wh) []WhNumber {
	if len(idNumberList) == 0 {
		return []WhNumber{}
	}

	whNumberList := make([]WhNumber, 0, len(idNumberList))
	for _, v := range idNumberList {
		wh, ok := allIdWhMap[v.Id]
		if ok {
			whNumberList = append(whNumberList, WhNumber{Wh: wh, Number: v.Number})
		}
	}

	return whNumberList
}

func skillIdNumberListToWhNumberList(skillIdNumberList []IdNumber, allSkills []*Wh) ([]WhNumber, error) {
	if len(skillIdNumberList) == 0 && len(allSkills) == 0 {
		return []WhNumber{}, nil
	}

	whNumberList := make([]WhNumber, 0)

	var skillMap = make(map[string]int, len(skillIdNumberList))
	for _, v := range skillIdNumberList {
		skillMap[v.Id] = v.Number
	}

	for _, v := range allSkills {
		skillNumber, ok := skillMap[v.Id]
		if ok {
			whNumberList = append(whNumberList, WhNumber{Wh: v, Number: skillNumber})
		} else {
			allSkill, ok := v.Object.(*Skill)
			if !ok {
				return nil, errors.New("error asserting skill")
			}
			if allSkill.Type == SkillTypeBasic && allSkill.DisplayZero && allSkill.Attribute != AttVarious {
				whNumberList = append(whNumberList, WhNumber{Wh: v, Number: 0})
			}
		}
	}

	return whNumberList, nil
}

func idNumberToWhNumber(idNumber IdNumber, allIdWhMap map[string]*Wh) (WhNumber, error) {
	if allIdWhMap == nil {
		return WhNumber{}, errors.New("allIdWhMap is nil")
	}

	wh, ok := allIdWhMap[idNumber.Id]
	if ok {
		return WhNumber{Wh: wh, Number: idNumber.Number}, nil
	}
	if len(allIdWhMap) > 0 {
		for _, v := range allIdWhMap {
			return WhNumber{Wh: v, Number: idNumber.Number}, nil
		}
	}

	return WhNumber{}, fmt.Errorf("could not find id %s in allIdWhMap", idNumber.Id)
}

type IdNumber struct {
	Id     string `json:"id" validate:"id_valid"`
	Number int    `json:"number" validate:"gte=1,lte=1000"`
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
	CharacterSpeciesDwarfKarazAKarak         = "0205"
	CharacterSpeciesDwarfBarakVarr           = "0206"
	CharacterSpeciesDwarfKarakAzul           = "0207"
	CharacterSpeciesDwarfKarakEightPeaks     = "0208"
	CharacterSpeciesDwarfKarakKadrin         = "0209"
	CharacterSpeciesDwarfZhufbar             = "0210"
	CharacterSpeciesDwarfKarakHirn           = "0211"
	CharacterSpeciesDwarfKarakIzor           = "0212"
	CharacterSpeciesDwarfKarakNorn           = "0213"
	CharacterSpeciesDwarfImperial            = "0214"
	CharacterSpeciesHighElfDefault           = "0300"
	CharacterSpeciesHighElfCaledor           = "0301"
	CharacterSpeciesHighElfEllyrion          = "0302"
	CharacterSpeciesHighElfAvelorn           = "0303"
	CharacterSpeciesHighElfSaphery           = "0304"
	CharacterSpeciesHighElfEataine           = "0305"
	CharacterSpeciesHighElfTiranoc           = "0306"
	CharacterSpeciesHighElfShadowlands       = "0307"
	CharacterSpeciesHighElfChrace            = "0308"
	CharacterSpeciesHighElfCothique          = "0309"
	CharacterSpeciesHighElfYvresse           = "0310"
	CharacterSpeciesHighElfSeaElf            = "0311"
	CharacterSpeciesWoodElfDefault           = "0400"
	CharacterSpeciesWoodElfEonirCityborn     = "0401"
	CharacterSpeciesWoodElfEonirForestborn   = "0402"
	CharacterSpeciesWoodElfEonirYounger      = "0403"
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
		CharacterSpeciesDwarfKarazAKarak,
		CharacterSpeciesDwarfBarakVarr,
		CharacterSpeciesDwarfKarakAzul,
		CharacterSpeciesDwarfKarakEightPeaks,
		CharacterSpeciesDwarfKarakKadrin,
		CharacterSpeciesDwarfZhufbar,
		CharacterSpeciesDwarfKarakHirn,
		CharacterSpeciesDwarfKarakIzor,
		CharacterSpeciesDwarfKarakNorn,
		CharacterSpeciesDwarfImperial,
		CharacterSpeciesHighElfDefault,
		CharacterSpeciesHighElfCaledor,
		CharacterSpeciesHighElfEllyrion,
		CharacterSpeciesHighElfAvelorn,
		CharacterSpeciesHighElfSaphery,
		CharacterSpeciesHighElfEataine,
		CharacterSpeciesHighElfTiranoc,
		CharacterSpeciesHighElfShadowlands,
		CharacterSpeciesHighElfChrace,
		CharacterSpeciesHighElfCothique,
		CharacterSpeciesHighElfYvresse,
		CharacterSpeciesHighElfSeaElf,
		CharacterSpeciesWoodElfDefault,
		CharacterSpeciesWoodElfEonirCityborn,
		CharacterSpeciesWoodElfEonirForestborn,
		CharacterSpeciesWoodElfEonirYounger,
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
	EquippedItems     []WhNumber       `json:"equippedItems"`
	CarriedItems      []WhNumber       `json:"carriedItems"`
	StoredItems       []WhNumber       `json:"storedItems"`
	Skills            []WhNumber       `json:"skills"`
	Talents           []WhNumber       `json:"talents"`
	Species           CharacterSpecies `json:"species"`
	BaseAttributes    Attributes       `json:"baseAttributes"`
	AttributeAdvances Attributes       `json:"attributeAdvances"`
	CareerPath        []WhNumber       `json:"careerPath"`
	Career            WhNumber         `json:"career"`
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
}

func (c *CharacterFull) Init() {
	if c.EquippedItems == nil {
		c.EquippedItems = []WhNumber{}
	}
	if c.CarriedItems == nil {
		c.CarriedItems = []WhNumber{}
	}
	if c.StoredItems == nil {
		c.StoredItems = []WhNumber{}
	}
	if c.Skills == nil {
		c.Skills = []WhNumber{}
	}
	if c.Talents == nil {
		c.Talents = []WhNumber{}
	}
	if c.CareerPath == nil {
		c.CareerPath = []WhNumber{}
	}
	if c.Spells == nil {
		c.Spells = []*Wh{}
	}
	if c.Prayers == nil {
		c.Prayers = []*Wh{}
	}
	if c.Traits == nil {
		c.Traits = []*Wh{}
	}
	if c.Mutations == nil {
		c.Mutations = []*Wh{}
	}
}

type WhNumber struct {
	Wh     *Wh `json:"wh"`
	Number int `json:"number"`
}
