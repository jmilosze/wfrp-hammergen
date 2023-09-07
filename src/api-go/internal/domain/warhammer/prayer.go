package warhammer

import "errors"

type Prayer struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Range       string            `json:"range" validate:"medium_string_valid"`
	Target      string            `json:"target" validate:"medium_string_valid"`
	Duration    string            `json:"duration" validate:"medium_string_valid"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (prayer *Prayer) IsShared() (bool, error) {
	if prayer == nil {
		return false, errors.New("prayer pointer is nil")
	}

	return prayer.Shared, nil
}

func (prayer *Prayer) Copy() WhObject {
	if prayer == nil {
		return nil
	}

	return &Prayer{
		Name:        prayer.Name,
		Description: prayer.Description,
		Range:       prayer.Range,
		Target:      prayer.Target,
		Duration:    prayer.Duration,
		Shared:      prayer.Shared,
		Source:      copySourceMap(prayer.Source),
	}
}

func (prayer *Prayer) InitNilPointers() error {
	if prayer == nil {
		return errors.New("prayer pointer is nil")
	}

	if prayer.Source == nil {
		prayer.Source = map[Source]string{}
	}

	return nil
}
