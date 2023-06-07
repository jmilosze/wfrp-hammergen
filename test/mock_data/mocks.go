package mock_data

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
)

type CanSeedUsers interface {
	SeedUsers(ctx context.Context, us []*user.User)
}

func InitUser(ctx context.Context, s CanSeedUsers) {
	s.SeedUsers(ctx, NewMockUsers())

}

type CanSeedWh interface {
	SeedWh(ctx context.Context, t warhammer.WhType, whs []*warhammer.Wh)
}

func InitWh(ctx context.Context, s CanSeedWh) {
	s.SeedWh(ctx, warhammer.WhTypeMutation, NewMockMutations())
	s.SeedWh(ctx, warhammer.WhTypeSpell, NewMockSpells())
	s.SeedWh(ctx, warhammer.WhTypeProperty, NewMockProperties())
	s.SeedWh(ctx, warhammer.WhTypeItem, NewMockItems())
	s.SeedWh(ctx, warhammer.WhTypeTalent, NewMockTalents())
	s.SeedWh(ctx, warhammer.WhTypeSkill, NewMockSkills())
}
