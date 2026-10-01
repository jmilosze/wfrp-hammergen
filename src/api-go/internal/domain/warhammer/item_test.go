package warhammer

import "testing"

func TestItemValidateEditionGroups(t *testing.T) {
	melee := func(g ItemMeleeGroup) Item { return Item{Type: ItemTypeMelee, Melee: ItemMelee{Group: g}} }
	armour := func(g ItemArmourGroup) Item { return Item{Type: ItemTypeArmour, Armour: ItemArmour{Group: g}} }

	for name, tc := range map[string]struct {
		edition Edition
		item    Item
		wantErr bool
	}{
		"4e parry":                     {Edition4e, melee(ItemMeleeGroupParry), false},
		"5e parry":                     {Edition5e, melee(ItemMeleeGroupParry), true},
		"5e engineering":               {Edition5e, melee(ItemMeleeGroupEngineering), true},
		"5e fencing":                   {Edition5e, melee(ItemMeleeGroupFencing), false},
		"4e soft leather":              {Edition4e, armour(ItemArmourGroupSoftLeather), false},
		"4e shield group":              {Edition4e, armour(ItemArmourGroupShield), true},
		"4e leather group":             {Edition4e, armour(ItemArmourGroupLeather), true},
		"5e shield":                    {Edition5e, armour(ItemArmourGroupShield), false},
		"5e leather":                   {Edition5e, armour(ItemArmourGroupLeather), false},
		"5e brigandine":                {Edition5e, armour(ItemArmourGroupBrigandine), true},
		"5e other item ignores groups": {Edition5e, Item{Type: ItemTypeOther, Melee: ItemMelee{Group: ItemMeleeGroupParry}}, false},
	} {
		t.Run(name, func(t *testing.T) {
			if err := tc.item.ValidateEdition(tc.edition); (err != nil) != tc.wantErr {
				t.Errorf("got error %v, want error %v", err, tc.wantErr)
			}
		})
	}
}
