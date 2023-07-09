package warhammer

import (
	"fmt"
	"strings"
)

type WhCharacterSpecies string

const (
	WhCharacterSpeciesHumanDefault             = "0000"
	WhCharacterSpeciesHumanReikland            = "0001"
	WhCharacterSpeciesHumanAltdorfSouthBank    = "0002"
	WhCharacterSpeciesHumanAltdorfEastend      = "0003"
	WhCharacterSpeciesHumanAltdorfHexxerbezrik = "0004"
	WhCharacterSpeciesHumanAltdorfDocklands    = "0005"
	WhCharacterSpeciesHumanMiddenheim          = "0006"
	WhCharacterSpeciesHumanMiddenland          = "0007"
	WhCharacterSpeciesHumanNordland            = "0008"
	WhCharacterSpeciesHumanSalzenmund          = "0009"
	WhCharacterSpeciesHumanTilea               = "0010"
	WhCharacterSpeciesHumanNorseBjornling      = "0011"
	WhCharacterSpeciesHumanNorseSarl           = "0012"
	WhCharacterSpeciesHumanNorseSkaeling       = "0013"
	WhCharacterSpeciesHalflingDefault          = "0100"
	WhCharacterSpeciesHalflingAshfield         = "0101"
	WhCharacterSpeciesHalflingBrambledown      = "0102"
	WhCharacterSpeciesHalflingBrandysnap       = "0103"
	WhCharacterSpeciesHalflingHayfoot          = "0104"
	WhCharacterSpeciesHalflingHollyfoot        = "0105"
	WhCharacterSpeciesHalflingHayfootHollyfoot = "0106"
	WhCharacterSpeciesHalflingLostpockets      = "0107"
	WhCharacterSpeciesHalflingLowhaven         = "0108"
	WhCharacterSpeciesHalflingRumster          = "0109"
	WhCharacterSpeciesHalflingSkelfsider       = "0110"
	WhCharacterSpeciesHalflingThorncobble      = "0111"
	WhCharacterSpeciesHalflingTumbleberry      = "0112"
	WhCharacterSpeciesDwarfDefault             = "0200"
	WhCharacterSpeciesDwarfAltdorf             = "0201"
	WhCharacterSpeciesDwarfCragforgeClan       = "0202"
	WhCharacterSpeciesDwarfGrumssonClan        = "0203"
	WhCharacterSpeciesDwarfNorse               = "0204"
	WhCharacterSpeciesHighElfDefault           = "0300"
	WhCharacterSpeciesWoodElfDefault           = "0400"
	WhCharacterSpeciesGnomeDefault             = "0500"
	WhCharacterSpeciesOgreDefault              = "0600"
)

func characterSpeciesValues() string {
	return formatStringValues([]WhCharacterSpecies{
		WhCharacterSpeciesHumanDefault,
		WhCharacterSpeciesHumanReikland,
		WhCharacterSpeciesHumanAltdorfSouthBank,
		WhCharacterSpeciesHumanAltdorfEastend,
		WhCharacterSpeciesHumanAltdorfHexxerbezrik,
		WhCharacterSpeciesHumanAltdorfDocklands,
		WhCharacterSpeciesHumanMiddenheim,
		WhCharacterSpeciesHumanMiddenland,
		WhCharacterSpeciesHumanNordland,
		WhCharacterSpeciesHumanSalzenmund,
		WhCharacterSpeciesHumanTilea,
		WhCharacterSpeciesHumanNorseBjornling,
		WhCharacterSpeciesHumanNorseSarl,
		WhCharacterSpeciesHumanNorseSkaeling,
		WhCharacterSpeciesHalflingDefault,
		WhCharacterSpeciesHalflingAshfield,
		WhCharacterSpeciesHalflingBrambledown,
		WhCharacterSpeciesHalflingBrandysnap,
		WhCharacterSpeciesHalflingHayfoot,
		WhCharacterSpeciesHalflingHollyfoot,
		WhCharacterSpeciesHalflingHayfootHollyfoot,
		WhCharacterSpeciesHalflingLostpockets,
		WhCharacterSpeciesHalflingLowhaven,
		WhCharacterSpeciesHalflingRumster,
		WhCharacterSpeciesHalflingSkelfsider,
		WhCharacterSpeciesHalflingThorncobble,
		WhCharacterSpeciesHalflingTumbleberry,
		WhCharacterSpeciesDwarfDefault,
		WhCharacterSpeciesDwarfAltdorf,
		WhCharacterSpeciesDwarfCragforgeClan,
		WhCharacterSpeciesDwarfGrumssonClan,
		WhCharacterSpeciesDwarfNorse,
		WhCharacterSpeciesHighElfDefault,
		WhCharacterSpeciesWoodElfDefault,
		WhCharacterSpeciesGnomeDefault,
		WhCharacterSpeciesOgreDefault,
	})
}
func (input WhCharacterSpecies) InitAndCopy() WhCharacterSpecies {
	if input == "" {
		return WhCharacterSpeciesHumanDefault
	}
	return WhCharacterSpecies(strings.Clone(string(input)))
}

