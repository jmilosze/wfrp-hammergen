package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var character0 = wh.Wh{
	Id:      "800000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Character{
		Name:        "character 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Notes:       "some notes",
		EquippedItems: []*wh.IdNumber{
			{Id: itemArmour.Id, Number: 1},
			{Id: itemMelee.Id, Number: 2},
		},
		CarriedItems: []*wh.IdNumber{
			{Id: itemRanged.Id, Number: 1},
			{Id: itemArmour.Id, Number: 1},
			{Id: itemAmmunition.Id, Number: 200},
		},
		StoredItems: []*wh.IdNumber{
			{Id: itemGrimoire.Id, Number: 1},
			{Id: itemOther.Id, Number: 100},
		},
		Skills: []*wh.IdNumber{
			{Id: skill0.Id, Number: 1},
			{Id: skill1.Id, Number: 10},
		},
		Talents: []*wh.IdNumber{
			{Id: talent0.Id, Number: 1},
			{Id: talent1.Id, Number: 5},
		},
		Species: wh.CharacterSpeciesHalflingBrandysnap,
		BaseAttributes: &wh.Attributes{
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
		AttributeAdvances: &wh.Attributes{
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
		Status:     wh.StatusSilver,
		Standing:   wh.StandingOne,
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

var character1 = wh.Wh{
	Id:      "800000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Character{
		Name:              "character 1",
		Description:       fmt.Sprintf("owned by %s", user1.Username),
		Species:           wh.CharacterSpeciesDwarfAltdorf,
		Career:            career0.Id,
		EquippedItems:     []*wh.IdNumber{},
		CarriedItems:      []*wh.IdNumber{},
		StoredItems:       []*wh.IdNumber{},
		Skills:            []*wh.IdNumber{},
		Talents:           []*wh.IdNumber{},
		BaseAttributes:    wh.NewAttributes(),
		AttributeAdvances: wh.NewAttributes(),
		CareerPath:        []string{},
		Spells:            []string{},
		Mutations:         []string{},
	},
}

func NewMockCharacter() []*wh.Wh {
	return []*wh.Wh{&character0, &character1}
}
