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
	character := &Character{Edition: Edition4e, Career: IdNumber{Id: missingId, Number: 2}}
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
