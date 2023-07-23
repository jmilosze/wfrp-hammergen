package warhammer

import (
	"fmt"
)

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

	Melee      *ItemMelee      `json:"melee"`
	Ranged     *ItemRanged     `json:"ranged"`
	Ammunition *ItemAmmunition `json:"ammunition"`
	Armour     *ItemArmour     `json:"armour"`
	Container  *ItemContainer  `json:"container"`
	Grimoire   *ItemGrimoire   `json:"grimoire"`
	Other      *ItemOther      `json:"other"`
}

func (item *Item) IsShared() bool {
	return item.Shared
}

func (item *Item) Copy() WhObject {
	return &Item{
		Name:         item.Name,
		Description:  item.Description,
		Price:        item.Price,
		Enc:          item.Enc,
		Availability: item.Availability,
		Properties:   append([]string(nil), item.Properties...),
		Type:         item.Type,
		Shared:       item.Shared,
		Source:       item.Source.Copy(),

		Melee:      item.Melee.Copy(),
		Ranged:     item.Ranged.Copy(),
		Ammunition: item.Ammunition.Copy(),
		Armour:     item.Armour.Copy(),
		Container:  item.Container.Copy(),
		Grimoire:   item.Grimoire.Copy(),
		Other:      item.Other.Copy(),
	}
}

func (item *Item) ToFull(allProperties []*Wh, allSpells []*Wh) *ItemFull {

	itemProperties := idListToWhList(item.Properties, allProperties)

	grimoire := &ItemGrimoireFull{}
	grimoire.Spells = idListToWhList(item.Grimoire.Spells, allSpells)

	return &ItemFull{
		Name:         item.Name,
		Description:  item.Description,
		Price:        item.Price,
		Enc:          item.Enc,
		Availability: item.Availability,
		Properties:   itemProperties,
		Type:         item.Type,
		Shared:       item.Shared,
		Source:       item.Source.Copy(),

		Melee:      item.Melee.Copy(),
		Ranged:     item.Ranged.Copy(),
		Ammunition: item.Ammunition.Copy(),
		Armour:     item.Armour.Copy(),
		Container:  item.Container.Copy(),
		Grimoire:   grimoire,
		Other:      item.Other.Copy(),
	}
}

func NewItem() WhObject {
	return &Item{
		Properties: []string{},
		Source:     NewSourceMap(),
		Melee:      &ItemMelee{},
		Ranged:     &ItemRanged{},
		Ammunition: &ItemAmmunition{},
		Armour:     &ItemArmour{Location: []ItemArmourLocation{}},
		Container:  &ItemContainer{},
		Grimoire:   &ItemGrimoire{Spells: []string{}},
		Other:      &ItemOther{},
	}
}

type ItemMelee struct {
	Hands     ItemHands      `json:"hands" validate:"item_hands_valid"`
	Dmg       int            `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64        `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Reach     ItemMeleeReach `json:"reach" validate:"item_melee_reach_valid"`
	Group     ItemMeleeGroup `json:"group" validate:"item_melee_group_valid"`
}

