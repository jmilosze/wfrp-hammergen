package mock_data

import (
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var skill0 = warhammer.Wh{
	Id:      "600000000000000000000000",
	OwnerId: user1.Id,
	Object: warhammer.Skill{
		Name:        "skill 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Attribute:   warhammer.AttWS,
		Type:        warhammer.SkillTypeAdvanced,
		IsGroup:     false,
		DisplayZero: true,
		Group:       []string{skill1.Id},
		Shared:      false,
		Source: map[warhammer.Source]string{
			warhammer.SourceArchivesOfTheEmpireVolI: "d",
			warhammer.SourceSeaOfClaws:              "e",
		},
	},
}

var skill1 = warhammer.Wh{
	Id:      "600000000000000000000001",
	OwnerId: user1.Id,
	Object: warhammer.Skill{
		Name:        "skill 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockSkills() []*warhammer.Wh {
	return []*warhammer.Wh{&skill0, &skill1}
}
