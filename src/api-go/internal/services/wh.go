package services

import (
	"context"
	"encoding/hex"
	"fmt"
	"sync"

	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	wh "github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"github.com/rs/xid"
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
		return nil, fmt.Errorf("unauthorized to create wh: %w", domain.ErrUnauthorized)
	}

	w.Init()

	if err := s.Validator.Struct(w); err != nil {
		return nil, fmt.Errorf("%w: %s", domain.ErrInvalidArguments, err)
	}

	if err := extraCharacterValidation(t, w, s.Validator); err != nil {
		return nil, fmt.Errorf("%w: %s", domain.ErrInvalidArguments, err)
	}

	if !c.Admin && w.Visibility == wh.VisibilityPublic {
		return nil, fmt.Errorf("non-admin cannot create public items: %w", domain.ErrUnauthorized)
	}

	w.OwnerId = c.Id
	w.Id = hex.EncodeToString(xid.New().Bytes())

	createdWh, err := s.WhDbService.Create(ctx, t, w)
	if err != nil {
		return nil, fmt.Errorf("failed to create wh: %w", err)
	}

	return createdWh, nil
}

func extraCharacterValidation(t wh.WhType, w *wh.Wh, validator *validator.Validate) error {
	if t == wh.WhTypeCharacter {
		char := w.Object.(*wh.Character)
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

func canModify(ownerId string, userId string) bool {
	return ownerId == userId
}

func (s *WhService) Update(ctx context.Context, t wh.WhType, w *wh.Wh, c *auth.Claims) (*wh.Wh, error) {
	if c.Id == "anonymous" {
		return nil, fmt.Errorf("unauthorized to update wh %s: %w", w.Id, domain.ErrUnauthorized)
	}

	w.Init()

	if err := s.Validator.Struct(w); err != nil {
		return nil, fmt.Errorf("%w: %s", domain.ErrInvalidArguments, err)
	}

	if err := extraCharacterValidation(t, w, s.Validator); err != nil {
		return nil, fmt.Errorf("%w: %s", domain.ErrInvalidArguments, err)
	}

	if !c.Admin && w.Visibility == wh.VisibilityPublic {
		return nil, fmt.Errorf("non-admin cannot set visibility to public: %w", domain.ErrUnauthorized)
	}

	existingWhs, err := s.WhDbService.Retrieve(ctx, t, []string{c.Id}, c.SharedAccounts, []string{w.Id})
	if err != nil || len(existingWhs) == 0 {
		return nil, fmt.Errorf("wh %s not found: %w", w.Id, domain.ErrNotFound)
	}
	existingWh := existingWhs[0]

	if !canModify(existingWh.OwnerId, c.Id) {
		return nil, fmt.Errorf("unauthorized to update wh %s: %w", w.Id, domain.ErrNotFound)
	}

	w.OwnerId = existingWh.OwnerId
	updatedWh, err := s.WhDbService.Update(ctx, t, w, c.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to update wh: %w", err)
	}

	return updatedWh, nil
}

func (s *WhService) Delete(ctx context.Context, t wh.WhType, whId string, c *auth.Claims) error {
	if c.Id == "anonymous" {
		return fmt.Errorf("unauthorized to delete wh %s: %w", whId, domain.ErrUnauthorized)
	}

	existingWhs, err := s.WhDbService.Retrieve(ctx, t, []string{c.Id}, c.SharedAccounts, []string{whId})
	if err != nil || len(existingWhs) == 0 {
		return fmt.Errorf("wh %s not found: %w", whId, domain.ErrNotFound)
	}
	existingWh := existingWhs[0]

	if !canModify(existingWh.OwnerId, c.Id) {
		return nil
	}

	err = s.WhDbService.Delete(ctx, t, whId, c.Id)
	if err != nil {
		return fmt.Errorf("failed to delete wh: %w", err)
	}

	return nil
}

func (s *WhService) Get(ctx context.Context, t wh.WhType, c *auth.Claims, full bool, errIfNotFound bool, whIds []string) ([]*wh.Wh, error) {
	users := []string{c.Id}

	whs, err := s.WhDbService.Retrieve(ctx, t, users, c.SharedAccounts, whIds)
	if err != nil {
		return nil, fmt.Errorf("failed to retreive wh: %w", err)
	}

	for _, v := range whs {
		v.Init()
	}

	whsRet := whs

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
		return nil, fmt.Errorf("not all ids found: %w", domain.ErrNotFound)
	}

	return whsRet, nil
}

func retrieveFullItems(ctx context.Context, whService *WhService, claims *auth.Claims, items []*wh.Wh) ([]*wh.Wh, error) {
	allPropertyIds := make([]string, 0)
	allRuneIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	for _, v := range items {
		item, ok := v.Object.(*wh.Item)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to item")
		}
		allPropertyIds = deduplicate(allPropertyIds, item.Properties)
		allRuneIds = deduplicate(allRuneIds, idNumbersToIds(item.Runes))
		allSpellIds = deduplicate(allSpellIds, item.Grimoire.Spells)
	}

	var wg sync.WaitGroup
	wg.Add(3)

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

	var allRunes []*wh.Wh
	var runesWhErr error
	go func() {
		defer wg.Done()
		allRunes, runesWhErr = whService.Get(ctx, wh.WhTypeRune, claims, false, false, allRuneIds)
	}()

	wg.Wait()

	if propertyWhErr != nil {
		return nil, fmt.Errorf("failed to get wh-properties: %w", propertyWhErr)
	}

	if spellWhErr != nil {
		return nil, fmt.Errorf("failed to get wh-spells: %w", spellWhErr)
	}

	if runesWhErr != nil {
		return nil, fmt.Errorf("failed to get wh-runes: %w", runesWhErr)
	}

	fullItems := make([]*wh.Wh, 0)
	for _, v := range items {
		item, ok := v.Object.(*wh.Item)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to item")
		}
		var err error
		fullItem := v.CopyHeaders()
		fullItem.Object, err = item.ToFull(allProperties, allSpells, allRunes)
		if err != nil {
			return nil, fmt.Errorf("failed convert wh-item to full item")
		}
		fullItems = append(fullItems, fullItem)
	}

	return fullItems, nil
}

