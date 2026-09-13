package services

import (
	"reflect"
	"testing"

	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
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
