package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var itemMelee = warhammer.Wh{
	Id:      "400000000000000000000000",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "melee item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2.31,
		Enc:          1.5,
		Availability: warhammer.ItemAvailabilityCommon,
		Properties:   []string{property0.Id, property1.Id},
		Type:         warhammer.ItemTypeMelee,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceArchivesOfTheEmpireVolI: "g",
			warhammer.SourceUpInArms:                "f",
		},

		Melee: &warhammer.ItemMelee{
			Hands:     warhammer.ItemHandsOne,
			Dmg:       5,
			DmgSbMult: 1.0,
			Reach:     warhammer.ItemMeleeReachAverage,
			Group:     warhammer.ItemMeleeGroupBasic,
		},
	},
}

var itemRanged = warhammer.Wh{
	Id:      "400000000000000000000001",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "ranged item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        5,
		Enc:          8,
		Availability: warhammer.ItemAvailabilityScarce,
		Type:         warhammer.ItemTypeRanged,
		Shared:       true,

		Ranged: &warhammer.ItemRanged{
			Hands:     warhammer.ItemHandsOne,
			Dmg:       2,
			DmgSbMult: 2.0,
			Rng:       100,
			RngSbMult: 0,
			Group:     warhammer.RangedGroupCrossbow,
		},
	},
}

var itemAmmunition = warhammer.Wh{
	Id:      "400000000000000000000002",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "ammunition item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2.2,
		Enc:          0.1,
		Availability: warhammer.ItemAvailabilityRare,
		Properties:   []string{property0.Id},
		Type:         warhammer.ItemTypeAmmunition,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceWFRP: "g",
		},

		Ammunition: &warhammer.ItemAmmunition{
			Dmg:     1.0,
			Rng:     50,
			RngMult: 1.0,
			Group:   warhammer.ItemAmmunitionGroupBow,
		},
	},
}

var itemArmour = warhammer.Wh{
	Id:      "400000000000000000000003",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "armour item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2000,
		Enc:          2,
		Availability: warhammer.ItemAvailabilityExotic,
		Properties:   []string{property0.Id},
		Type:         warhammer.ItemTypeArmour,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceWFRP: "g",
		},

		Armour: &warhammer.ItemArmour{
			Points:   2,
			Location: []warhammer.ItemArmourLocation{warhammer.ItemArmourLocationBody, warhammer.ItemArmourLocationHead},
			Group:    warhammer.ItemArmourGroupMail,
		},
	},
}

var itemContainer = warhammer.Wh{
	Id:      "400000000000000000000004",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "container item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        20,
		Enc:          1,
		Availability: warhammer.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Type:         warhammer.ItemTypeContainer,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceWFRP: "g",
		},

		Container: &warhammer.ItemContainer{
			Capacity:  2,
			CarryType: warhammer.ItemCarryTypeCarriableAndWearable,
		},
	},
}

var itemGrimoire = warhammer.Wh{
	Id:      "400000000000000000000005",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "grimoire item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        20000,
		Enc:          0,
		Availability: warhammer.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Type:         warhammer.ItemTypeGrimoire,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceCustom: "",
		},

		Grimoire: &warhammer.ItemGrimoire{
			Spells: []string{spell0.Id, spell1.Id},
		},
	},
}

var itemOther = warhammer.Wh{
	Id:      "400000000000000000000006",
	OwnerId: user1.Id,
	Object: &warhammer.Item{
		Name:         "other item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2,
		Enc:          1,
		Availability: warhammer.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Type:         warhammer.ItemTypeOther,
		Shared:       true,
		Source: map[warhammer.Source]string{
			warhammer.SourceCustom: "",
		},

		Other: &warhammer.ItemOther{CarryType: warhammer.ItemCarryTypeNotCarriableAndNotWearable},
	},
}

func NewMockItems() []*warhammer.Wh {
	return []*warhammer.Wh{
		&itemMelee,
		&itemRanged,
		&itemAmmunition,
		&itemArmour,
		&itemContainer,
		&itemGrimoire,
		&itemOther,
	}
}
