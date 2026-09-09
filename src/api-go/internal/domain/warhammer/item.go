package warhammer

import (
	"errors"
	"fmt"
)

type Item struct {
	Name         string            `json:"name" validate:"name_valid"`
	Description  string            `json:"description" validate:"desc_valid"`
	Price        float64           `json:"price" validate:"gte=0,lte=1000000000"`
	Enc          float64           `json:"enc" validate:"gte=0,lte=1000"`
	Availability ItemAvailability  `json:"availability" validate:"item_availability_valid"`
	Properties   []string          `json:"properties" validate:"unique,dive,id_valid"`
	Runes        []IdNumber        `json:"runes" validate:"dive"`
	Type         ItemType          `json:"type" validate:"item_type_valid"`
	Source       map[Source]string `json:"source" validate:"source_valid"`

	Melee      ItemMelee      `json:"melee"`
	Ranged     ItemRanged     `json:"ranged"`
	Ammunition ItemAmmunition `json:"ammunition"`
	Armour     ItemArmour     `json:"armour"`
	Container  ItemContainer  `json:"container"`
	Grimoire   ItemGrimoire   `json:"grimoire"`
	Other      ItemOther      `json:"other"`
}

func (item *Item) Init() {
	if item.Properties == nil {
		item.Properties = []string{}
	}
	if item.Runes == nil {
		item.Runes = []IdNumber{}
	}
	if item.Source == nil {
		item.Source = map[Source]string{}
	}
	if item.Armour.Location == nil {
		item.Armour.Location = []ItemArmourLocation{}
	}
	if item.Grimoire.Spells == nil {
		item.Grimoire.Spells = []string{}
	}
}

func (item *Item) ToFull(allProperties []*Wh, allSpells []*Wh, allRunes []*Wh) (*ItemFull, error) {
	if allProperties == nil {
		return nil, errors.New("allProperties is nil")
	}
	if allSpells == nil {
		return nil, errors.New("allSpells is nil")
	}
	if allRunes == nil {
		return nil, errors.New("allRunes is nil")
	}

	itemProperties := idListToWhList(item.Properties, whListToIdWhMap(allProperties))
	itemRunes := idNumberListToWhNumberList(item.Runes, whListToIdWhMap(allRunes))

	grimoire := ItemGrimoireFull{
		Spells: idListToWhList(item.Grimoire.Spells, whListToIdWhMap(allSpells)),
	}

	fullItem := &ItemFull{
		Name:         item.Name,
		Description:  item.Description,
		Price:        item.Price,
		Enc:          item.Enc,
		Availability: item.Availability,
		Properties:   itemProperties,
		Runes:        itemRunes,
		Type:         item.Type,
		Source:       item.Source,

		Melee:      item.Melee,
		Ranged:     item.Ranged,
		Ammunition: item.Ammunition,
		Armour:     item.Armour,
		Container:  item.Container,
		Grimoire:   grimoire,
		Other:      item.Other,
	}
	fullItem.Init()
	return fullItem, nil
}

type ItemMelee struct {
	Hands     ItemHands      `json:"hands" validate:"item_hands_valid"`
	Dmg       int            `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64        `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Reach     ItemMeleeReach `json:"reach" validate:"item_melee_reach_valid"`
	Group     ItemMeleeGroup `json:"group" validate:"item_melee_group_valid"`
}

type ItemRanged struct {
	Hands     ItemHands       `json:"hands" validate:"item_hands_valid"`
	Dmg       int             `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64         `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Rng       int             `json:"rng" validate:"gte=-10000,lte=10000"`
	RngSbMult float64         `json:"rngSbMult" validate:"gte=0,lte=10"`
	Group     ItemRangedGroup `json:"group" validate:"item_ranged_group_valid"`
}

type ItemAmmunition struct {
	Dmg     int                 `json:"dmg" validate:"gte=-100,lte=100"`
	Rng     int                 `json:"rng" validate:"gte=-10000,lte=10000"`
	RngMult float64             `json:"rngMult" validate:"gte=0,lte=10"`
	Group   ItemAmmunitionGroup `json:"group" validate:"item_ammunition_group_valid"`
}

type ItemArmour struct {
	Points   int                  `json:"points" validate:"gte=0,lte=100"`
	Location []ItemArmourLocation `json:"location" validate:"dive,item_armour_location_valid"`
	Group    ItemArmourGroup      `json:"group" validate:"item_armour_group_valid"`
}

