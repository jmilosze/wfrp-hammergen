package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var character0 = warhammer.Wh{
	Id:      "800000000000000000000000",
	OwnerId: user1.Id,
	Object: warhammer.WhCharacter{
		Name:        "character 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Notes:       "some notes",
		EquippedItems: []warhammer.IdNumber{
			{Id: itemArmour.Id, Number: 1},
			{Id: itemMelee.Id, Number: 2},
		},
		CarriedItems: []warhammer.IdNumber{
			{Id: itemRanged.Id, Number: 1},
			{Id: itemArmour.Id, Number: 1},
			{Id: itemAmmunition.Id, Number: 200},
		},
		StoredItems: []warhammer.IdNumber{
			{Id: itemGrimoire.Id, Number: 1},
			{Id: itemOther.Id, Number: 100},
		},
		Skills: []warhammer.IdNumber{
			{Id: skill0.Id, Number: 1},
			{Id: skill1.Id, Number: 10},
		},
		Talents: []warhammer.IdNumber{
			{Id: talent0.Id, Number: 1},
			{Id: talent1.Id, Number: 5},
		},
		Species: warhammer.WhCharacterSpeciesHalflingBrandysnap,
		BaseAttributes: warhammer.WhAttributes{
			WS:  1,
			BS:  2,
			S:   3,
			T:   4,
			I:   5,
			Ag:  6,
			Dex: 7,
			Int: 8,
			WP:  9,
			Fel: 10,
		},
		AttributeAdvances: warhammer.WhAttributes{
			WS:  10,
			BS:  9,
			S:   8,
			T:   7,
			I:   6,
			Ag:  5,
			Dex: 4,
			Int: 3,
			WP:  2,
			Fel: 1,
		},
		CareerPath: []string{career0.Id},
		Career:     career1.Id,
		Fate:       2,
		Fortune:    1,
		Resilience: 3,
		Resolve:    1,
		CurrentExp: 100,
		SpentExp:   1500,
		Status:     warhammer.WhStatusSilver,
		Standing:   warhammer.WhStandingOne,
		Brass:      100,
		Silver:     15,
		Gold:       1,
		Spells:     []string{spell0.Id, spell1.Id},
		Sin:        0,
		Corruption: 0,
		Mutations:  []string{mutation0.Id, mutation1.Id},
		Shared:     false,
	},
}

var character1 = warhammer.Wh{
	Id:      "800000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.WhCharacter{
		Name:        "character 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Species:     warhammer.WhCharacterSpeciesDwarfAltdorf,
		Career:      career0.Id,
	},
}

func NewMockCharacter() []*warhammer.Wh {
	return []*warhammer.Wh{&character0, &character1}
}
