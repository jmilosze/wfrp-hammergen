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
	Runes        []string          `json:"runes" validate:"unique,dive,id_valid"`
	Type         ItemType          `json:"type" validate:"item_type_valid"`
	Shared       bool              `json:"shared" validate:"shared_valid"`
	Source       map[Source]string `json:"source" validate:"source_valid"`

	Melee      *ItemMelee      `json:"melee"`
	Ranged     *ItemRanged     `json:"ranged"`
	Ammunition *ItemAmmunition `json:"ammunition"`
	Armour     *ItemArmour     `json:"armour"`
	Container  *ItemContainer  `json:"container"`
	Grimoire   *ItemGrimoire   `json:"grimoire"`
	Other      *ItemOther      `json:"other"`
}

func (item *Item) IsShared() (bool, error) {
	if item == nil {
		return false, errors.New("item pointer is nil")
	}

	return item.Shared, nil
}

func (item *Item) Copy() WhObject {
	if item == nil {
		return nil
	}

	return &Item{
		Name:         item.Name,
		Description:  item.Description,
		Price:        item.Price,
		Enc:          item.Enc,
		Availability: item.Availability,
		Properties:   copyArray(item.Properties),
		Runes:        copyArray(item.Runes),
		Type:         item.Type,
		Shared:       item.Shared,
		Source:       copySourceMap(item.Source),

		Melee:      item.Melee.Copy(),
		Ranged:     item.Ranged.Copy(),
		Ammunition: item.Ammunition.Copy(),
		Armour:     item.Armour.Copy(),
		Container:  item.Container.Copy(),
		Grimoire:   item.Grimoire.Copy(),
		Other:      item.Other.Copy(),
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
	itemRunes := idListToWhList(item.Runes, whListToIdWhMap(allRunes))

	grimoire := &ItemGrimoireFull{}
	grimoire.Spells = idListToWhList(item.Grimoire.Spells, whListToIdWhMap(allSpells))

	return &ItemFull{
		Name:         item.Name,
		Description:  item.Description,
		Price:        item.Price,
		Enc:          item.Enc,
		Availability: item.Availability,
		Properties:   itemProperties,
		Runes:        itemRunes,
		Type:         item.Type,
		Shared:       item.Shared,
		Source:       copySourceMap(item.Source),

		Melee:      item.Melee.Copy(),
		Ranged:     item.Ranged.Copy(),
		Ammunition: item.Ammunition.Copy(),
		Armour:     item.Armour.Copy(),
		Container:  item.Container.Copy(),
		Grimoire:   grimoire,
		Other:      item.Other.Copy(),
	}, nil
}

func (item *Item) InitNilPointers() error {
	if item == nil {
		return errors.New("item pointer is nil")
	}

	if item.Properties == nil {
		item.Properties = []string{}
	}

	if item.Runes == nil {
		item.Runes = []string{}
	}

	if item.Source == nil {
		item.Source = map[Source]string{}
	}

	if item.Melee == nil {
		item.Melee = &ItemMelee{}
	}

	if item.Ranged == nil {
		item.Ranged = &ItemRanged{}
	}

	if item.Ammunition == nil {
		item.Ammunition = &ItemAmmunition{}
	}

	if item.Armour == nil {
		item.Armour = &ItemArmour{}
	}
	err := item.Armour.InitNilPointers()
	if err != nil {
		return err
	}

	if item.Container == nil {
		item.Container = &ItemContainer{}
	}

	if item.Grimoire == nil {
		item.Grimoire = &ItemGrimoire{}
	}
	err = item.Grimoire.InitNilPointers()
	if err != nil {
		return err
	}

	if item.Other == nil {
		item.Other = &ItemOther{}
	}

	return nil
}

type ItemMelee struct {
	Hands     ItemHands      `json:"hands" validate:"item_hands_valid"`
	Dmg       int            `json:"dmg" validate:"gte=-100,lte=100"`
	DmgSbMult float64        `json:"dmgSbMult" validate:"gte=0,lte=10"`
	Reach     ItemMeleeReach `json:"reach" validate:"item_melee_reach_valid"`
	Group     ItemMeleeGroup `json:"group" validate:"item_melee_group_valid"`
}

func (itemMelee *ItemMelee) Copy() *ItemMelee {
	if itemMelee == nil {
		return nil
	}

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
	if itemRanged == nil {
		return nil
	}

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
	if itemAmmunition == nil {
		return nil
	}

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
	if itemArmour == nil {
		return nil
	}

	return &ItemArmour{
		Points:   itemArmour.Points,
		Location: copyArray(itemArmour.Location),
		Group:    itemArmour.Group,
	}
}

func (itemArmour *ItemArmour) InitNilPointers() error {
	if itemArmour == nil {
		return errors.New("itemArmour pointer is nil")
	}

	if itemArmour.Location == nil {
		itemArmour.Location = []ItemArmourLocation{}
	}

	return nil
}

type ItemContainer struct {
	Capacity  int           `json:"capacity" validate:"gte=0,lte=1000"`
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (itemContainer *ItemContainer) Copy() *ItemContainer {
	if itemContainer == nil {
		return nil
	}

	return &ItemContainer{
		Capacity:  itemContainer.Capacity,
		CarryType: itemContainer.CarryType,
	}
}

type ItemGrimoire struct {
	Spells []string `json:"spells" validate:"dive,id_valid"`
}

func (itemGrimoire *ItemGrimoire) Copy() *ItemGrimoire {
	if itemGrimoire == nil {
		return nil
	}

	return &ItemGrimoire{
		Spells: copyArray(itemGrimoire.Spells),
	}
}

func (itemGrimoire *ItemGrimoire) InitNilPointers() error {
	if itemGrimoire == nil {
		return errors.New("itemArmour pointer is nil")
	}
	if itemGrimoire.Spells == nil {
		itemGrimoire.Spells = []string{}
	}

	return nil
}

type ItemOther struct {
	CarryType ItemCarryType `json:"carryType" validate:"item_carry_type_valid"`
}

func (itemOther *ItemOther) Copy() *ItemOther {
	if itemOther == nil {
		return nil
	}

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
	Name         string            `json:"name"`
	Description  string            `json:"description" `
	Price        float64           `json:"price"`
	Enc          float64           `json:"enc"`
	Availability ItemAvailability  `json:"availability"`
	Properties   []*Wh             `json:"properties"`
	Runes        []*Wh             `json:"runes"`
	Type         ItemType          `json:"type"`
	Shared       bool              `json:"shared"`
	Source       map[Source]string `json:"source"`

	Melee      *ItemMelee        `json:"melee"`
	Ranged     *ItemRanged       `json:"ranged"`
	Ammunition *ItemAmmunition   `json:"ammunition"`
	Armour     *ItemArmour       `json:"armour"`
	Container  *ItemContainer    `json:"container"`
	Grimoire   *ItemGrimoireFull `json:"grimoire"`
	Other      *ItemOther        `json:"other"`
}

func (itemFull *ItemFull) IsShared() (bool, error) {
	if itemFull == nil {
		return false, errors.New("itemFull pointer is nil")
	}

	return itemFull.Shared, nil
}

func (itemFull *ItemFull) Copy() WhObject {
	if itemFull == nil {
		return nil
	}

	return &ItemFull{
		Name:         itemFull.Name,
		Description:  itemFull.Description,
		Price:        itemFull.Price,
		Enc:          itemFull.Enc,
		Availability: itemFull.Availability,
		Properties:   copyWhArray(itemFull.Properties),
		Runes:        copyWhArray(itemFull.Runes),
		Type:         itemFull.Type,
		Shared:       itemFull.Shared,
		Source:       copySourceMap(itemFull.Source),

		Melee:      itemFull.Melee.Copy(),
		Ranged:     itemFull.Ranged.Copy(),
		Ammunition: itemFull.Ammunition.Copy(),
		Armour:     itemFull.Armour.Copy(),
		Container:  itemFull.Container.Copy(),
		Grimoire:   itemFull.Grimoire.Copy(),
		Other:      itemFull.Other.Copy(),
	}
}

func (itemFull *ItemFull) InitNilPointers() error {
	if itemFull == nil {
		return errors.New("itemFull pointer is nil")
	}

	if itemFull.Properties == nil {
		itemFull.Properties = []*Wh{}
	}
	for _, v := range itemFull.Properties {
		err := v.InitNilPointers()
		if err != nil {
			return err
		}
	}

	if itemFull.Runes == nil {
		itemFull.Runes = []*Wh{}
	}
	for _, v := range itemFull.Runes {
		err := v.InitNilPointers()
		if err != nil {
			return err
		}
	}

	if itemFull.Source == nil {
		itemFull.Source = map[Source]string{}
	}

	if itemFull.Melee == nil {
		itemFull.Melee = &ItemMelee{}
	}

	if itemFull.Ranged == nil {
		itemFull.Ranged = &ItemRanged{}
	}

	if itemFull.Ammunition == nil {
		itemFull.Ammunition = &ItemAmmunition{}
	}

	if itemFull.Armour == nil {
		itemFull.Armour = &ItemArmour{}
	}
	err := itemFull.Armour.InitNilPointers()
	if err != nil {
		return err
	}

	if itemFull.Container == nil {
		itemFull.Container = &ItemContainer{}
	}

	if itemFull.Grimoire == nil {
		itemFull.Grimoire = &ItemGrimoireFull{}
	}
	err = itemFull.Grimoire.InitNilPointers()
	if err != nil {
		return err
	}

	if itemFull.Other == nil {
		itemFull.Other = &ItemOther{}
	}

	return nil
}

type ItemGrimoireFull struct {
	Spells []*Wh `json:"spells"`
}

func (itemGrimoireFull *ItemGrimoireFull) Copy() *ItemGrimoireFull {
	if itemGrimoireFull == nil {
		return nil
	}

	return &ItemGrimoireFull{
		Spells: copyWhArray(itemGrimoireFull.Spells),
	}
}

func (itemGrimoireFull *ItemGrimoireFull) InitNilPointers() error {
	if itemGrimoireFull == nil {
		return errors.New("itemGrimoireFull pointer is nil")
	}

	if itemGrimoireFull.Spells == nil {
		itemGrimoireFull.Spells = []*Wh{}
	}
	for _, v := range itemGrimoireFull.Spells {
		err := v.InitNilPointers()
		if err != nil {
			return err
		}
	}

	return nil
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
