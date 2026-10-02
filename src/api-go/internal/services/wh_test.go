package services

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"strings"
	"testing"

	"github.com/jmilosze/wfrp-hammergen-go/internal/dependencies/validator"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/jmilosze/wfrp-hammergen-go/test/mock_data"
)

func TestDeduplicate(t *testing.T) {
	tests := []struct {
		name   string
		slices [][]string
		want   []string
	}{
		{
			name:   "empty input",
			slices: [][]string{},
			want:   nil,
		},
		{
			name:   "all empty slices",
			slices: [][]string{{}, {}, {}},
			want:   nil,
		},
		{
			name:   "single slice with duplicates",
			slices: [][]string{{"a", "b", "a", "c", "b"}},
			want:   []string{"a", "b", "c"},
		},
		{
			name: "multiple slices with duplicates preserving first occurrence order",
			slices: [][]string{
				{"id-1", "id-2"},
				{"id-2", "id-3", "id-4"},
				{"id-1", "id-5"},
			},
			want: []string{"id-1", "id-2", "id-3", "id-4", "id-5"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := deduplicate(tt.slices...)
			if !reflect.DeepEqual(got, tt.want) && !(len(got) == 0 && len(tt.want) == 0) {
				t.Errorf("deduplicate() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIdNumbersToIds(t *testing.T) {
	items := []wh.IdNumber{
		{Id: "item-1", Number: 2},
		{Id: "item-2", Number: 1},
		{Id: "item-3", Number: 5},
	}

	want := []string{"item-1", "item-2", "item-3"}
	got := idNumbersToIds(items)

	if !reflect.DeepEqual(got, want) {
		t.Errorf("idNumbersToIds() = %v, want %v", got, want)
	}
}

func TestGetRequiresEditionWithFullOrCareerFilters(t *testing.T) {
	s := NewWhService(nil, nil)
	ctx := context.Background()
	claims := &auth.Claims{Id: "user1"}

	for name, tc := range map[string]struct {
		full   bool
		filter wh.WhFilter
	}{
		"full":     {full: true, filter: wh.WhFilter{}},
		"skillId":  {filter: wh.WhFilter{SkillIds: []string{"s1"}}},
		"talentId": {filter: wh.WhFilter{TalentIds: []string{"t1"}}},
	} {
		t.Run(name, func(t *testing.T) {
			_, err := s.Get(ctx, wh.WhTypeCareer, claims, tc.full, false, tc.filter)
			if !errors.Is(err, domain.ErrInvalidArguments) {
				t.Errorf("expected ErrInvalidArguments, got %v", err)
			}
		})
	}
}

type fakeWhDb struct {
	wh.WhDbService
	existing *wh.Wh
	updated  bool
}

func (f *fakeWhDb) Retrieve(_ context.Context, _ wh.WhType, _ []string, _ []string, _ wh.WhFilter) ([]*wh.Wh, error) {
	return []*wh.Wh{f.existing}, nil
}

func (f *fakeWhDb) Create(_ context.Context, _ wh.WhType, w *wh.Wh) (*wh.Wh, error) {
	return w, nil
}

func (f *fakeWhDb) Update(_ context.Context, _ wh.WhType, w *wh.Wh, _ string) (*wh.Wh, error) {
	f.updated = true
	return w, nil
}

// newMockCharacter returns a copy of a valid mock character with the given edition.
func newMockCharacter(e wh.Edition) *wh.Character {
	character := *mock_data.NewMockCharacter()[0].Object.(*wh.Character)
	character.Edition = e
	return &character
}

func newTestWhService(t *testing.T, db wh.WhDbService) *WhService {
	val, err := validator.NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	return NewWhService(val, db)
}

func TestUpdateCharacterEditionCannotChange(t *testing.T) {
	db := &fakeWhDb{existing: &wh.Wh{Id: "id1", OwnerId: "user1", Object: newMockCharacter(wh.Edition4e)}}
	s := newTestWhService(t, db)

	update := &wh.Wh{Id: "id1", Object: newMockCharacter(wh.Edition5e)}
	_, err := s.Update(context.Background(), wh.WhTypeCharacter, update, &auth.Claims{Id: "user1"})
	if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "cannot be changed") {
		t.Errorf("expected edition change error, got %v", err)
	}
	if db.updated {
		t.Error("expected character not to be updated")
	}

	update = &wh.Wh{Id: "id1", Object: newMockCharacter(wh.Edition4e)}
	if _, err = s.Update(context.Background(), wh.WhTypeCharacter, update, &auth.Claims{Id: "user1"}); err != nil {
		t.Fatalf("expected update with the same edition to succeed, got %v", err)
	}
	if !db.updated {
		t.Error("expected character to be updated")
	}
}

func TestCreateCharacterRequiresValidEdition(t *testing.T) {
	s := newTestWhService(t, nil)

	for _, e := range []wh.Edition{"", "6e"} {
		t.Run(string(e), func(t *testing.T) {
			_, err := s.Create(context.Background(), wh.WhTypeCharacter, &wh.Wh{Object: newMockCharacter(e)}, &auth.Claims{Id: "user1"})
			if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "Edition") {
				t.Errorf("expected edition validation error, got %v", err)
			}
		})
	}
}

// newMockCareer returns a copy of a valid mock career with the given income skill.
func newMockCareer(incomeSkill string) *wh.Career {
	career := *mock_data.NewMockCareers()[0].Object.(*wh.Career)
	career.IncomeSkill = incomeSkill
	return &career
}

func TestCreateCareerValidatesIncomeSkill(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	level1Skill := newMockCareer("").Level1.Skills[0]
	notInLevel1 := "eeeeeeeeeeeeeeeeeeeeeeee"

	for name, tc := range map[string]struct {
		editions map[wh.Edition]wh.WhObject
		wantErr  bool
	}{
		"4e without income skill":      {map[wh.Edition]wh.WhObject{wh.Edition4e: newMockCareer("")}, false},
		"4e with level 1 income skill": {map[wh.Edition]wh.WhObject{wh.Edition4e: newMockCareer(level1Skill)}, false},
		"4e income skill not in level": {map[wh.Edition]wh.WhObject{wh.Edition4e: newMockCareer(notInLevel1)}, true},
		"5e without income skill":      {map[wh.Edition]wh.WhObject{wh.Edition5e: newMockCareer("")}, false},
		"5e with level 1 income skill": {map[wh.Edition]wh.WhObject{wh.Edition5e: newMockCareer(level1Skill)}, false},
		"5e income skill not in level": {map[wh.Edition]wh.WhObject{wh.Edition5e: newMockCareer(notInLevel1)}, true},
		"invalid in one of two editions": {map[wh.Edition]wh.WhObject{
			wh.Edition4e: newMockCareer(""), wh.Edition5e: newMockCareer(notInLevel1),
		}, true},
	} {
		t.Run(name, func(t *testing.T) {
			_, err := s.Create(context.Background(), wh.WhTypeCareer, &wh.Wh{Editions: tc.editions}, &auth.Claims{Id: "user1"})
			if tc.wantErr && !errors.Is(err, domain.ErrInvalidArguments) {
				t.Errorf("expected ErrInvalidArguments, got %v", err)
			}
			if !tc.wantErr && err != nil {
				t.Errorf("expected no error, got %v", err)
			}
		})
	}
}

func TestCreateCareerValidatesSpeciesPerEdition(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	withGnome := newMockCareer("")
	withGnome.Species = []wh.CareerSpecies{wh.CareerSpeciesHuman, wh.CareerSpeciesGnome}

	_, err := s.Create(context.Background(), wh.WhTypeCareer, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition4e: withGnome}}, &auth.Claims{Id: "user1"})
	if err != nil {
		t.Errorf("4e: expected no error, got %v", err)
	}

	_, err = s.Create(context.Background(), wh.WhTypeCareer, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition5e: withGnome}}, &auth.Claims{Id: "user1"})
	if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "not available in 5e") {
		t.Errorf("5e: expected species error, got %v", err)
	}
}

