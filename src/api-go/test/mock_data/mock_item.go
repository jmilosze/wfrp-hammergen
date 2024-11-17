package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var itemMelee = wh.Wh{
	Id:      "400000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "melee item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2.31,
		Enc:          1.5,
		Availability: wh.ItemAvailabilityCommon,
		Properties:   []string{property0.Id, property1.Id},
		Runes:        []*wh.IdNumber{{Id: rune0.Id, Number: 1}, {Id: rune1.Id, Number: 2}},
		Type:         wh.ItemTypeMelee,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "g",
			wh.SourceUpInArms:                "f",
		},
		Melee: &wh.ItemMelee{
			Hands:     wh.ItemHandsOne,
			Dmg:       5,
			DmgSbMult: 1.0,
			Reach:     wh.ItemMeleeReachAverage,
			Group:     wh.ItemMeleeGroupBasic,
		},
	},
}

var itemRanged = wh.Wh{
	Id:      "400000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "ranged item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        5,
		Enc:          8,
		Availability: wh.ItemAvailabilityScarce,
		Properties:   []string{},
		Type:         wh.ItemTypeRanged,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceCustom: "",
		},
		Ranged: &wh.ItemRanged{
			Hands:     wh.ItemHandsOne,
			Dmg:       2,
			DmgSbMult: 2.0,
			Rng:       100,
			RngSbMult: 0,
			Group:     wh.RangedGroupCrossbow,
		},
	},
}

var itemAmmunition = wh.Wh{
	Id:      "400000000000000000000002",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "ammunition item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2.2,
		Enc:          0.1,
		Availability: wh.ItemAvailabilityRare,
		Properties:   []string{property0.Id},
		Type:         wh.ItemTypeAmmunition,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceWFRP: "g",
		},
		Ammunition: &wh.ItemAmmunition{
			Dmg:     1.0,
			Rng:     50,
			RngMult: 1.0,
			Group:   wh.ItemAmmunitionGroupBow,
		},
	},
}

var itemArmour = wh.Wh{
	Id:      "400000000000000000000003",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "armour item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2000,
		Enc:          2,
		Availability: wh.ItemAvailabilityExotic,
		Properties:   []string{property0.Id},
		Type:         wh.ItemTypeArmour,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceWFRP: "g",
		},
		Armour: &wh.ItemArmour{
			Points:   2,
			Location: []wh.ItemArmourLocation{wh.ItemArmourLocationBody, wh.ItemArmourLocationHead},
			Group:    wh.ItemArmourGroupMail,
		},
	},
}

var itemContainer = wh.Wh{
	Id:      "400000000000000000000004",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "container item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        20,
		Enc:          1,
		Availability: wh.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Type:         wh.ItemTypeContainer,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceWFRP: "g",
		},
		Container: &wh.ItemContainer{
			Capacity:  2,
			CarryType: wh.ItemCarryTypeCarriableAndWearable,
		},
	},
}

var itemGrimoire = wh.Wh{
	Id:      "400000000000000000000005",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "grimoire item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        20000,
		Enc:          0,
		Availability: wh.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Runes:        []*wh.IdNumber{{Id: rune0.Id, Number: 1}},
		Type:         wh.ItemTypeGrimoire,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceCustom: "",
		},
		Grimoire: &wh.ItemGrimoire{
			Spells: []string{spell0.Id, spell1.Id},
		},
	},
}

var itemOther = wh.Wh{
	Id:      "400000000000000000000006",
	OwnerId: user1.Id,
	Object: &wh.Item{
		Name:         "other item",
		Description:  fmt.Sprintf("owned by %s", user1.Username),
		Price:        2,
		Enc:          1,
		Availability: wh.ItemAvailabilityCommon,
		Properties:   []string{property0.Id},
		Type:         wh.ItemTypeOther,
		Shared:       true,
		Source: map[wh.Source]string{
			wh.SourceCustom: "",
		},
		Other: &wh.ItemOther{CarryType: wh.ItemCarryTypeNotCarriableAndNotWearable},
	},
}

func NewMockItems() []*wh.Wh {
	return []*wh.Wh{
		&itemMelee,
		&itemRanged,
		&itemAmmunition,
		&itemArmour,
		&itemContainer,
		&itemGrimoire,
		&itemOther,
	}
}
