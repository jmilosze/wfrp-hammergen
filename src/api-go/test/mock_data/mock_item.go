package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var itemMelee = warhammer.Wh{
	Id:      "400000000000000000000000",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "melee item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       2.31,
		Enc:         1.5,
		Properties:  []string{property0.Id, property1.Id},
		Type:        warhammer.WhItemTypeMelee,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceArchivesOfTheEmpireVolI: "g",
			warhammer.WhSourceUpInArms:                "f",
		},

		Melee: warhammer.WhItemMelee{
			Hands:     warhammer.WhItemHandsOne,
			Dmg:       5,
			DmgSbMult: 1.0,
			Reach:     warhammer.WhItemMeleeReachAverage,
			Group:     warhammer.WhItemMeleeGroupBasic,
		},
	},
}

var itemRanged = warhammer.Wh{
	Id:      "400000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "ranged item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       5,
		Enc:         8,
		Type:        warhammer.WhItemTypeRanged,
		Shared:      true,

		Ranged: warhammer.WhItemRanged{
			Hands:     warhammer.WhItemHandsOne,
			Dmg:       2,
			DmgSbMult: 2.0,
			Rng:       100,
			RngSbMult: 0,
			Group:     warhammer.WhItemRangedGroupCrossbow,
		},
	},
}

var itemAmmunition = warhammer.Wh{
	Id:      "400000000000000000000002",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "ammunition item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       2.2,
		Enc:         0.1,
		Properties:  []string{property0.Id},
		Type:        warhammer.WhItemTypeAmmunition,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceWFRP: "g",
		},

		Ammunition: warhammer.WhItemAmmunition{
			Dmg:     1.0,
			Rng:     50,
			RngMult: 1.0,
			Group:   warhammer.WhItemAmmunitionGroupBow,
		},
	},
}

var itemArmour = warhammer.Wh{
	Id:      "400000000000000000000003",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "armour item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       2000,
		Enc:         2,
		Properties:  []string{property0.Id},
		Type:        warhammer.WhItemTypeArmour,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceWFRP: "g",
		},

		Armour: warhammer.WhItemArmour{
			Points:   2,
			Location: warhammer.WhItemArmourLocationBody,
			Group:    warhammer.WhItemArmourGroupMail,
		},
	},
}

var itemContainer = warhammer.Wh{
	Id:      "400000000000000000000004",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "container item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       20,
		Enc:         1,
		Properties:  []string{property0.Id},
		Type:        warhammer.WhItemTypeContainer,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceWFRP: "g",
		},

		Container: warhammer.WhItemContainer{
			Capacity:  2,
			CarryType: warhammer.WhItemCarryTypeCarriableAndWearable,
		},
	},
}

var itemGrimoire = warhammer.Wh{
	Id:      "400000000000000000000005",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "grimoire item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       20000,
		Enc:         0,
		Properties:  []string{property0.Id},
		Type:        warhammer.WhItemTypeGrimoire,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceCustom: "",
		},

		Grimoire: warhammer.WhItemGrimoire{
			Spells: []string{spell0.Id, spell1.Id},
		},
	},
}

var itemOther = warhammer.Wh{
	Id:      "400000000000000000000006",
	OwnerId: user1.Id,
	Object: warhammer.WhItem{
		Name:        "other item",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Price:       2,
		Enc:         1,
		Properties:  []string{property0.Id},
		Type:        warhammer.WhItemTypeOther,
		Shared:      true,
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceCustom: "",
		},

		Other: warhammer.WhItemOther{CarryType: warhammer.WhItemCarryTypeNotCarriableAndNotWearable},
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
