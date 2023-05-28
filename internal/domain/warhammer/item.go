package warhammer

import (
	"fmt"
	"strings"
)

type WhItemType int

const (
	WhItemTypeMelee      = 0
	WhItemTypeRanged     = 1
	WhItemTypeAmmunition = 2
	WhItemTypeArmour     = 3
	WhItemTypeContainer  = 4
	WhItemTypeGrimoire   = 6
	WhItemTypeOther      = 5
)

func itemTypeValues() string {
	return formatIntegerValues([]WhItemType{
		WhItemTypeMelee,
		WhItemTypeRanged,
		WhItemTypeAmmunition,
		WhItemTypeArmour,
		WhItemTypeContainer,
		WhItemTypeGrimoire,
		WhItemTypeOther,
	})
}
func (input WhItemType) InitAndCopy() WhItemType {
	return input
}

type WhItemHands int

const (
	WhItemHandsAny = 0
	WhItemHandsOne = 1
	WhItemHandsTwo = 2
)

func itemHandsValues() string {
	return formatIntegerValues([]WhItemHands{
		WhItemHandsAny,
		WhItemHandsOne,
		WhItemHandsTwo,
	})
}

func (input WhItemHands) InitAndCopy() WhItemHands {
	return input
}

type WhItemMeleeReach int

const (
	WhItemMeleeReachPersonal  = 0
	WhItemMeleeReachVeryShort = 1
	WhItemMeleeReachShort     = 2
	WhItemMeleeReachAverage   = 3
	WhItemMeleeReachLong      = 4
	WhItemMeleeReachVeryLong  = 5
	WhItemMeleeReachMassive   = 6
)

func itemMeleeReachValues() string {
	return formatIntegerValues([]WhItemMeleeReach{
		WhItemMeleeReachPersonal,
		WhItemMeleeReachVeryShort,
		WhItemMeleeReachShort,
		WhItemMeleeReachAverage,
		WhItemMeleeReachLong,
		WhItemMeleeReachVeryLong,
		WhItemMeleeReachMassive,
	})
}

func (input WhItemMeleeReach) InitAndCopy() WhItemMeleeReach {
	return input
}

type WhItemMeleeGroup int

const (
	WhItemMeleeGroupBasic     = 0
	WhItemMeleeGroupCavalry   = 1
	WhItemMeleeGroupFencing   = 2
	WhItemMeleeGroupBrawling  = 3
	WhItemMeleeGroupFlail     = 4
	WhItemMeleeGroupParry     = 5
	WhItemMeleeGroupPolearm   = 6
	WhItemMeleeGroupTwoHanded = 7
)

func itemMeleeGroupValues() string {
	return formatIntegerValues([]WhItemMeleeGroup{
		WhItemMeleeGroupBasic,
		WhItemMeleeGroupCavalry,
		WhItemMeleeGroupFencing,
		WhItemMeleeGroupBrawling,
		WhItemMeleeGroupFlail,
		WhItemMeleeGroupParry,
		WhItemMeleeGroupPolearm,
		WhItemMeleeGroupTwoHanded,
	})
}

func (input WhItemMeleeGroup) InitAndCopy() WhItemMeleeGroup {
	return input
}

type WhItemRangedGroup int

const (
	WhItemRangedGroupBlackpowder = 0
	WhItemRangedGroupBow         = 1
	WhItemRangedGroupCrossbow    = 2
	WhItemRangedGroupEngineering = 3
	WhItemRangedGroupEntangling  = 4
	WhItemRangedGroupExplosives  = 5
	WhItemRangedGroupSling       = 6
	WhItemRangedGroupThrowing    = 7
)

func ItemRangedGroupValues() string {
	return formatIntegerValues([]WhItemRangedGroup{
		WhItemRangedGroupBlackpowder,
		WhItemRangedGroupBow,
		WhItemRangedGroupCrossbow,
		WhItemRangedGroupEngineering,
		WhItemRangedGroupEntangling,
		WhItemRangedGroupExplosives,
		WhItemRangedGroupSling,
		WhItemRangedGroupThrowing,
	})
}

func (input WhItemRangedGroup) InitAndCopy() WhItemRangedGroup {
	return input
}

