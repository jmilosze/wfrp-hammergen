package warhammer

import "testing"

const (
	careerAId     = "aaaaaaaaaaaaaaaaaaaaaaaa"
	careerBId     = "bbbbbbbbbbbbbbbbbbbbbbbb"
	missingId     = "cccccccccccccccccccccccc"
	emptyCareerId = "000000000000000000000000"
)

func testCareers() []*Wh {
	return []*Wh{
		{Id: careerAId, Editions: map[Edition]WhObject{Edition4e: &Career{Name: "A"}}},
		{Id: careerBId, Editions: map[Edition]WhObject{Edition4e: &Career{Name: "B"}}},
	}
}

func TestIdNumberToWhNumber(t *testing.T) {
	careerMap := whListToIdWhMap(testCareers())

	got, err := idNumberToWhNumber(IdNumber{Id: careerBId, Number: 3}, careerMap)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if got.Wh.Id != careerBId || got.Number != 3 {
		t.Errorf("got id %s number %d, want id %s number 3", got.Wh.Id, got.Number, careerBId)
	}

	if _, err := idNumberToWhNumber(IdNumber{Id: missingId, Number: 1}, careerMap); err == nil {
		t.Error("expected error for missing id, got nil")
	}
}

func TestCharacterToFullMissingCareer(t *testing.T) {
	character := &Character{Edition: Edition4e, Career: &IdNumber{Id: missingId, Number: 2}}
	character.Init()

	// Repeat to make sure the result does not depend on map iteration order.
	for range 20 {
		full, err := character.ToFull([]*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, testCareers())
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if full.Career.Wh.Id != emptyCareerId {
			t.Fatalf("got career id %s, want %s", full.Career.Wh.Id, emptyCareerId)
		}
		if _, ok := full.Career.Wh.Editions[Edition4e].(*Career); !ok {
			t.Fatalf("got career editions %v, want an empty 4e career", full.Career.Wh.Editions)
		}
		if full.Career.Number != 1 {
			t.Fatalf("got career number %d, want 1", full.Career.Number)
		}
	}
}

func TestCharacterToFullWithoutCareer(t *testing.T) {
	character := &Character{Edition: Edition4e}
	character.Init()

	full, err := character.ToFull([]*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, testCareers())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if full.Career != nil {
		t.Fatalf("got career %v, want none", full.Career)
	}
}

func TestCharacterToFullKeepsTraitValues(t *testing.T) {
	traitId := "dddddddddddddddddddddddd"
	traits := []*Wh{{Id: traitId, Editions: map[Edition]WhObject{Edition4e: &Trait{Name: "Hatred", HasValue: true}}}}
	character := &Character{
		Edition: Edition4e,
		Career:  &IdNumber{Id: careerAId, Number: 1},
		Traits:  []IdValue{{Id: traitId, Value: "Elves"}, {Id: missingId, Value: "8"}, {Id: traitId, Value: "Dwarfs"}},
	}
	character.Init()

	full, err := character.ToFull([]*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, traits, testCareers())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(full.Traits) != 2 {
		t.Fatalf("got %d traits, want 2 (the missing trait is skipped)", len(full.Traits))
	}
	for i, want := range []string{"Elves", "Dwarfs"} {
		if full.Traits[i].Wh.Id != traitId || full.Traits[i].Value != want {
			t.Errorf("trait %d: got id %s value %q, want id %s value %q", i, full.Traits[i].Wh.Id, full.Traits[i].Value, traitId, want)
		}
	}
}

func TestCharacterToFullKeepsTrappingValues(t *testing.T) {
	itemId := "eeeeeeeeeeeeeeeeeeeeeeee"
	items := []*Wh{{Id: itemId, Editions: map[Edition]WhObject{Edition4e: &Item{Name: "Hand Weapon"}}}}
	character := &Character{
		Edition: Edition4e,
		Career:  &IdNumber{Id: careerAId, Number: 1},
		EquippedItems: []IdNumberValue{
			{Id: itemId, Number: 1},
			{Id: missingId, Number: 1, Value: "Axe"},
			{Id: itemId, Number: 2, Value: "Axe"},
		},
	}
	character.Init()

	full, err := character.ToFull(items, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, []*Wh{}, testCareers())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(full.EquippedItems) != 2 {
		t.Fatalf("got %d equipped trappings, want 2 (the missing item is skipped)", len(full.EquippedItems))
	}
	for i, want := range []WhNumberValue{{Number: 1, Value: ""}, {Number: 2, Value: "Axe"}} {
		got := full.EquippedItems[i]
		if got.Wh.Id != itemId || got.Number != want.Number || got.Value != want.Value {
			t.Errorf("trapping %d: got id %s number %d value %q, want id %s number %d value %q",
				i, got.Wh.Id, got.Number, got.Value, itemId, want.Number, want.Value)
		}
	}
}
