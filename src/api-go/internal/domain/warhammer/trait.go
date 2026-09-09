package warhammer

type Trait struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Modifiers   Modifiers         `json:"modifiers"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (trait *Trait) Init() {
	if trait.Source == nil {
		trait.Source = map[Source]string{}
	}
	if trait.Modifiers.Effects == nil {
		trait.Modifiers.Effects = []EffectType{}
	}
}