type ItemContainer struct {
	Capacity  int           `json:"capacity" validate:"gte=0,lte=1000"`
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

type ItemGrimoire struct {
	Spells []string `json:"spells" validate:"dive,id_valid"`
}

type ItemOther struct {
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

type ItemType int

const (
	ItemTypeMelee      = 0
	ItemTypeRanged     = 1
	ItemTypeAmmunition = 2
	ItemTypeArmour     = 3
	ItemTypeContainer  = 4
	ItemTypeGrimoire   = 6
	ItemTypeOther      = 5
)

func itemTypeValues() string {
	return formatIntegerValues([]ItemType{
		ItemTypeMelee,
		ItemTypeRanged,
		ItemTypeAmmunition,
		ItemTypeArmour,
		ItemTypeContainer,
		ItemTypeGrimoire,
		ItemTypeOther,
	})
}

type ItemHands int

const (
	ItemHandsAny = 0
	ItemHandsOne = 1
	ItemHandsTwo = 2
)

func itemHandsValues() string {
	return formatIntegerValues([]ItemHands{
		ItemHandsAny,
		ItemHandsOne,
		ItemHandsTwo,
	})
}

type ItemMeleeReach int

const (
	ItemMeleeReachPersonal  = 0
	ItemMeleeReachVeryShort = 1
	ItemMeleeReachShort     = 2
	ItemMeleeReachAverage   = 3
	ItemMeleeReachLong      = 4
	ItemMeleeReachVeryLong  = 5
	ItemMeleeReachMassive   = 6
)

func itemMeleeReachValues() string {
	return formatIntegerValues([]ItemMeleeReach{
		ItemMeleeReachPersonal,
		ItemMeleeReachVeryShort,
		ItemMeleeReachShort,
		ItemMeleeReachAverage,
		ItemMeleeReachLong,
		ItemMeleeReachVeryLong,
		ItemMeleeReachMassive,
	})
}

type ItemMeleeGroup int

const (
	ItemMeleeGroupBasic       = 0
	ItemMeleeGroupCavalry     = 1
	ItemMeleeGroupFencing     = 2
	ItemMeleeGroupBrawling    = 3
	ItemMeleeGroupFlail       = 4
	ItemMeleeGroupParry       = 5
	ItemMeleeGroupPolearm     = 6
	ItemMeleeGroupTwoHanded   = 7
	ItemMeleeGroupEngineering = 8
)

func itemMeleeGroupValues() string {
	return formatIntegerValues([]ItemMeleeGroup{
		ItemMeleeGroupBasic,
		ItemMeleeGroupCavalry,
		ItemMeleeGroupFencing,
		ItemMeleeGroupBrawling,
		ItemMeleeGroupFlail,
		ItemMeleeGroupParry,
		ItemMeleeGroupPolearm,
		ItemMeleeGroupTwoHanded,
		ItemMeleeGroupEngineering,
	})
}

type ItemRangedGroup int

const (
	RangedGroupBlackpowder = 0
	RangedGroupBow         = 1
	RangedGroupCrossbow    = 2
	RangedGroupEngineering = 3
	RangedGroupEntangling  = 4
	RangedGroupExplosives  = 5
	RangedGroupSling       = 6
	RangedGroupThrowing    = 7
	RangedGroupBlowpipe    = 8
)

func itemRangedGroupValues() string {
	return formatIntegerValues([]ItemRangedGroup{
		RangedGroupBlackpowder,
		RangedGroupBow,
		RangedGroupCrossbow,
		RangedGroupEngineering,
		RangedGroupEntangling,
		RangedGroupExplosives,
		RangedGroupSling,
		RangedGroupThrowing,
		RangedGroupBlowpipe,
	})
}

type ItemAmmunitionGroup int

const (
	ItemAmmunitionGroupBlackpowderAndEngineering = 0
	ItemAmmunitionGroupBow                       = 1
	ItemAmmunitionGroupCrossbow                  = 2
	ItemAmmunitionGroupSling                     = 3
	ItemAmmunitionGroupEntangling                = 4
	ItemAmmunitionGroupBlowpipe                  = 5
)

func itemAmmunitionGroupValues() string {
	return formatIntegerValues([]ItemAmmunitionGroup{
		ItemAmmunitionGroupBlackpowderAndEngineering,
		ItemAmmunitionGroupBow,
		ItemAmmunitionGroupCrossbow,
		ItemAmmunitionGroupSling,
		ItemAmmunitionGroupEntangling,
		ItemAmmunitionGroupBlowpipe,
	})
}

type ItemArmourGroup int

const (
	ItemArmourGroupSoftLeather   = 0
	ItemArmourGroupBoiledLeather = 1
	ItemArmourGroupMail          = 2
	ItemArmourGroupPlate         = 3
	ItemArmourGroupSoftKit       = 4
	ItemArmourGroupBrigandine    = 5
	ItemArmourGroupOther         = 6
)

func itemArmourGroupValues() string {
	return formatIntegerValues([]ItemArmourGroup{
		ItemArmourGroupSoftLeather,
		ItemArmourGroupBoiledLeather,
		ItemArmourGroupMail,
		ItemArmourGroupPlate,
		ItemArmourGroupSoftKit,
		ItemArmourGroupBrigandine,
		ItemArmourGroupOther,
	})
}

type ItemArmourLocation int

const (
	ItemArmourLocationArms = 0
	ItemArmourLocationBody = 1
	ItemArmourLocationLegs = 2
	ItemArmourLocationHead = 3
)

func itemArmourLocationValues() string {
	return formatIntegerValues([]ItemArmourLocation{
		ItemArmourLocationArms,
		ItemArmourLocationBody,
		ItemArmourLocationLegs,
		ItemArmourLocationHead,
	})
}

type ItemCarryType int

const (
	ItemCarryTypeCarriableAndWearable       = 0
	ItemCarryTypeCarriableAndNotWearable    = 1
	ItemCarryTypeNotCarriableAndNotWearable = 2
)

func itemCarryTypeValues() string {
	return formatIntegerValues([]ItemCarryType{
		ItemCarryTypeCarriableAndWearable,
		ItemCarryTypeCarriableAndNotWearable,
		ItemCarryTypeNotCarriableAndNotWearable,
	})
}

type ItemAvailability int

const (
	ItemAvailabilityCommon = 0
	ItemAvailabilityScarce = 1
	ItemAvailabilityRare   = 2
	ItemAvailabilityExotic = 3
	ItemAvailabilityUnique = 4
)

func itemAvailabilityValues() string {
	return formatIntegerValues([]ItemAvailability{
		ItemAvailabilityCommon,
		ItemAvailabilityScarce,
		ItemAvailabilityRare,
		ItemAvailabilityExotic,
		ItemAvailabilityUnique,
	})
}

type ItemFull struct {
	Name         string            `json:"name"`
	Description  string            `json:"description"`
	Price        float64           `json:"price"`
	Enc          float64           `json:"enc"`
	Availability ItemAvailability  `json:"availability"`
	Properties   []*Wh             `json:"properties"`
	Runes        []WhNumber        `json:"runes"`
	Type         ItemType          `json:"type"`
	Source       map[Source]string `json:"source"`

	Melee      ItemMelee        `json:"melee"`
	Ranged     ItemRanged       `json:"ranged"`
	Ammunition ItemAmmunition   `json:"ammunition"`
	Armour     ItemArmour       `json:"armour"`
	Container  ItemContainer    `json:"container"`
	Grimoire   ItemGrimoireFull `json:"grimoire"`
	Other      ItemOther        `json:"other"`
}

type ItemGrimoireFull struct {
	Spells []*Wh `json:"spells"`
}

func (item *ItemFull) Init() {
	if item.Properties == nil {
		item.Properties = []*Wh{}
	}
	if item.Runes == nil {
		item.Runes = []WhNumber{}
	}
	if item.Source == nil {
		item.Source = map[Source]string{}
	}
	if item.Armour.Location == nil {
		item.Armour.Location = []ItemArmourLocation{}
	}
	if item.Grimoire.Spells == nil {
		item.Grimoire.Spells = []*Wh{}
	}
}

func GetItemValidationAliases() map[string]string {
	return map[string]string{
		"item_type_valid":             fmt.Sprintf("oneof=%s", itemTypeValues()),
		"item_hands_valid":            fmt.Sprintf("oneof=%s", itemHandsValues()),
		"item_melee_reach_valid":      fmt.Sprintf("oneof=%s", itemMeleeReachValues()),
		"item_melee_group_valid":      fmt.Sprintf("oneof=%s", itemMeleeGroupValues()),
		"item_ranged_group_valid":     fmt.Sprintf("oneof=%s", itemRangedGroupValues()),
		"item_ammunition_group_valid": fmt.Sprintf("oneof=%s", itemAmmunitionGroupValues()),
		"item_armour_group_valid":     fmt.Sprintf("oneof=%s", itemArmourGroupValues()),
		"item_armour_location_valid":  fmt.Sprintf("oneof=%s", itemArmourLocationValues()),
		"item_carry_type_valid":       fmt.Sprintf("oneof=%s", itemCarryTypeValues()),
		"item_availability_valid":     fmt.Sprintf("oneof=%s", itemAvailabilityValues()),
	}
}
