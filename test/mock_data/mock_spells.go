package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
)

var spell0 = domain.Wh{
	Id:      "200000000000000000000000",
	OwnerId: "admin",
	Object: domain.WhSpell{
		Name:        "spell 0",
		Description: "owned by admin",
		Cn:          1,
		Range:       "10",
		Target:      "2",
		Duration:    "5",
		Shared:      false,
	},
}

var spell1 = domain.Wh{
	Id:      "200000000000000000000001",
	OwnerId: "admin",
	Object: domain.WhSpell{
		Name:        "spell 1",
		Description: "owned by admin shared",
		Shared:      true,
	},
}

var spell2 = domain.Wh{
	Id:      "200000000000000000000002",
	OwnerId: user1.Id,
	Object: domain.WhSpell{
		Name:        "spell 2",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Shared:      false,
	},
}

func NewMockSpells() []*domain.Wh {
	return []*domain.Wh{&spell0, &spell1, &spell2}
}