type WhItemAmmunitionGroup int

const (
	WhItemAmmunitionGroupBlackpowderAndEngineering = 0
	WhItemAmmunitionGroupBow                       = 1
	WhItemAmmunitionGroupCrossbow                  = 2
	WhItemAmmunitionGroupSling                     = 3
	WhItemAmmunitionGroupEntangling                = 4
)

func itemAmmunitionGroupValues() string {
	return formatIntegerValues([]WhItemAmmunitionGroup{
		WhItemAmmunitionGroupBlackpowderAndEngineering,
		WhItemAmmunitionGroupBow,
		WhItemAmmunitionGroupCrossbow,
		WhItemAmmunitionGroupSling,
		WhItemAmmunitionGroupEntangling,
	})
}

func (input WhItemAmmunitionGroup) InitAndCopy() WhItemAmmunitionGroup {
	return input
}

type WhItemArmourGroup int

const (
	WhItemArmourGroupSoftLeather   = 0
	WhItemArmourGroupBoiledLeather = 1
	WhItemArmourGroupMail          = 2
	WhItemArmourGroupPlate         = 3
	WhItemArmourGroupSoftKit       = 4
	WhItemArmourGroupBrigandine    = 5
)

func itemArmourGroupValues() string {
	return formatIntegerValues([]WhItemArmourGroup{
		WhItemArmourGroupSoftLeather,
		WhItemArmourGroupBoiledLeather,
		WhItemArmourGroupMail,
		WhItemArmourGroupPlate,
		WhItemArmourGroupSoftKit,
		WhItemArmourGroupBrigandine,
	})
}

func (input WhItemArmourGroup) InitAndCopy() WhItemArmourGroup {
	return input
}

type WhItemArmourLocation int

const (
	WhItemArmourLocationArms = 0
	WhItemArmourLocationBody = 1
	WhItemArmourLocationLegs = 2
	WhItemArmourLocationHead = 3
)

func itemArmourLocationValues() string {
	return formatIntegerValues([]WhItemArmourLocation{
		WhItemArmourLocationArms,
		WhItemArmourLocationBody,
		WhItemArmourLocationLegs,
		WhItemArmourLocationHead,
	})
}

func (input WhItemArmourLocation) InitAndCopy() WhItemArmourLocation {
	return input
}

type WhItemCarryType int

const (
	WhItemCarryTypeCarriableAndWearable       = 0
	WhItemCarryTypeCarriableAndNotWearable    = 1
	WhItemCarryTypeNotCarriableAndNotWearable = 2
)

func itemCarryTypeValues() string {
	return formatIntegerValues([]WhItemCarryType{
		WhItemCarryTypeCarriableAndWearable,
		WhItemCarryTypeCarriableAndNotWearable,
		WhItemCarryTypeNotCarriableAndNotWearable,
	})
}

func (input WhItemCarryType) InitAndCopy() WhItemCarryType {
	return input
}

func GetWhItemValidationAliases() map[string]string {
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
	}
}

type WhItemMelee struct {
	Hands     WhItemHands      `json:"hands" validate:"item_hands_valid"`
	Dmg       int              `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64          `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Reach     WhItemMeleeReach `json:"reach" validate:"item_melee_reach_valid"`
	Group     WhItemMeleeGroup `json:"group" validate:"item_melee_group_valid"`
}

func (input WhItemMelee) InitAndCopy() WhItemMelee {
	return WhItemMelee{
		Hands:     input.Hands.InitAndCopy(),
		Dmg:       input.Dmg,
		DmgSbMult: input.DmgSbMult,
		Reach:     input.Reach.InitAndCopy(),
		Group:     input.Group.InitAndCopy(),
	}
}

type WhItemRanged struct {
	Hands     WhItemHands       `json:"hands" validate:"item_hands_valid"`
	Dmg       int               `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64           `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Rng       int               `json:"rng" validate:"gte=-10000,lte=10000"`
	RngSbMult float64           `json:"rngSbMult" validate:"gte=0,lte=10"`
	Group     WhItemRangedGroup `json:"group" validate:"item_ranged_group_valid"`
}