func deduplicate[T comparable](slices ...[]T) []T {
	seen := make(map[T]struct{})
	var result []T
	for _, s := range slices {
		for _, v := range s {
			if _, ok := seen[v]; !ok {
				seen[v] = struct{}{}
				result = append(result, v)
			}
		}
	}
	return result
}

func idNumbersToIds(items []wh.IdNumber) []string {
	ids := make([]string, len(items))
	for i, item := range items {
		ids[i] = item.Id
	}
	return ids
}

func retrieveFullCharacters(ctx context.Context, whService *WhService, claims *auth.Claims, characters []*wh.Wh) ([]*wh.Wh, error) {
	allItemIds := make([]string, 0)
	allTalentIds := make([]string, 0)
	allCareerIds := make([]string, 0)
	allMutationIds := make([]string, 0)
	allSpellIds := make([]string, 0)
	allPrayerIds := make([]string, 0)
	allTraitIds := make([]string, 0)
	for _, v := range characters {
		character, ok := v.Object.(*wh.Character)
		if !ok {
			return nil, fmt.Errorf("failed to cast object to character")
		}
		allItemIds = deduplicate(allItemIds, idNumbersToIds(character.EquippedItems), idNumbersToIds(character.CarriedItems), idNumbersToIds(character.StoredItems))
		allTalentIds = deduplicate(allTalentIds, idNumbersToIds(character.Talents))
		allCareerIds = deduplicate(allCareerIds, idNumbersToIds(character.CareerPath), []string{character.Career.Id})

		allMutationIds = deduplicate(allMutationIds, character.Mutations)
		allSpellIds = deduplicate(allSpellIds, character.Spells)
		allPrayerIds = deduplicate(allPrayerIds, character.Prayers)
		allTraitIds = deduplicate(allTraitIds, character.Traits)
	}

	var wg sync.WaitGroup
	wg.Add(8)

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
		wh.WhTypeTrait:    {err: nil, full: false, wh: nil, ids: allTraitIds},
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
		fullCharacter.Object, err = character.ToFull(components[wh.WhTypeItem].wh, components[wh.WhTypeSkill].wh, components[wh.WhTypeTalent].wh, components[wh.WhTypeMutation].wh, components[wh.WhTypeSpell].wh, components[wh.WhTypePrayer].wh, components[wh.WhTypeTrait].wh, components[wh.WhTypeCareer].wh)
		if err != nil {
			return nil, fmt.Errorf("failed convert wh-character to full character: %w", err)
		}

		fullCharacters = append(fullCharacters, fullCharacter)
	}

	return fullCharacters, nil
}

func (s *WhService) GetGenerationProps(ctx context.Context) (*wh.GenProps, error) {
	generationPropsMap, err := s.WhDbService.RetrieveGenerationProps(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get generationProps: %w", err)
	}

	return generationPropsMap, nil
}