type IdNumber struct {
	Id     string `json:"id" validate:"id_valid"`
	Number int    `json:"number" validate:"gte=1,lte=1000"`
}

func (input IdNumber) InitAndCopy() IdNumber {
	return IdNumber{
		Id:     strings.Clone(input.Id),
		Number: input.Number,
	}
}

func copyArrayIdNumber(input []IdNumber) []IdNumber {
	output := make([]IdNumber, len(input))
	for i, v := range input {
		output[i] = v.InitAndCopy()
	}
	return output
}

type WhCharacter struct {
	Name              string             `json:"name" validate:"name_valid"`
	Description       string             `json:"description" validate:"desc_valid"`
	Notes             string             `json:"notes" validate:"desc_valid"`
	EquippedItems     []IdNumber         `json:"equippedItems" validate:"dive"`
	CarriedItems      []IdNumber         `json:"carriedItems" validate:"dive"`
	StoredItems       []IdNumber         `json:"storedItems" validate:"dive"`
	Skills            []IdNumber         `json:"skills" validate:"dive"`
	Talents           []IdNumber         `json:"talents" validate:"dive"`
	Species           WhCharacterSpecies `json:"species" validate:"character_species_valid"`
	BaseAttributes    WhAttributes       `json:"baseAttributes"`
	AttributeAdvances WhAttributes       `json:"attributeAdvances"`
	CareerPath        []string           `json:"careerPath" validate:"dive,id_valid"`
	Career            string             `json:"career" validate:"id_valid"`
	Fate              int                `json:"fate" validate:"gte=0,lte=1000"`
	Fortune           int                `json:"fortune" validate:"gte=0,lte=1000"`
	Resilience        int                `json:"resilience" validate:"gte=0,lte=1000"`
	Resolve           int                `json:"resolve" validate:"gte=0,lte=1000"`
	CurrentExp        int                `json:"currentExp" validate:"gte=0,lte=10000000"`
	SpentExp          int                `json:"spentExp" validate:"gte=0,lte=10000000"`
	Status            WhStatus           `json:"status" validate:"status_valid"`
	Standing          WhStanding         `json:"standing" validate:"standing_valid"`
	Brass             int                `json:"brass" validate:"gte=0,lte=1000000"`
	Silver            int                `json:"silver" validate:"gte=0,lte=1000000"`
	Gold              int                `json:"gold" validate:"gte=0,lte=1000000"`
	Spells            []string           `json:"spells" validate:"dive,id_valid"`
	Sin               int                `json:"sin" validate:"gte=0,lte=1000"`
	Corruption        int                `json:"corruption" validate:"gte=0,lte=1000"`
	Mutations         []string           `json:"mutations" validate:"dive,id_valid"`
	Shared            bool               `json:"shared" validate:"shared_valid"`
}

func (c WhCharacter) IsShared() bool {
	return c.Shared
}

