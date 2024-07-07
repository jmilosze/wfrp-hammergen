package services

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/rs/xid"
	"golang.org/x/exp/slices"
	"sync"
)

type WhService struct {
	Validator   *validator.Validate
	WhDbService wh.WhDbService
}

func NewWhService(v *validator.Validate, db wh.WhDbService) *WhService {
	return &WhService{Validator: v, WhDbService: db}
}

func (s *WhService) Create(ctx context.Context, t wh.WhType, w *wh.Wh, c *auth.Claims) (*wh.Wh, error) {
	if c.Id == "anonymous" {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorUnauthorized, Err: fmt.Errorf("unauthorized to create wh")}
	}

	newWh := w.Copy()
	if err := newWh.InitNilPointers(); err != nil {
		return nil, fmt.Errorf("failed to nil pointers: %w", err)
	}

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorInvalidArguments, Err: err}
	}

	if err := extraCharacterValidation(t, newWh, s.Validator); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorInvalidArguments, Err: err}
	}

	if c.Admin {
		newWh.OwnerId = "admin"
	} else {
		newWh.OwnerId = c.Id
	}
	newWh.Id = hex.EncodeToString(xid.New().Bytes())

	createdWh, err := s.WhDbService.Create(ctx, t, newWh)
	if err != nil {
		return nil, fmt.Errorf("failed to create wh: %w", err)
	}

	createdWh.CanEdit = canEdit(createdWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return createdWh.Copy(), nil
}

func extraCharacterValidation(t wh.WhType, newWh *wh.Wh, validator *validator.Validate) error {
	if t == wh.WhTypeCharacter {
		char := newWh.Object.(*wh.Character)
		err := validator.Var(char.Career.Number, "gte=1,lte=4")
		if err != nil {
			return err
		}
		for _, v := range char.CareerPath {
			err := validator.Var(v.Number, "gte=1,lte=4")
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func canEdit(ownerId string, isAdmin bool, userId string, sharedAccounts []string) bool {
	if (ownerId != userId) && slices.Contains(sharedAccounts, ownerId) {
		return false
	}

	if isAdmin {
		return true
	}

	if ownerId == userId {
		return true
	}

	return false
}

func (s *WhService) Update(ctx context.Context, t wh.WhType, w *wh.Wh, c *auth.Claims) (*wh.Wh, error) {
	if c.Id == "anonymous" {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorUnauthorized, Err: fmt.Errorf("unauthorized to update wh %s", w.Id)}
	}

	newWh := w.Copy()
	if err := newWh.InitNilPointers(); err != nil {
		return nil, fmt.Errorf("failed to initialize nil pointers: %w", err)
	}

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorInvalidArguments, Err: err}
	}

	if err := extraCharacterValidation(t, newWh, s.Validator); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.ErrorInvalidArguments, Err: err}
	}

	ownerId := c.Id
	if c.Admin {
		ownerId = "admin"
	}

	newWh.OwnerId = ownerId
	updatedWh, err := s.WhDbService.Update(ctx, t, newWh, ownerId)
	if err != nil {
		var dbErr *domain.DbError
		wErr := fmt.Errorf("failed to update wh: %w", err)
		if errors.As(err, &dbErr) && dbErr.Type == domain.ErrorDbNotFound {
			return nil, &wh.WhError{ErrType: wh.ErrorNotFound, WhType: t, Err: wErr}
		} else {
			return nil, wErr
		}
	}

	updatedWh.CanEdit = canEdit(updatedWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return updatedWh.Copy(), nil
}

func (s *WhService) Delete(ctx context.Context, t wh.WhType, whId string, c *auth.Claims) error {
	if c.Id == "anonymous" {
		return &wh.WhError{ErrType: wh.ErrorUnauthorized, WhType: t, Err: fmt.Errorf("unauthorized to delete wh %s", whId)}
	}

	ownerId := c.Id
	if c.Admin {
		ownerId = "admin"
	}

	err := s.WhDbService.Delete(ctx, t, whId, ownerId)
	if err != nil {
		return fmt.Errorf("failed to delete wh: %w", err)
	}

	return nil
}

