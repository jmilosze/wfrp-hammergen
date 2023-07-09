package services

import (
	"context"
	"encoding/hex"
	"errors"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
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

func (s *WhService) Create(ctx context.Context, t wh.WhType, w *wh.Wh, c *domain.Claims) (*wh.Wh, *wh.WhError) {
	if c.Id == "anonymous" {
		return nil, &wh.WhError{WhType: t, ErrType: wh.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	newWh := w.InitAndCopy()

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		newWh.OwnerId = "admin"
	} else {
		newWh.OwnerId = c.Id
	}
	newWh.Id = hex.EncodeToString(xid.New().Bytes())

	createdWh, dbErr := s.WhDbService.Create(ctx, t, &newWh)
	if dbErr != nil {
		return nil, &wh.WhError{WhType: t, ErrType: user.UserInternalError, Err: dbErr}
	}

	createdWh.CanEdit = canEdit(createdWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return createdWh, nil
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

func (s *WhService) Update(ctx context.Context, t wh.WhType, w *wh.Wh, c *domain.Claims) (*wh.Wh, *wh.WhError) {
	if c.Id == "anonymous" {
		return nil, &wh.WhError{WhType: t, ErrType: wh.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	newWh := w.InitAndCopy()

	if err := s.Validator.Struct(newWh); err != nil {
		return nil, &wh.WhError{WhType: t, ErrType: wh.WhInvalidArgumentsError, Err: err}
	}

	if c.Admin {
		newWh.OwnerId = "admin"
	} else {
		newWh.OwnerId = c.Id
	}

	updatedWh, dbErr := s.WhDbService.Update(ctx, t, &newWh, c.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &wh.WhError{ErrType: wh.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &wh.WhError{ErrType: wh.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	updatedWh.CanEdit = canEdit(updatedWh.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	return updatedWh, nil
}

func (s *WhService) Delete(ctx context.Context, t wh.WhType, whId string, c *domain.Claims) *wh.WhError {
	if c.Id == "anonymous" {
		return &wh.WhError{WhType: t, ErrType: wh.WhUnauthorizedError, Err: errors.New("unauthorized")}
	}

	dbErr := s.WhDbService.Delete(ctx, t, whId, c.Id)
	if dbErr != nil {
		return &wh.WhError{ErrType: wh.WhInternalError, WhType: t, Err: dbErr}
	}

	return nil
}

func (s *WhService) Get(ctx context.Context, t wh.WhType, c *domain.Claims, full bool, whIds []string) ([]*wh.Wh, *wh.WhError) {
	users := []string{"admin", c.Id}

	whs, dbErr := s.WhDbService.Retrieve(ctx, t, users, c.SharedAccounts, whIds)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &wh.WhError{ErrType: wh.WhNotFoundError, WhType: t, Err: dbErr}
		default:
			return nil, &wh.WhError{ErrType: wh.WhInternalError, WhType: t, Err: dbErr}
		}
	}

	if full {
		var whErr *wh.WhError
		if t == wh.WhTypeItem {
			whs, whErr = retrieveFullItems(ctx, s, c, whs)
		} else if t == wh.WhTypeCharacter {
			whs, whErr = retrieveFullCharacters(ctx, s, c, whs)
		}
		if whErr != nil {
			return nil, whErr
		}
	}

	for _, v := range whs {
		v.CanEdit = canEdit(v.OwnerId, c.Admin, c.Id, c.SharedAccounts)
	}

	return whs, nil
}

func retrieveFullItems(ctx context.Context, whService *WhService, claims *domain.Claims, items []*wh.Wh) ([]*wh.Wh, *wh.WhError) {
	allPropertyIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	for _, v := range items {
		item, ok := v.Object.(wh.WhItem)
		if !ok {
			return nil, &wh.WhError{WhType: wh.WhTypeItem, ErrType: wh.WhInternalError, Err: errors.New("non-item stored as item")}
		}
		allPropertyIds = mergeStrAndRemoveDuplicates(allPropertyIds, item.Properties)
		allSpellIds = mergeStrAndRemoveDuplicates(allSpellIds, item.Grimoire.Spells)
	}

	var wg sync.WaitGroup
	wg.Add(2)

	var allProperties []*wh.Wh
	var propertyWhErr *wh.WhError
	go func() {
		defer wg.Done()
		allProperties, propertyWhErr = whService.Get(ctx, wh.WhTypeProperty, claims, false, allPropertyIds)
	}()

	var allSpells []*wh.Wh
	var spellWhErr *wh.WhError
	go func() {
		defer wg.Done()
		allSpells, spellWhErr = whService.Get(ctx, wh.WhTypeSpell, claims, false, allSpellIds)
	}()

	wg.Wait()

	if propertyWhErr != nil && propertyWhErr.ErrType != wh.WhNotFoundError {
		return nil, propertyWhErr
	}

	if spellWhErr != nil && spellWhErr.ErrType != wh.WhNotFoundError {
		return nil, spellWhErr
	}

	fullItems := make([]*wh.Wh, len(items))
	for k, v := range items {
		item := v.Object.(wh.WhItem)
		fullItem := v.CopyHeaders()
		fullItem.Object = item.ToFull(allProperties, allSpells)
		fullItems[k] = &fullItem
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

func retrieveFullCharacters(ctx context.Context, whService *WhService, claims *domain.Claims, characters []*wh.Wh) ([]*wh.Wh, *wh.WhError) {
	allItemIds := make([]string, 0)
	allSkillIds := make([]string, 0)
	allTalentIds := make([]string, 0)
	allCareerIds := make([]string, 0)
	allMutationIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	for _, v := range characters {
		character, ok := v.Object.(wh.WhCharacter)
		if !ok {
			return nil, &wh.WhError{WhType: wh.WhTypeCharacter, ErrType: wh.WhInternalError, Err: errors.New("non-character stored as character")}
		}
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.EquippedItems)
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.CarriedItems)
		allItemIds = mergeStrAndIdNumberAndRemoveDuplicates(allItemIds, character.StoredItems)

		allSkillIds = mergeStrAndIdNumberAndRemoveDuplicates(allSkillIds, character.Skills)
		allTalentIds = mergeStrAndIdNumberAndRemoveDuplicates(allTalentIds, character.Talents)

		allCareerIds = mergeStrAndRemoveDuplicates(allCareerIds, character.CareerPath)
		allCareerIds = mergeStrAndRemoveDuplicates(allCareerIds, []string{character.Career})

		allMutationIds = mergeStrAndRemoveDuplicates(allMutationIds, character.Mutations)
		allSpellIds = mergeStrAndRemoveDuplicates(allSpellIds, character.Spells)
	}

	//var wg sync.WaitGroup
	//wg.Add(6)

	components := map[wh.WhType]*struct {
		err  *wh.WhError
		full bool
		wh   []*wh.Wh
		ids  []string
	}{
		wh.WhTypeItem:     {err: nil, full: true, wh: nil, ids: allItemIds},
		wh.WhTypeSkill:    {err: nil, full: false, wh: nil, ids: allSkillIds},
		wh.WhTypeTalent:   {err: nil, full: false, wh: nil, ids: allTalentIds},
		wh.WhTypeCareer:   {err: nil, full: false, wh: nil, ids: allCareerIds},
		wh.WhTypeMutation: {err: nil, full: false, wh: nil, ids: allMutationIds},
		wh.WhTypeSpell:    {err: nil, full: false, wh: nil, ids: allSpellIds},
	}

	for k, v := range components {
		v.wh, v.err = whService.Get(ctx, k, claims, v.full, v.ids)
		//go func() {
		//	defer wg.Done()
		//	v.wh, v.err = whService.Get(ctx, k, claims, v.full, v.ids)
		//}()
	}

	//wg.Wait()

	for _, v := range components {
		if v.err != nil && v.err.ErrType != wh.WhNotFoundError {
			return nil, v.err
		}
	}

	fullCharacters := make([]*wh.Wh, len(characters))
	for k, v := range characters {
		character := v.Object.(wh.WhCharacter)
		fullCharacter := v.CopyHeaders()
		fullCharacter.Object = character.ToFull(
			components[wh.WhTypeItem].wh,
			components[wh.WhTypeSkill].wh,
			components[wh.WhTypeTalent].wh,
			components[wh.WhTypeMutation].wh,
			components[wh.WhTypeSpell].wh,
			components[wh.WhTypeCareer].wh)
		fullCharacters[k] = &fullCharacter
	}

	return fullCharacters, nil
}

func mergeStrAndIdNumberAndRemoveDuplicates(strings []string, structs []wh.IdNumber) []string {
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

func (s *WhService) GetGenerationProps(ctx context.Context) (*wh.WhGenerationProps, *wh.WhError) {
	generationPropsMap, dbErr := s.WhDbService.RetrieveGenerationProps(ctx)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &wh.WhError{ErrType: wh.WhNotFoundError, Err: dbErr}
		default:
			return nil, &wh.WhError{ErrType: wh.WhInternalError, Err: dbErr}
		}
	}

	return generationPropsMap, nil
}
