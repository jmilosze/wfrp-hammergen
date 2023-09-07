package warhammer

import "errors"

type Spell struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Cn          int               `json:"cn" validate:"min=0,max=99"`
	Range       string            `json:"range" validate:"medium_string_valid"`
	Target      string            `json:"target" validate:"medium_string_valid"`
	Duration    string            `json:"duration" validate:"medium_string_valid"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (spell *Spell) IsShared() (bool, error) {
	if spell == nil {
		return false, errors.New("spell pointer is nil")
	}

	return spell.Shared, nil
}

func (spell *Spell) Copy() WhObject {
	if spell == nil {
		return nil
	}

	return &Spell{
		Name:        spell.Name,
		Description: spell.Description,
		Cn:          spell.Cn,
		Range:       spell.Range,
		Target:      spell.Target,
		Duration:    spell.Duration,
		Shared:      spell.Shared,
		Source:      copySourceMap(spell.Source),
	}
}

func (spell *Spell) InitNilPointers() error {
	if spell == nil {
		return errors.New("spell pointer is nil")
	}

	if spell.Source == nil {
		spell.Source = map[Source]string{}
	}

	return nil
}