func TestCreateTalentMaxRankLimit(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	newTalent := func(maxRank int) *wh.Talent {
		talent := *mock_data.NewMockTalents()[0].Object.(*wh.Talent)
		talent.Attribute, talent.Attribute2, talent.MaxRank, talent.Tests = wh.AttNone, wh.AttNone, maxRank, ""
		return &talent
	}

	for _, e := range wh.Editions {
		for maxRank, wantErr := range map[int]bool{999: false, 1000: true} {
			t.Run(fmt.Sprintf("%s %d", e, maxRank), func(t *testing.T) {
				_, err := s.Create(context.Background(), wh.WhTypeTalent, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{e: newTalent(maxRank)}}, &auth.Claims{Id: "user1"})
				if wantErr && !errors.Is(err, domain.ErrInvalidArguments) {
					t.Errorf("expected ErrInvalidArguments, got %v", err)
				}
				if !wantErr && err != nil {
					t.Errorf("expected no error, got %v", err)
				}
			})
		}
	}
}

func TestCreateTalentValidatesMaxRankPerEdition(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	withBonus := *mock_data.NewMockTalents()[0].Object.(*wh.Talent)
	withBonus.Tests = ""

	_, err := s.Create(context.Background(), wh.WhTypeTalent, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition4e: &withBonus}}, &auth.Claims{Id: "user1"})
	if err != nil {
		t.Errorf("4e: expected no error, got %v", err)
	}

	_, err = s.Create(context.Background(), wh.WhTypeTalent, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition5e: &withBonus}}, &auth.Claims{Id: "user1"})
	if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "characteristic-based max rank") {
		t.Errorf("5e: expected max rank error, got %v", err)
	}
}

