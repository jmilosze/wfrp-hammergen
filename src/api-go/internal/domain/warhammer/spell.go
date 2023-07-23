package warhammer

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

func (spell *Spell) IsShared() bool {
	return spell.Shared
}

func (spell *Spell) Copy() WhObject {
	return &Spell{
		Name:        spell.Name,
		Description: spell.Description,
		Cn:          spell.Cn,
		Range:       spell.Range,
		Target:      spell.Target,
		Duration:    spell.Duration,
		Shared:      spell.Shared,
		Source:      spell.Source.Copy(),
	}
}

//func (spell *Spell) InitNilPointers() {
//	if spell.Source == nil {
//		spell.Source = NewSourceMap()
//	}
//}

func NewSpell() *Spell {
	return &Spell{
		Source: NewSourceMap(),
	}
}