func (c WhCharacter) InitAndCopy() WhObject {
	return WhCharacter{
		Name:              strings.Clone(c.Name),
		Description:       strings.Clone(c.Description),
		Notes:             strings.Clone(c.Notes),
		EquippedItems:     copyArrayIdNumber(c.EquippedItems),
		CarriedItems:      copyArrayIdNumber(c.CarriedItems),
		StoredItems:       copyArrayIdNumber(c.StoredItems),
		Skills:            copyArrayIdNumber(c.Skills),
		Talents:           copyArrayIdNumber(c.Talents),
		Species:           c.Species.InitAndCopy(),
		BaseAttributes:    c.BaseAttributes.InitAndCopy(),
		AttributeAdvances: c.AttributeAdvances.InitAndCopy(),
		CareerPath:        copyStringArray(c.CareerPath),
		Career:            strings.Clone(c.Career),
		Fate:              c.Fate,
		Fortune:           c.Fortune,
		Resilience:        c.Resilience,
		Resolve:           c.Resolve,
		CurrentExp:        c.CurrentExp,
		SpentExp:          c.SpentExp,
		Status:            c.Status.InitAndCopy(),
		Standing:          c.Standing.InitAndCopy(),
		Brass:             c.Brass,
		Silver:            c.Silver,
		Gold:              c.Gold,
		Spells:            copyStringArray(c.Spells),
		Sin:               c.Sin,
		Corruption:        c.Corruption,
		Mutations:         copyStringArray(c.Mutations),
		Shared:            c.Shared,
	}
}

func GetWhCharacterValidationAliases() map[string]string {
	return map[string]string{
		"character_species_valid": fmt.Sprintf("oneof=%s", characterSpeciesValues()),
	}
}

type WhNumber struct {
	Wh     Wh  `json:"wh"`
	Number int `json:"number"`
}

func (input WhNumber) InitAndCopy() WhNumber {
	return WhNumber{
		Wh:     input.Wh.InitAndCopy(),
		Number: input.Number,
	}
}

func copyArrayWhNumber(input []WhNumber) []WhNumber {
	output := make([]WhNumber, len(input))
	for i, v := range input {
		output[i] = v.InitAndCopy()
	}
	return output
}

func (c WhCharacter) ToFull(allItems []*Wh, allSkills []*Wh, allTalents []*Wh, allMutations []*Wh, allSpells []*Wh, allCareers []*Wh) WhCharacterFull {
	equippedItems := idNumberListToFull(c.EquippedItems, allItems)
	carriedItems := idNumberListToFull(c.CarriedItems, allItems)
	storedItems := idNumberListToFull(c.StoredItems, allItems)

	skills := idNumberListToFull(c.Skills, allSkills)
	talents := idNumberListToFull(c.Talents, allTalents)
	careerPath := idListToFull(c.CareerPath, allCareers)
	spells := idListToFull(c.Spells, allSpells)
	mutations := idListToFull(c.Mutations, allMutations)
	career := idToFull(c.Career, allCareers)

	return WhCharacterFull{
		Name:              strings.Clone(c.Name),
		Description:       strings.Clone(c.Description),
		Notes:             strings.Clone(c.Notes),
		EquippedItems:     equippedItems,
		CarriedItems:      carriedItems,
		StoredItems:       storedItems,
		Skills:            skills,
		Talents:           talents,
		Species:           c.Species.InitAndCopy(),
		BaseAttributes:    c.BaseAttributes.InitAndCopy(),
		AttributeAdvances: c.AttributeAdvances.InitAndCopy(),
		CareerPath:        careerPath,
		Career:            career,
		Fate:              c.Fate,
		Fortune:           c.Fortune,
		Resilience:        c.Resilience,
		Resolve:           c.Resolve,
		CurrentExp:        c.CurrentExp,
		SpentExp:          c.SpentExp,
		Status:            c.Status.InitAndCopy(),
		Standing:          c.Standing.InitAndCopy(),
		Brass:             c.Brass,
		Silver:            c.Silver,
		Gold:              c.Gold,
		Spells:            spells,
		Sin:               c.Sin,
		Corruption:        c.Corruption,
		Mutations:         mutations,
		Shared:            c.Shared,
	}
}

