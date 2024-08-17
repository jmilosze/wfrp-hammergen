package warhammer

import (
	"errors"
)

type Trait struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Modifiers   *Modifiers        `json:"modifiers"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (trait *Trait) IsShared() (bool, error) {
	if trait == nil {
		return false, errors.New("trait pointer is nil")
	}

	return trait.Shared, nil
}

func (trait *Trait) Copy() WhObject {
	if trait == nil {
		return nil
	}

	return &Trait{
		Name:        trait.Name,
		Description: trait.Description,
		Modifiers:   trait.Modifiers.Copy(),
		Shared:      trait.Shared,
		Source:      copySourceMap(trait.Source),
	}
}

func (trait *Trait) InitNilPointers() error {
	if trait == nil {
		return errors.New("trait pointer is nil")
	}

	if trait.Modifiers == nil {
		trait.Modifiers = &Modifiers{}
	}

	err := trait.Modifiers.InitNilPointers()
	if err != nil {
		return err
	}

	if trait.Source == nil {
		trait.Source = map[Source]string{}
	}

	return nil
}
