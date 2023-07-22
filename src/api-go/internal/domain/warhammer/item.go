package warhammer

import (
	"fmt"
	"golang.org/x/exp/slices"
	"strings"
)

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
func (input ItemType) InitAndCopy() ItemType {
	return input
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

func (input ItemHands) InitAndCopy() ItemHands {
	return input
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

func (input ItemMeleeReach) InitAndCopy() ItemMeleeReach {
	return input
}

type ItemMeleeGroup int

const (
	ItemMeleeGroupBasic     = 0
	ItemMeleeGroupCavalry   = 1
	ItemMeleeGroupFencing   = 2
	ItemMeleeGroupBrawling  = 3
	ItemMeleeGroupFlail     = 4
	ItemMeleeGroupParry     = 5
	ItemMeleeGroupPolearm   = 6
	ItemMeleeGroupTwoHanded = 7
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
	})
}

func (input ItemMeleeGroup) InitAndCopy() ItemMeleeGroup {
	return input
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
)

func ItemRangedGroupValues() string {
	return formatIntegerValues([]ItemRangedGroup{
		RangedGroupBlackpowder,
		RangedGroupBow,
		RangedGroupCrossbow,
		RangedGroupEngineering,
		RangedGroupEntangling,
		RangedGroupExplosives,
		RangedGroupSling,
		RangedGroupThrowing,
	})
}

func (input ItemRangedGroup) InitAndCopy() ItemRangedGroup {
	return input
}

type ItemAmmunitionGroup int

const (
	ItemAmmunitionGroupBlackpowderAndEngineering = 0
	ItemAmmunitionGroupBow                       = 1
	ItemAmmunitionGroupCrossbow                  = 2
	ItemAmmunitionGroupSling                     = 3
	ItemAmmunitionGroupEntangling                = 4
)

func itemAmmunitionGroupValues() string {
	return formatIntegerValues([]ItemAmmunitionGroup{
		ItemAmmunitionGroupBlackpowderAndEngineering,
		ItemAmmunitionGroupBow,
		ItemAmmunitionGroupCrossbow,
		ItemAmmunitionGroupSling,
		ItemAmmunitionGroupEntangling,
	})
}

func (input ItemAmmunitionGroup) InitAndCopy() ItemAmmunitionGroup {
	return input
}

type ItemArmourGroup int

const (
	ItemArmourGroupSoftLeather   = 0
	ItemArmourGroupBoiledLeather = 1
	ItemArmourGroupMail          = 2
	ItemArmourGroupPlate         = 3
	ItemArmourGroupSoftKit       = 4
	ItemArmourGroupBrigandine    = 5
)

func itemArmourGroupValues() string {
	return formatIntegerValues([]ItemArmourGroup{
		ItemArmourGroupSoftLeather,
		ItemArmourGroupBoiledLeather,
		ItemArmourGroupMail,
		ItemArmourGroupPlate,
		ItemArmourGroupSoftKit,
		ItemArmourGroupBrigandine,
	})
}