func (s *WhService) Get(ctx context.Context, t wh.WhType, c *auth.Claims, full bool, errIfNotFound bool, whIds []string) ([]*wh.Wh, error) {
	users := []string{"admin", c.Id}

	whs, err := s.WhDbService.Retrieve(ctx, t, users, c.SharedAccounts, whIds)
	if err != nil {
		return nil, fmt.Errorf("failed to retreive wh: %w", err)
	}

	whsRet := make([]*wh.Wh, 0)
	for _, v := range whs {
		err := v.InitNilPointers()
		if err != nil {
			return nil, fmt.Errorf("failed to initialize nil pointers: %w", err)
		}
		v.CanEdit = canEdit(v.OwnerId, c.Admin, c.Id, c.SharedAccounts)
		whsRet = append(whsRet, v)
	}

	if full {
		var whErr error
		if t == wh.WhTypeItem {
			whsRet, whErr = retrieveFullItems(ctx, s, c, whsRet)
		} else if t == wh.WhTypeCharacter {
			whsRet, whErr = retrieveFullCharacters(ctx, s, c, whsRet)
		}
		if whErr != nil {
			return nil, whErr
		}
	}

	if errIfNotFound && len(whIds) != 0 && len(whsRet) != len(whIds) {
		return nil, &wh.WhError{ErrType: wh.ErrorNotFound, WhType: t, Err: fmt.Errorf("not all ids found")}
	}

	return whsRet, nil
}

func retrieveFullItems(ctx context.Context, whService *WhService, claims *auth.Claims, items []*wh.Wh) ([]*wh.Wh, error) {
	allPropertyIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	for _, v := range items {
		item, ok := v.Object.(*wh.Item)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to item")
		}
		allPropertyIds = mergeStrAndRemoveDuplicates(allPropertyIds, item.Properties)
		allSpellIds = mergeStrAndRemoveDuplicates(allSpellIds, item.Grimoire.Spells)
	}

	var wg sync.WaitGroup
	wg.Add(2)

	var allProperties []*wh.Wh
	var propertyWhErr error
	go func() {
		defer wg.Done()
		allProperties, propertyWhErr = whService.Get(ctx, wh.WhTypeProperty, claims, false, false, allPropertyIds)
	}()

	var allSpells []*wh.Wh
	var spellWhErr error
	go func() {
		defer wg.Done()
		allSpells, spellWhErr = whService.Get(ctx, wh.WhTypeSpell, claims, false, false, allSpellIds)
	}()

	wg.Wait()

	if propertyWhErr != nil {
		return nil, fmt.Errorf("failed to get wh-properties: %w", propertyWhErr)
	}

	if spellWhErr != nil {
		return nil, fmt.Errorf("failed to get wh-spells: %w", spellWhErr)
	}

	fullItems := make([]*wh.Wh, 0)
	for _, v := range items {
		item, ok := v.Object.(*wh.Item)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to item")
		}
		var err error
		fullItem := v.CopyHeaders()
		fullItem.Object, err = item.ToFull(allProperties, allSpells)
		if err != nil {
			return nil, fmt.Errorf("failed convert wh-item to full item")
		}
		fullItems = append(fullItems, fullItem)
	}

	return fullItems, nil
}

func mergeStrAndRemoveDuplicates(slice1 []string, slice2 []string) []string {
	merged := append(slice1, slice2...)

	// Create a map to keep track of unique elements
	uniqueMap := make(map[string]bool)
	for _, num := range merged {
		uniqueMap[num] = true
	}

	// Create a new slice to store the unique elements
	mergedUnique := []string{}
	for num := range uniqueMap {
		mergedUnique = append(mergedUnique, num)
	}

	return mergedUnique
}

