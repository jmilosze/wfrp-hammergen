package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var mutation0 = wh.Wh{
	Id:         "100000000000000000000000",
	OwnerId:    user0.Id,
	Visibility: wh.VisibilityPublic,
	Object: &wh.Mutation{
		Name:        "mutation 0",
		Description: fmt.Sprintf("owned by %s", user0.Username),
		Type:        wh.MutationTypeMental,
		Modifiers: &wh.Modifiers{
			Size:     1,
			Movement: 1,
			Attributes: &wh.Attributes{
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
			Effects: []wh.EffectType{wh.EffectTypeHardy},
		},
		Source: map[wh.Source]string{
			wh.SourceCustom: "a",
			wh.SourceWFRP:   "b",
		},
	},
}

var mutation1 = wh.Wh{
	Id:         "100000000000000000000001",
	OwnerId:    user0.Id,
	Visibility: wh.VisibilityPublic,
	Object: &wh.Mutation{
		Name:        "mutation 1",
		Description: fmt.Sprintf("owned by %s shared", user0.Username),
	},
}

var mutation2 = wh.Wh{
	Id:         "100000000000000000000002",
	OwnerId:    user1.Id,
	Visibility: wh.VisibilityPrivate,
	Object: &wh.Mutation{
		Name:        "mutation 2",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

var mutation3 = wh.Wh{
	Id:         "100000000000000000000003",
	OwnerId:    user1.Id,
	Visibility: wh.VisibilityShared,
	Object: &wh.Mutation{
		Name:        "mutation 3",
		Description: fmt.Sprintf("owned by %s shared", user1.Username),
	},
}

var mutation4 = wh.Wh{
	Id:         "100000000000000000000004",
	OwnerId:    user2.Id,
	Visibility: wh.VisibilityPrivate,
	Object: &wh.Mutation{
		Name:        "mutation 4",
		Description: fmt.Sprintf("owned by %s", user2.Username),
	},
}

var mutation5 = wh.Wh{
	Id:         "100000000000000000000005",
	OwnerId:    user2.Id,
	Visibility: wh.VisibilityShared,
	Object: &wh.Mutation{
		Name:        "mutation 5",
		Description: fmt.Sprintf("owned by %s shared", user2.Username),
	},
}

var mutation6 = wh.Wh{
	Id:         "100000000000000000000006",
	OwnerId:    user3.Id,
	Visibility: wh.VisibilityPrivate,
	Object: &wh.Mutation{
		Name:        "mutation 6",
		Description: fmt.Sprintf("owned by %s", user3.Username),
	},
}

var mutation7 = wh.Wh{
	Id:         "100000000000000000000007",
	OwnerId:    user4.Id,
	Visibility: wh.VisibilityShared,
	Object: &wh.Mutation{
		Name:        "mutation 7",
		Description: fmt.Sprintf("owned by %s shared", user4.Username),
	},
}

func NewMockMutations() []*wh.Wh {
	return []*wh.Wh{&mutation0, &mutation1, &mutation2, &mutation3, &mutation4, &mutation5, &mutation6, &mutation7}
}
