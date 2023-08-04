package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var advanced0 = wh.Wh{
	Id:      "600000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "advanced skill 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Attribute:   wh.AttWS,
		Type:        wh.SkillTypeAdvanced,
		IsGroup:     false,
		DisplayZero: true,
		Group:       []string{advanced1.Id},
		Shared:      false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var advanced1 = wh.Wh{
	Id:      "600000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "advanced skill 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		IsGroup:     true,
		Type:        wh.SkillTypeAdvanced,
	},
}

var basic0 = wh.Wh{
	Id:      "600000000000000000000002",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "basic skill 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		DisplayZero: true,
		Type:        wh.SkillTypeBasic,
	},
}

var basic1 = wh.Wh{
	Id:      "600000000000000000000003",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "basic skill 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		DisplayZero: true,
		Type:        wh.SkillTypeBasic,
	},
}

var basicNoDisplayZero = wh.Wh{
	Id:      "600000000000000000000004",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "basic no display zero",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		DisplayZero: false,
		Type:        wh.SkillTypeBasic,
	},
}

func NewMockSkills() []*wh.Wh {
	return []*wh.Wh{&advanced0, &advanced1, &basic0, &basic1, &basicNoDisplayZero}
}
