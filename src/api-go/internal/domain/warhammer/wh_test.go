package warhammer_test

import (
	"encoding/json"
	"testing"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewWhObjectDefaults(t *testing.T) {
	for _, whType := range warhammer.WhCoreTypes {
		obj := warhammer.NewWhObject(whType)
		require.NotNil(t, obj)

		data, err := json.Marshal(obj)
		require.NoError(t, err)

		// Assert that none of the core objects serialize slice fields as null
		var raw map[string]any
		err = json.Unmarshal(data, &raw)
		require.NoError(t, err)

		for k, v := range raw {
			assert.NotNilf(t, v, "field %s in %s should not be null", k, whType)
		}
	}
}

func TestCharacterToFull(t *testing.T) {
	char := &warhammer.Character{
		Name: "Test Char",
		EquippedItems: []warhammer.IdNumber{
			{Id: "item1", Number: 1},
		},
		Career: warhammer.IdNumber{Id: "career1", Number: 2},
		BaseAttributes: warhammer.Attributes{
			WS: 30,
			BS: 35,
		},
	}

	itemWh := &warhammer.Wh{
		Id: "item1",
		Object: &warhammer.Item{
			Name: "Test Sword",
			Type: warhammer.ItemTypeMelee,
		},
	}
	careerWh := &warhammer.Wh{
		Id: "career1",
		Object: &warhammer.Career{
			Name: "Soldier",
		},
	}

	full, err := char.ToFull(
		[]*warhammer.Wh{itemWh},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{},
		[]*warhammer.Wh{careerWh},
	)
	require.NoError(t, err)
	require.NotNil(t, full)
	assert.Equal(t, "Test Char", full.Name)
	assert.Equal(t, 30, full.BaseAttributes.WS)
	assert.Equal(t, 35, full.BaseAttributes.BS)
	require.Len(t, full.EquippedItems, 1)
	assert.Equal(t, "item1", full.EquippedItems[0].Wh.Id)
	assert.Equal(t, 1, full.EquippedItems[0].Number)
	assert.Equal(t, "career1", full.Career.Wh.Id)
	assert.Equal(t, 2, full.Career.Number)
}

func TestItemToFull(t *testing.T) {
	item := &warhammer.Item{
		Name:       "Magic Grimoire",
		Type:       warhammer.ItemTypeGrimoire,
		Grimoire:   warhammer.ItemGrimoire{Spells: []string{"spell1"}},
		Properties: []string{"prop1"},
		Runes:      []warhammer.IdNumber{{Id: "rune1", Number: 1}},
	}

	propWh := &warhammer.Wh{Id: "prop1", Object: &warhammer.Property{Name: "Durable"}}
	spellWh := &warhammer.Wh{Id: "spell1", Object: &warhammer.Spell{Name: "Fireball"}}
	runeWh := &warhammer.Wh{Id: "rune1", Object: &warhammer.Rune{Name: "Rune of Fire"}}

	full, err := item.ToFull(
		[]*warhammer.Wh{propWh},
		[]*warhammer.Wh{spellWh},
		[]*warhammer.Wh{runeWh},
	)
	require.NoError(t, err)
	require.NotNil(t, full)
	assert.Equal(t, "Magic Grimoire", full.Name)
	require.Len(t, full.Properties, 1)
	assert.Equal(t, "prop1", full.Properties[0].Id)
	require.Len(t, full.Runes, 1)
	assert.Equal(t, "rune1", full.Runes[0].Wh.Id)
	assert.Equal(t, 1, full.Runes[0].Number)
	require.Len(t, full.Grimoire.Spells, 1)
	assert.Equal(t, "spell1", full.Grimoire.Spells[0].Id)
}
