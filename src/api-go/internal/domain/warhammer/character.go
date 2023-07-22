package warhammer

import (
	"fmt"
	"strings"
)

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
func (input CharacterSpecies) InitAndCopy() CharacterSpecies {
	if input == "" {
		return CharacterSpeciesHumanDefault
	}
	return CharacterSpecies(strings.Clone(string(input)))
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

func (c Character) IsShared() bool {
	return c.Shared
}

func (c Character) InitAndCopy() WhObject {
	return Character{
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

func GetCharacterValidationAliases() map[string]string {
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

func (c Character) ToFull(allItems []*Wh, allSkills []*Wh, allTalents []*Wh, allMutations []*Wh, allSpells []*Wh, allCareers []*Wh) CharacterFull {
	equippedItems := idNumberListToFull(c.EquippedItems, allItems)
	carriedItems := idNumberListToFull(c.CarriedItems, allItems)
	storedItems := idNumberListToFull(c.StoredItems, allItems)

	skills := idNumberListToFull(c.Skills, allSkills)
	talents := idNumberListToFull(c.Talents, allTalents)
	careerPath := idListToFull(c.CareerPath, allCareers)
	spells := idListToFull(c.Spells, allSpells)
	mutations := idListToFull(c.Mutations, allMutations)
	career := idToFull(c.Career, allCareers)

	return CharacterFull{
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
	CareerPath        []Wh             `json:"careerPath"`
	Career            Wh               `json:"career"`
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
	Spells            []Wh             `json:"spells"`
	Sin               int              `json:"sin"`
	Corruption        int              `json:"corruption"`
	Mutations         []Wh             `json:"mutations"`
	Shared            bool             `json:"shared"`
}

func (f CharacterFull) IsShared() bool {
	return f.Shared
}

func (f CharacterFull) InitAndCopy() WhObject {
	return CharacterFull{
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
