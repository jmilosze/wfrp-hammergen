package mock_data

import (
	"context"
	"errors"
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"golang.org/x/crypto/bcrypt"
	"log/slog"
)

func seedUsers(ctx context.Context, db user.UserDbService, bcryptCost int, us []*user.User) {
	for _, u := range us {
		newUser := u.Copy()
		newUser.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), bcryptCost)
		if _, err := db.Create(ctx, newUser); err != nil {
			var dbErr *domain.DbError
			if errors.As(err, &dbErr) && dbErr.Type == domain.ErrorDbConflict {
				slog.Warn(fmt.Sprintf("seed user %s already exists, skipping", u.Username))
			}
		}
	}
}
func InitUser(ctx context.Context, db user.UserDbService, bcryptCost int) {
	seedUsers(ctx, db, bcryptCost, NewMockUsers())
}

func seedWh(ctx context.Context, db warhammer.WhDbService, t warhammer.WhType, whs []*warhammer.Wh) {
	for _, wh := range whs {
		if _, err := db.Create(ctx, t, wh.Copy()); err != nil {
			var dbErr *domain.DbError
			if errors.As(err, &dbErr) && dbErr.Type != domain.ErrorDbConflict {
				slog.Warn("seed wh already exists, skipping")
			}
		}
	}
}

func seedGenProps(ctx context.Context, db warhammer.WhDbService, genProps *warhammer.GenProps) {
	if _, err := db.CreateGenerationProps(ctx, genProps); err != nil {
		var dbErr *domain.DbError
		if errors.As(err, &dbErr) && dbErr.Type != domain.ErrorDbConflict {
			slog.Warn(fmt.Sprintf("seed genProps %s already exists, skipping", genProps.Name))
		}
	}
}

func InitWh(ctx context.Context, db warhammer.WhDbService) {
	seedWh(ctx, db, warhammer.WhTypeMutation, NewMockMutations())
	seedWh(ctx, db, warhammer.WhTypeSpell, NewMockSpells())
	seedWh(ctx, db, warhammer.WhTypePrayer, NewMockPrayers())
	seedWh(ctx, db, warhammer.WhTypeProperty, NewMockProperties())
	seedWh(ctx, db, warhammer.WhTypeItem, NewMockItems())
	seedWh(ctx, db, warhammer.WhTypeTalent, NewMockTalents())
	seedWh(ctx, db, warhammer.WhTypeSkill, NewMockSkills())
	seedWh(ctx, db, warhammer.WhTypeCareer, NewMockCareers())
	seedWh(ctx, db, warhammer.WhTypeCharacter, NewMockCharacter())
	seedWh(ctx, db, warhammer.WhTypeTrait, NewMockTraits())
	seedWh(ctx, db, warhammer.WhTypeRune, NewMockRunes())

	seedGenProps(ctx, db, NewMockGenProps())
}
