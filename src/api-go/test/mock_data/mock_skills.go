package mock_data

import (
	"fmt"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

var skill0 = wh.Wh{
	Id:      "600000000000000000000000",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "skill 0",
		Description: fmt.Sprintf("owned by %s", user1.Username),
		Attribute:   wh.AttWS,
		Type:        wh.SkillTypeAdvanced,
		IsGroup:     false,
		DisplayZero: true,
		Group:       []string{skill1.Id},
		Shared:      false,
		Source: map[wh.Source]string{
			wh.SourceArchivesOfTheEmpireVolI: "d",
			wh.SourceSeaOfClaws:              "e",
		},
	},
}

var skill1 = wh.Wh{
	Id:      "600000000000000000000001",
	OwnerId: user1.Id,
	Object: &wh.Skill{
		Name:        "skill 1",
		Description: fmt.Sprintf("owned by %s", user1.Username),
	},
}

func NewMockSkills() []*wh.Wh {
	return []*wh.Wh{&skill0, &skill1}
}