func (input ItemArmourGroup) InitAndCopy() ItemArmourGroup {
	return input
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

func (input ItemArmourLocation) InitAndCopy() ItemArmourLocation {
	return input
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

func (input ItemCarryType) InitAndCopy() ItemCarryType {
	return input
}

type ItemAvailability int

const (
	ItemAvailabilityCommon = 0
	ItemAvailabilityScarce = 1
	ItemAvailabilityRare   = 2
	ItemAvailabilityExotic = 3
)

func itemAvailabilityValues() string {
	return formatIntegerValues([]ItemAvailability{
		ItemAvailabilityCommon,
		ItemAvailabilityScarce,
		ItemAvailabilityRare,
		ItemAvailabilityExotic,
	})
}

func (input ItemAvailability) InitAndCopy() ItemAvailability {
	return input
}

type ItemMelee struct {
	Hands     ItemHands      `json:"hands" validate:"item_hands_valid"`
	Dmg       int            `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64        `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Reach     ItemMeleeReach `json:"reach" validate:"item_melee_reach_valid"`
	Group     ItemMeleeGroup `json:"group" validate:"item_melee_group_valid"`
}

func (input ItemMelee) InitAndCopy() ItemMelee {
	return ItemMelee{
		Hands:     input.Hands.InitAndCopy(),
		Dmg:       input.Dmg,
		DmgSbMult: input.DmgSbMult,
		Reach:     input.Reach.InitAndCopy(),
		Group:     input.Group.InitAndCopy(),
	}
}

type ItemRanged struct {
	Hands     ItemHands       `json:"hands" validate:"item_hands_valid"`
	Dmg       int             `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64         `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Rng       int             `json:"rng" validate:"gte=-10000,lte=10000"`
	RngSbMult float64         `json:"rngSbMult" validate:"gte=0,lte=10"`
	Group     ItemRangedGroup `json:"group" validate:"item_ranged_group_valid"`
}

func (input ItemRanged) InitAndCopy() ItemRanged {
	return ItemRanged{
		Hands:     input.Hands.InitAndCopy(),
		Dmg:       input.Dmg,
		DmgSbMult: input.DmgSbMult,
		Rng:       input.Rng,
		RngSbMult: input.RngSbMult,
		Group:     input.Group.InitAndCopy(),
	}
}

type ItemAmmunition struct {
	Dmg     int                 `json:"dmg" validate:"gte=-100,lte=100"`
	Rng     int                 `json:"rng" validate:"gte=-10000,lte=10000"`
	RngMult float64             `json:"rngMult" validate:"gte=0,lte=10"`
	Group   ItemAmmunitionGroup `json:"group" validate:"item_ammunition_group_valid"`
}

func (input ItemAmmunition) InitAndCopy() ItemAmmunition {
	return ItemAmmunition{
		Dmg:     input.Dmg,
		Rng:     input.Rng,
		RngMult: input.RngMult,
		Group:   input.Group.InitAndCopy(),
	}
}

type ItemArmour struct {
	Points   int                  `json:"points" validate:"gte=0,lte=100"`
	Location []ItemArmourLocation `json:"location" validate:"dive,item_armour_location_valid"`
	Group    ItemArmourGroup      `json:"group" validate:"item_armour_group_valid"`
}

func (input ItemArmour) InitAndCopy() ItemArmour {
	return ItemArmour{
		Points:   input.Points,
		Location: copyIntArray(input.Location),
		Group:    input.Group.InitAndCopy(),
	}
}

type ItemContainer struct {
	Capacity  int           `json:"capacity" validate:"gte=0,lte=1000"`
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (input ItemContainer) InitAndCopy() ItemContainer {
	return ItemContainer{
		Capacity:  input.Capacity,
		CarryType: input.CarryType.InitAndCopy(),
	}
}

type ItemGrimoire struct {
	Spells []string `json:"spells" validate:"dive,id_valid"`
}

func (input ItemGrimoire) InitAndCopy() ItemGrimoire {
	return ItemGrimoire{
		Spells: copyStringArray(input.Spells),
	}
}

type ItemOther struct {
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (input ItemOther) InitAndCopy() ItemOther {
	return ItemOther{
		CarryType: input.CarryType.InitAndCopy(),
	}
}

type Item struct {
	Name         string           `json:"name" validate:"name_valid"`
	Description  string           `json:"description" validate:"desc_valid"`
	Price        float64          `json:"price" validate:"gte=0,lte=1000000000"`
	Enc          float64          `json:"enc" validate:"gte=0,lte=1000"`
	Availability ItemAvailability `json:"availability" validate:"item_availability_valid"`
	Properties   []string         `json:"properties" validate:"dive,id_valid"`
	Type         ItemType         `json:"type" validate:"item_type_valid"`
	Shared       bool             `json:"shared" validate:"shared_valid"`
	Source       SourceMap        `json:"source" validate:"source_valid"`

	Melee      ItemMelee      `json:"melee"`
	Ranged     ItemRanged     `json:"ranged"`
	Ammunition ItemAmmunition `json:"ammunition"`
	Armour     ItemArmour     `json:"armour"`
	Container  ItemContainer  `json:"container"`
	Grimoire   ItemGrimoire   `json:"grimoire"`
	Other      ItemOther      `json:"other"`
}

func (i Item) IsShared() bool {
	return i.Shared
}

func (i Item) InitAndCopy() WhObject {
	return Item{
		Name:         strings.Clone(i.Name),
		Description:  strings.Clone(i.Description),
		Price:        i.Price,
		Enc:          i.Enc,
		Availability: i.Availability.InitAndCopy(),
		Properties:   copyStringArray(i.Properties),
		Type:         i.Type.InitAndCopy(),
		Shared:       i.Shared,
		Source:       i.Source.InitAndCopy(),

		Melee:      i.Melee.InitAndCopy(),
		Ranged:     i.Ranged.InitAndCopy(),
		Ammunition: i.Ammunition.InitAndCopy(),
		Armour:     i.Armour.InitAndCopy(),
		Container:  i.Container.InitAndCopy(),
		Grimoire:   i.Grimoire.InitAndCopy(),
		Other:      i.Other.InitAndCopy(),
	}
}

func GetItemValidationAliases() map[string]string {
	return map[string]string{
		"item_type_valid":             fmt.Sprintf("oneof=%s", itemTypeValues()),
		"item_hands_valid":            fmt.Sprintf("oneof=%s", itemHandsValues()),
		"item_melee_reach_valid":      fmt.Sprintf("oneof=%s", itemMeleeReachValues()),
		"item_melee_group_valid":      fmt.Sprintf("oneof=%s", itemMeleeGroupValues()),
		"item_ranged_group_valid":     fmt.Sprintf("oneof=%s", ItemRangedGroupValues()),
		"item_ammunition_group_valid": fmt.Sprintf("oneof=%s", itemAmmunitionGroupValues()),
		"item_armour_group_valid":     fmt.Sprintf("oneof=%s", itemArmourGroupValues()),
		"item_armour_location_valid":  fmt.Sprintf("oneof=%s", itemArmourLocationValues()),
		"item_carry_type_valid":       fmt.Sprintf("oneof=%s", itemCarryTypeValues()),
		"item_availability_valid":     fmt.Sprintf("oneof=%s", itemAvailabilityValues()),
	}
}

func (i Item) ToFull(allProperties []*Wh, allSpells []*Wh) ItemFull {

	itemProperties := idListToFull(i.Properties, allProperties)

	var grimoire ItemGrimoireFull
	grimoire.Spells = idListToFull(i.Grimoire.Spells, allSpells)

	return ItemFull{
		Name:         strings.Clone(i.Name),
		Description:  strings.Clone(i.Description),
		Price:        i.Price,
		Enc:          i.Enc,
		Availability: i.Availability.InitAndCopy(),
		Properties:   itemProperties,
		Type:         i.Type.InitAndCopy(),
		Shared:       i.Shared,
		Source:       i.Source.InitAndCopy(),

		Melee:      i.Melee.InitAndCopy(),
		Ranged:     i.Ranged.InitAndCopy(),
		Ammunition: i.Ammunition.InitAndCopy(),
		Armour:     i.Armour.InitAndCopy(),
		Container:  i.Container.InitAndCopy(),
		Grimoire:   grimoire,
		Other:      i.Other.InitAndCopy(),
	}
}

func idListToFull(idList []string, allWh []*Wh) []Wh {
	whList := make([]Wh, 0)
	for _, v := range allWh {
		if slices.Contains(idList, v.Id) {
			whList = append(whList, v.InitAndCopy())
		}
	}
	return whList
}

type ItemGrimoireFull struct {
	Spells []Wh `json:"spells"`
}

func (input ItemGrimoireFull) InitAndCopy() ItemGrimoireFull {
	return ItemGrimoireFull{
		Spells: copyWhArray(input.Spells),
	}
}

type ItemFull struct {
	Name         string           `json:"name"`
	Description  string           `json:"description" `
	Price        float64          `json:"price"`
	Enc          float64          `json:"enc"`
	Availability ItemAvailability `json:"availability"`
	Properties   []Wh             `json:"properties"`
	Type         ItemType         `json:"type"`
	Shared       bool             `json:"shared"`
	Source       SourceMap        `json:"source"`

	Melee      ItemMelee        `json:"melee"`
	Ranged     ItemRanged       `json:"ranged"`
	Ammunition ItemAmmunition   `json:"ammunition"`
	Armour     ItemArmour       `json:"armour"`
	Container  ItemContainer    `json:"container"`
	Grimoire   ItemGrimoireFull `json:"grimoire"`
	Other      ItemOther        `json:"other"`
}

func (i ItemFull) IsShared() bool {
	return i.Shared
}

func (i ItemFull) InitAndCopy() WhObject {
	return ItemFull{
		Name:         strings.Clone(i.Name),
		Description:  strings.Clone(i.Description),
		Price:        i.Price,
		Enc:          i.Enc,
		Availability: i.Availability.InitAndCopy(),
		Properties:   copyWhArray(i.Properties),
		Type:         i.Type.InitAndCopy(),
		Shared:       i.Shared,
		Source:       i.Source.InitAndCopy(),

		Melee:      i.Melee.InitAndCopy(),
		Ranged:     i.Ranged.InitAndCopy(),
		Ammunition: i.Ammunition.InitAndCopy(),
		Armour:     i.Armour.InitAndCopy(),
		Container:  i.Container.InitAndCopy(),
		Grimoire:   i.Grimoire.InitAndCopy(),
		Other:      i.Other.InitAndCopy(),
	}
}
