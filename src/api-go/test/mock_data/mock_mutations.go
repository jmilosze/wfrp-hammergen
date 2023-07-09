package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var mutation0 = warhammer.Wh{
	Id:      "100000000000000000000000",
	OwnerId: "admin",
	Object: warhammer.WhMutation{
		Name:        "mutation 0",
		Description: "owned by admin",
		Type:        warhammer.WhMutationTypeMental,
		Modifiers: warhammer.WhModifiers{
			Size:     1,
			Movement: 1,
			Attributes: warhammer.WhAttributes{
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
		Source: map[warhammer.WhSource]string{
			warhammer.WhSourceCustom: "a",
			warhammer.WhSourceWFRP:   "b",
		},
	},
}

var mutation1 = warhammer.Wh{
	Id:      "100000000000000000000001",
	OwnerId: "admin",
	Object: warhammer.WhMutation{
		Name:        "mutation 1",
		Description: "owned by admin shared",
		Shared:      true,
	},
}

var mutation2 = warhammer.Wh{
	Id:      "100000000000000000000002",
	OwnerId: user1.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 2",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Shared:      false,
	},
}

var mutation3 = warhammer.Wh{
	Id:      "100000000000000000000003",
	OwnerId: user1.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 3",
		Description: fmt.Sprintf("owned by %s shared", user1.Username),
		Shared:      true,
	},
}

var mutation4 = warhammer.Wh{
	Id:      "100000000000000000000004",
	OwnerId: user2.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 4",
		Description: fmt.Sprintf("owned by %s", user2.Username),
		Shared:      false,
	},
}

var mutation5 = warhammer.Wh{
	Id:      "100000000000000000000005",
	OwnerId: user2.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 5",
		Description: fmt.Sprintf("owned by %s shared", user2.Username),
		Shared:      true,
	},
}

var mutation6 = warhammer.Wh{
	Id:      "100000000000000000000006",
	OwnerId: user3.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 6",
		Description: fmt.Sprintf("owned by %s", user3.Username),
		Shared:      false,
	},
}

var mutation7 = warhammer.Wh{
	Id:      "100000000000000000000007",
	OwnerId: user4.Id,
	Object: warhammer.WhMutation{
		Name:        "mutation 7",
		Description: fmt.Sprintf("owned by %s shared", user4.Username),
		Shared:      true,
	},
}

func NewMockMutations() []*warhammer.Wh {
	return []*warhammer.Wh{&mutation0, &mutation1, &mutation2, &mutation3, &mutation4, &mutation5, &mutation6, &mutation7}
}
