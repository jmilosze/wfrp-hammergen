package services

import (
	"context"
	"errors"
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

func (f *fakeWhDb) Update(_ context.Context, _ wh.WhType, w *wh.Wh, _ string) (*wh.Wh, error) {
	f.updated = true
	return w, nil
}

func TestUpdateCharacterEditionCannotChange(t *testing.T) {
	db := &fakeWhDb{existing: &wh.Wh{Id: "id1", OwnerId: "user1", Edition: wh.Edition4e, Object: &wh.Character{}}}
	val, err := validator.NewValidator()
	if err != nil {
		t.Fatal(err)
	}
	s := NewWhService(val, db)
	update := &wh.Wh{Id: "id1", Edition: wh.Edition5e, Object: mock_data.NewMockCharacter()[0].Object}

	_, err = s.Update(context.Background(), wh.WhTypeCharacter, update, &auth.Claims{Id: "user1"})
	if !errors.Is(err, domain.ErrInvalidArguments) || !strings.Contains(err.Error(), "cannot be changed") {
		t.Errorf("expected edition change error, got %v", err)
	}
	if db.updated {
		t.Error("expected character not to be updated")
	}

	update.Edition = wh.Edition4e
	if _, err = s.Update(context.Background(), wh.WhTypeCharacter, update, &auth.Claims{Id: "user1"}); err != nil {
		t.Fatalf("expected update with the same edition to succeed, got %v", err)
	}
	if !db.updated {
		t.Error("expected character to be updated")
	}
}