func (input WhItemRanged) InitAndCopy() WhItemRanged {
	return WhItemRanged{
		Hands:     input.Hands.InitAndCopy(),
		Dmg:       input.Dmg,
		DmgSbMult: input.DmgSbMult,
		Rng:       input.Rng,
		RngSbMult: input.RngSbMult,
		Group:     input.Group.InitAndCopy(),
	}
}

type WhItemAmmunition struct {
	Dmg     int                   `json:"dmg" validate:"gte=-100,lte=100"`
	Rng     int                   `json:"rng" validate:"gte=-10000,lte=10000"`
	RngMult float64               `json:"rngMult" validate:"gte=0,lte=10"`
	Group   WhItemAmmunitionGroup `json:"group" validate:"item_ammunition_group_valid"`
}

func (input WhItemAmmunition) InitAndCopy() WhItemAmmunition {
	return WhItemAmmunition{
		Dmg:     input.Dmg,
		Rng:     input.Rng,
		RngMult: input.RngMult,
		Group:   input.Group.InitAndCopy(),
	}
}

type WhItemArmour struct {
	Points   int                  `json:"points" validate:"gte=0,lte=100"`
	Location WhItemArmourLocation `json:"location" validate:"item_armour_location_valid"`
	Group    WhItemArmourGroup    `json:"group" validate:"item_armour_group_valid"`
}

func (input WhItemArmour) InitAndCopy() WhItemArmour {
	return WhItemArmour{
		Points:   input.Points,
		Location: input.Location.InitAndCopy(),
		Group:    input.Group.InitAndCopy(),
	}
}

type WhItemContainer struct {
	Capacity  int             `json:"capacity" validate:"gte=0,lte=1000"`
	CarryType WhItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (input WhItemContainer) InitAndCopy() WhItemContainer {
	return WhItemContainer{
		Capacity:  input.Capacity,
		CarryType: input.CarryType.InitAndCopy(),
	}
}

type WhItemGrimoire struct {
	Spells []string `json:"spells" validate:"dive,id_valid"`
}

func (input WhItemGrimoire) InitAndCopy() WhItemGrimoire {
	return WhItemGrimoire{
		Spells: copyStringArray(input.Spells),
	}
}

type WhItemOther struct {
	CarryType WhItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (input WhItemOther) InitAndCopy() WhItemOther {
	return WhItemOther{
		CarryType: input.CarryType.InitAndCopy(),
	}
}

type WhItem struct {
	Name        string      `json:"name" validate:"name_valid"`
	Description string      `json:"description" validate:"desc_valid"`
	Price       float64     `json:"price" validate:"gte=0,lte=1000000000"`
	Enc         float64     `json:"enc" validate:"gte=0,lte=1000"`
	Properties  []string    `json:"properties" validate:"dive,id_valid"`
	Type        WhItemType  `json:"type" validate:"item_type_valid"`
	Shared      bool        `json:"shared" validate:"shared_valid"`
	Source      WhSourceMap `json:"source" validate:"source_valid"`

	Melee      WhItemMelee      `json:"melee"`
	Ranged     WhItemRanged     `json:"ranged"`
	Ammunition WhItemAmmunition `json:"ammunition"`
	Armour     WhItemArmour     `json:"armour"`
	Container  WhItemContainer  `json:"container"`
	Grimoire   WhItemGrimoire   `json:"grimoire"`
	Other      WhItemOther      `json:"other"`
}

func (i WhItem) IsShared() bool {
	return i.Shared
}

func (i WhItem) InitAndCopy() WhObject {
	return WhItem{
		Name:        strings.Clone(i.Name),
		Description: strings.Clone(i.Description),
		Price:       i.Price,
		Enc:         i.Enc,
		Properties:  copyStringArray(i.Properties),
		Type:        i.Type.InitAndCopy(),
		Shared:      i.Shared,
		Source:      i.Source.InitAndCopy(),

		Melee:      i.Melee.InitAndCopy(),
		Ranged:     i.Ranged.InitAndCopy(),
		Ammunition: i.Ammunition.InitAndCopy(),
		Armour:     i.Armour.InitAndCopy(),
		Container:  i.Container.InitAndCopy(),
		Grimoire:   i.Grimoire.InitAndCopy(),
		Other:      i.Other.InitAndCopy(),
	}
}
