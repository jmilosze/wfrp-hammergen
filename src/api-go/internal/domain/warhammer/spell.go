package warhammer

import (
	"strings"
)

type Spell struct {
	Name        string    `json:"name" validate:"name_valid"`
	Description string    `json:"description" validate:"desc_valid"`
	Cn          int       `json:"cn" validate:"min=-1,max=99"`
	Range       string    `json:"range" validate:"medium_string_valid"`
	Target      string    `json:"target" validate:"medium_string_valid"`
	Duration    string    `json:"duration" validate:"medium_string_valid"`
	Shared      bool      `json:"shared" validate:"shared_valid"`
	Source      SourceMap `json:"source" validate:"source_valid"`
}

func (s Spell) IsShared() bool {
	return s.Shared
}

func (s Spell) InitAndCopy() WhObject {
	return Spell{
		Name:        strings.Clone(s.Name),
		Description: strings.Clone(s.Description),
		Cn:          s.Cn,
		Range:       strings.Clone(s.Range),
		Target:      strings.Clone(s.Target),
		Duration:    strings.Clone(s.Duration),
		Shared:      s.Shared,
		Source:      s.Source.InitAndCopy(),
	}
}