func idNumberListToFull(idNumberList []IdNumber, allWh []*Wh) []WhNumber {
	whNumberList := make([]WhNumber, 0)
	for _, v1 := range allWh {
		for _, v2 := range idNumberList {
			if v1.Id == v2.Id {
				whNumberList = append(whNumberList, WhNumber{
					Wh:     v1.InitAndCopy(),
					Number: v2.Number,
				})
			}
		}
	}
	return whNumberList
}

func idToFull(id string, allWh []*Wh) Wh {
	for _, v := range allWh {
		if id == v.Id {
			return v.InitAndCopy()
		}
	}
	return Wh{}
}

type WhCharacterFull struct {
	Name              string             `json:"name"`
	Description       string             `json:"description"`
	Notes             string             `json:"notes"`
	EquippedItems     []WhNumber         `json:"equippedItems"`
	CarriedItems      []WhNumber         `json:"carriedItems"`
	StoredItems       []WhNumber         `json:"storedItems"`
	Skills            []WhNumber         `json:"skills"`
	Talents           []WhNumber         `json:"talents"`
	Species           WhCharacterSpecies `json:"species"`
	BaseAttributes    WhAttributes       `json:"baseAttributes"`
	AttributeAdvances WhAttributes       `json:"attributeAdvances"`
	CareerPath        []Wh               `json:"careerPath"`
	Career            Wh                 `json:"career"`
	Fate              int                `json:"fate"`
	Fortune           int                `json:"fortune"`
	Resilience        int                `json:"resilience"`
	Resolve           int                `json:"resolve"`
	CurrentExp        int                `json:"currentExp"`
	SpentExp          int                `json:"spentExp"`
	Status            WhStatus           `json:"status"`
	Standing          WhStanding         `json:"standing"`
	Brass             int                `json:"brass"`
	Silver            int                `json:"silver"`
	Gold              int                `json:"gold"`
	Spells            []Wh               `json:"spells"`
	Sin               int                `json:"sin"`
	Corruption        int                `json:"corruption"`
	Mutations         []Wh               `json:"mutations"`
	Shared            bool               `json:"shared"`
}

func (f WhCharacterFull) IsShared() bool {
	return f.Shared
}

func (f WhCharacterFull) InitAndCopy() WhObject {
	return WhCharacterFull{
		Name:              strings.Clone(f.Name),
		Description:       strings.Clone(f.Description),
		Notes:             strings.Clone(f.Notes),
		EquippedItems:     copyArrayWhNumber(f.EquippedItems),
		CarriedItems:      copyArrayWhNumber(f.CarriedItems),
		StoredItems:       copyArrayWhNumber(f.StoredItems),
		Skills:            copyArrayWhNumber(f.Skills),
		Talents:           copyArrayWhNumber(f.Talents),
		Species:           f.Species.InitAndCopy(),
		BaseAttributes:    f.BaseAttributes.InitAndCopy(),
		AttributeAdvances: f.AttributeAdvances.InitAndCopy(),
		CareerPath:        copyWhArray(f.CareerPath),
		Career:            f.Career.InitAndCopy(),
		Fate:              f.Fate,
		Fortune:           f.Fortune,
		Resilience:        f.Resilience,
		Resolve:           f.Resolve,
		CurrentExp:        f.CurrentExp,
		SpentExp:          f.SpentExp,
		Status:            f.Status.InitAndCopy(),
		Standing:          f.Standing.InitAndCopy(),
		Brass:             f.Brass,
		Silver:            f.Silver,
		Gold:              f.Gold,
		Spells:            copyWhArray(f.Spells),
		Sin:               f.Sin,
		Corruption:        f.Corruption,
		Mutations:         copyWhArray(f.Mutations),
		Shared:            f.Shared,
	}
}