func (itemMelee *ItemMelee) Copy() *ItemMelee {
	return &ItemMelee{
		Hands:     itemMelee.Hands,
		Dmg:       itemMelee.Dmg,
		DmgSbMult: itemMelee.DmgSbMult,
		Reach:     itemMelee.Reach,
		Group:     itemMelee.Group,
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

func (itemRanged *ItemRanged) Copy() *ItemRanged {
	return &ItemRanged{
		Hands:     itemRanged.Hands,
		Dmg:       itemRanged.Dmg,
		DmgSbMult: itemRanged.DmgSbMult,
		Rng:       itemRanged.Rng,
		RngSbMult: itemRanged.RngSbMult,
		Group:     itemRanged.Group,
	}
}

type ItemAmmunition struct {
	Dmg     int                 `json:"dmg" validate:"gte=-100,lte=100"`
	Rng     int                 `json:"rng" validate:"gte=-10000,lte=10000"`
	RngMult float64             `json:"rngMult" validate:"gte=0,lte=10"`
	Group   ItemAmmunitionGroup `json:"group" validate:"item_ammunition_group_valid"`
}

func (itemAmmunition *ItemAmmunition) Copy() *ItemAmmunition {
	return &ItemAmmunition{
		Dmg:     itemAmmunition.Dmg,
		Rng:     itemAmmunition.Rng,
		RngMult: itemAmmunition.RngMult,
		Group:   itemAmmunition.Group,
	}
}

type ItemArmour struct {
	Points   int                  `json:"points" validate:"gte=0,lte=100"`
	Location []ItemArmourLocation `json:"location" validate:"dive,item_armour_location_valid"`
	Group    ItemArmourGroup      `json:"group" validate:"item_armour_group_valid"`
}

func (itemArmour *ItemArmour) Copy() *ItemArmour {
	return &ItemArmour{
		Points:   itemArmour.Points,
		Location: append([]ItemArmourLocation(nil), itemArmour.Location...),
		Group:    itemArmour.Group,
	}
}

type ItemContainer struct {
	Capacity  int           `json:"capacity" validate:"gte=0,lte=1000"`
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (itemContainer *ItemContainer) Copy() *ItemContainer {
	return &ItemContainer{
		Capacity:  itemContainer.Capacity,
		CarryType: itemContainer.CarryType,
	}
}

type ItemGrimoire struct {
	Spells []string `json:"spells" validate:"dive,id_valid"`
}

func (itemGrimoire *ItemGrimoire) Copy() *ItemGrimoire {
	return &ItemGrimoire{
		Spells: append([]string(nil), itemGrimoire.Spells...),
	}
}

type ItemOther struct {
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (itemOther *ItemOther) Copy() *ItemOther {
	return &ItemOther{
		CarryType: itemOther.CarryType,
	}
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
)

func itemAvailabilityValues() string {
	return formatIntegerValues([]ItemAvailability{
		ItemAvailabilityCommon,
		ItemAvailabilityScarce,
		ItemAvailabilityRare,
		ItemAvailabilityExotic,
	})
}

type ItemFull struct {
	Name         string           `json:"name"`
	Description  string           `json:"description" `
	Price        float64          `json:"price"`
	Enc          float64          `json:"enc"`
	Availability ItemAvailability `json:"availability"`
	Properties   []*Wh            `json:"properties"`
	Type         ItemType         `json:"type"`
	Shared       bool             `json:"shared"`
	Source       SourceMap        `json:"source"`

	Melee      *ItemMelee        `json:"melee"`
	Ranged     *ItemRanged       `json:"ranged"`
	Ammunition *ItemAmmunition   `json:"ammunition"`
	Armour     *ItemArmour       `json:"armour"`
	Container  *ItemContainer    `json:"container"`
	Grimoire   *ItemGrimoireFull `json:"grimoire"`
	Other      *ItemOther        `json:"other"`
}

func (itemFull ItemFull) IsShared() bool {
	return itemFull.Shared
}

func (itemFull ItemFull) Copy() WhObject {
	return ItemFull{
		Name:         itemFull.Name,
		Description:  itemFull.Description,
		Price:        itemFull.Price,
		Enc:          itemFull.Enc,
		Availability: itemFull.Availability,
		Properties:   copyWhArray(itemFull.Properties),
		Type:         itemFull.Type,
		Shared:       itemFull.Shared,
		Source:       itemFull.Source.Copy(),

		Melee:      itemFull.Melee.Copy(),
		Ranged:     itemFull.Ranged.Copy(),
		Ammunition: itemFull.Ammunition.Copy(),
		Armour:     itemFull.Armour.Copy(),
		Container:  itemFull.Container.Copy(),
		Grimoire:   itemFull.Grimoire.Copy(),
		Other:      itemFull.Other.Copy(),
	}
}

type ItemGrimoireFull struct {
	Spells []*Wh `json:"spells"`
}

func (itemGrimoireFull *ItemGrimoireFull) Copy() *ItemGrimoireFull {
	return &ItemGrimoireFull{
		Spells: copyWhArray(itemGrimoireFull.Spells),
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
