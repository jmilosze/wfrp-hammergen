package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var mutation0 = wh.Wh{
	Id:      "100000000000000000000000",
	OwnerId: "admin",
	Object: &wh.Mutation{
		Name:        "mutation 0",
		Description: "owned by admin",
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
		},
		Shared: false,
		Source: map[wh.Source]string{
			wh.SourceCustom: "a",
			wh.SourceWFRP:   "b",
		},
	},
}

var mutation1 = wh.Wh{
	Id:      "100000000000000000000001",
	OwnerId: "admin",
	Object: &wh.Mutation{
		Name:        "mutation 1",
		Description: "owned by admin shared",
		Shared:      true,
	},
}

var mutation2 = wh.Wh{
	Id:      "100000000000000000000002",
	OwnerId: user1.Id,
	Object: &wh.Mutation{
		Name:        "mutation 2",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Shared:      false,
	},
}

var mutation3 = wh.Wh{
	Id:      "100000000000000000000003",
	OwnerId: user1.Id,
	Object: &wh.Mutation{
		Name:        "mutation 3",
		Description: fmt.Sprintf("owned by %s shared", user1.Username),
		Shared:      true,
	},
}

var mutation4 = wh.Wh{
	Id:      "100000000000000000000004",
	OwnerId: user2.Id,
	Object: &wh.Mutation{
		Name:        "mutation 4",
		Description: fmt.Sprintf("owned by %s", user2.Username),
		Shared:      false,
	},
}

var mutation5 = wh.Wh{
	Id:      "100000000000000000000005",
	OwnerId: user2.Id,
	Object: &wh.Mutation{
		Name:        "mutation 5",
		Description: fmt.Sprintf("owned by %s shared", user2.Username),
		Shared:      true,
	},
}

var mutation6 = wh.Wh{
	Id:      "100000000000000000000006",
	OwnerId: user3.Id,
	Object: &wh.Mutation{
		Name:        "mutation 6",
		Description: fmt.Sprintf("owned by %s", user3.Username),
		Shared:      false,
	},
}

var mutation7 = wh.Wh{
	Id:      "100000000000000000000007",
	OwnerId: user4.Id,
	Object: &wh.Mutation{
		Name:        "mutation 7",
		Description: fmt.Sprintf("owned by %s shared", user4.Username),
		Shared:      true,
	},
}

func NewMockMutations() []*wh.Wh {
	return []*wh.Wh{&mutation0, &mutation1, &mutation2, &mutation3, &mutation4, &mutation5, &mutation6, &mutation7}
}