func TestCreateTraitAndMutationValidateEffectsPerEdition(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	trait := *mock_data.NewMockTraits()[0].Object.(*wh.Trait)
	trait.Modifiers.Effects = []wh.EffectType{wh.EffectTypeSturdy}
	mutation := *mock_data.NewMockMutations()[0].Object.(*wh.Mutation)
	mutation.Modifiers.Effects = []wh.EffectType{wh.EffectTypeStrongBack}

	for typ, obj := range map[wh.WhType]wh.WhObject{wh.WhTypeTrait: &trait, wh.WhTypeMutation: &mutation} {
		t.Run(string(typ), func(t *testing.T) {
			_, err := s.Create(context.Background(), typ, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition5e: obj}}, &auth.Claims{Id: "user1"})
			if err != nil {
				t.Errorf("5e: expected no error, got %v", err)
			}
			_, err = s.Create(context.Background(), typ, &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition4e: obj}}, &auth.Claims{Id: "user1"})
			if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "not available in 4e") {
				t.Errorf("4e: expected effect error, got %v", err)
			}
		})
	}
}

func TestIdValuesToIds(t *testing.T) {
	items := []wh.IdValue{{Id: "trait-1", Value: "Elves"}, {Id: "trait-1", Value: "Dwarfs"}, {Id: "trait-2", Value: ""}}

	want := []string{"trait-1", "trait-1", "trait-2"}
	got := idValuesToIds(items)

	if !reflect.DeepEqual(got, want) {
		t.Errorf("idValuesToIds() = %v, want %v", got, want)
	}
}

func TestCreateValidatesValues(t *testing.T) {
	s := newTestWhService(t, &fakeWhDb{})
	propertyId := mock_data.NewMockProperties()[0].Id
	traitId := mock_data.NewMockTraits()[0].Id

	newItem := func(properties []wh.IdValue) *wh.Wh {
		item := *mock_data.NewMockItems()[0].Object.(*wh.Item)
		item.Properties = properties
		return &wh.Wh{Editions: map[wh.Edition]wh.WhObject{wh.Edition4e: &item}}
	}
	newCharacter := func(traits []wh.IdValue) *wh.Wh {
		character := newMockCharacter(wh.Edition4e)
		character.Traits = traits
		return &wh.Wh{Object: character}
	}

	for name, tc := range map[string]struct {
		typ     wh.WhType
		w       *wh.Wh
		wantErr bool
	}{
		"item property with value":       {wh.WhTypeItem, newItem([]wh.IdValue{{Id: propertyId, Value: "1d10"}}), false},
		"item property twice":            {wh.WhTypeItem, newItem([]wh.IdValue{{Id: propertyId, Value: "1"}, {Id: propertyId, Value: "2"}}), true},
		"item property value too long":   {wh.WhTypeItem, newItem([]wh.IdValue{{Id: propertyId, Value: strings.Repeat("a", 21)}}), true},
		"character trait twice":          {wh.WhTypeCharacter, newCharacter([]wh.IdValue{{Id: traitId, Value: "Elves"}, {Id: traitId, Value: "Dwarfs"}}), false},
		"character trait value too long": {wh.WhTypeCharacter, newCharacter([]wh.IdValue{{Id: traitId, Value: strings.Repeat("a", 21)}}), true},
		"character trait invalid id":     {wh.WhTypeCharacter, newCharacter([]wh.IdValue{{Id: "bad", Value: ""}}), true},
	} {
		t.Run(name, func(t *testing.T) {
			_, err := s.Create(context.Background(), tc.typ, tc.w, &auth.Claims{Id: "user1"})
			if tc.wantErr && !errors.Is(err, domain.ErrInvalidArguments) {
				t.Errorf("expected validation error, got %v", err)
			}
			if !tc.wantErr && err != nil {
				t.Errorf("expected no error, got %v", err)
			}
		})
	}
}