func retrieveFullCharacters(ctx context.Context, whService *WhService, claims *auth.Claims, characters []*wh.Wh) ([]*wh.Wh, error) {
	allItemIds := make([]string, 0)
	allTalentIds := make([]string, 0)
	allCareerIds := make([]string, 0)
	allMutationIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	allPrayerIds := make([]string, 0)
	for _, v := range characters {
		character, ok := v.Object.(*wh.Character)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to character")
		}
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.EquippedItems)
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.CarriedItems)
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.StoredItems)

		allTalentIds = mergeStrAndIdNumberAndRemoveDuplicates(allTalentIds, character.Talents)

		allCareerIds = mergeStrAndIdNumberAndRemoveDuplicates(allCareerIds, character.CareerPath)
		allCareerIds = mergeStrAndIdNumberAndRemoveDuplicates(allCareerIds, []*wh.IdNumber{character.Career})

		allMutationIds = mergeStrAndRemoveDuplicates(allMutationIds, character.Mutations)
		allSpellIds = mergeStrAndRemoveDuplicates(allSpellIds, character.Spells)
		allPrayerIds = mergeStrAndRemoveDuplicates(allPrayerIds, character.Prayers)
	}

	var wg sync.WaitGroup
	wg.Add(7)

	components := map[wh.WhType]*struct {
		err  error
		full bool
		wh   []*wh.Wh
		ids  []string
	}{
		wh.WhTypeItem:     {err: nil, full: true, wh: nil, ids: allItemIds},
		wh.WhTypeSkill:    {err: nil, full: false, wh: nil, ids: []string{}},
		wh.WhTypeTalent:   {err: nil, full: false, wh: nil, ids: allTalentIds},
		wh.WhTypeCareer:   {err: nil, full: false, wh: nil, ids: allCareerIds},
		wh.WhTypeMutation: {err: nil, full: false, wh: nil, ids: allMutationIds},
		wh.WhTypeSpell:    {err: nil, full: false, wh: nil, ids: allSpellIds},
		wh.WhTypePrayer:   {err: nil, full: false, wh: nil, ids: allPrayerIds},
	}

	for k := range components {
		k := k
		v := components[k]
		go func() {
			defer wg.Done()
			v.wh, v.err = whService.Get(ctx, k, claims, v.full, false, v.ids)
		}()
	}

	wg.Wait()

	for _, v := range components {
		if v.err != nil {
			return nil, fmt.Errorf("failed to get wh: %w", v.err)
		}
	}

	fullCharacters := make([]*wh.Wh, 0)
	for _, v := range characters {
		character, ok := v.Object.(*wh.Character)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to character")
		}
		fullCharacter := v.CopyHeaders()
		var err error
		fullCharacter.Object, err = character.ToFull(components[wh.WhTypeItem].wh, components[wh.WhTypeSkill].wh, components[wh.WhTypeTalent].wh, components[wh.WhTypeMutation].wh, components[wh.WhTypeSpell].wh, components[wh.WhTypePrayer].wh, components[wh.WhTypeCareer].wh)
		if err != nil {
			return nil, fmt.Errorf("failed convert wh-character to full character")
		}

		fullCharacters = append(fullCharacters, fullCharacter)
	}

	return fullCharacters, nil
}

func mergeStrAndIdNumberAndRemoveDuplicates(strings []string, structs []*wh.IdNumber) []string {
	// Create a map to store unique strings
	uniqueStrings := make(map[string]bool)

	// Add all strings from the first argument to the map
	for _, str := range strings {
		uniqueStrings[str] = true
	}

	// Add all strings from the second argument to the map
	for _, s := range structs {
		uniqueStrings[s.Id] = true
	}

	// Create a new slice to store the unique strings
	result := []string{}
	for str := range uniqueStrings {
		result = append(result, str)
	}

	return result
}

func (s *WhService) GetGenerationProps(ctx context.Context) (*wh.GenProps, error) {
	generationPropsMap, err := s.WhDbService.RetrieveGenerationProps(ctx)
	if err != nil {
		var dbErr *domain.DbError
		wErr := fmt.Errorf("failed to get generationProps: %w", err)
		if errors.As(err, &dbErr) && dbErr.Type == domain.ErrorDbNotFound {
			return nil, &wh.WhError{ErrType: wh.ErrorNotFound, Err: wErr}
		} else {
			return nil, wErr
		}
	}
	return generationPropsMap, nil
}
