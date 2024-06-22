package mock_data

import (
	"context"
	"errors"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"golang.org/x/crypto/bcrypt"
	"log"
)

func seedUsers(ctx context.Context, db user.UserDbService, bcryptCost int, us []*user.User) {
	for _, u := range us {
		newUser := u.Copy()
		newUser.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), bcryptCost)
		if _, err := db.Create(ctx, newUser); err != nil {
			var dbErr *domain.DbError
			if errors.As(err, &dbErr) && dbErr.Type == domain.DbConflictError {
				log.Fatal(err)
			}
		}
	}
}
func InitUser(ctx context.Context, db user.UserDbService, bcryptCost int) {
	seedUsers(ctx, db, bcryptCost, NewMockUsers())

}

func seedWh(ctx context.Context, db warhammer.WhDbService, t warhammer.WhType, whs []*warhammer.Wh) {
	for _, wh := range whs {
		if _, dbErr := db.Create(ctx, t, wh.Copy()); dbErr != nil {
			if dbErr.Type != domain.DbConflictError {
				log.Fatal(dbErr)
			}
		}
	}
}

func seedGenProps(ctx context.Context, db warhammer.WhDbService, genProps *warhammer.GenProps) {
	if _, dbErr := db.CreateGenerationProps(ctx, genProps); dbErr != nil {
		if dbErr.Type != domain.DbConflictError {
			log.Fatal(dbErr)
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

	seedGenProps(ctx, db, NewMockGenProps())
}
