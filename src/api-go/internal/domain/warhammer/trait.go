package warhammer

type Trait struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Modifiers   Modifiers         `json:"modifiers"`
	HasValue    bool              `json:"hasValue" validate:"boolean"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (trait *Trait) Init() {
	if trait.Source == nil {
		trait.Source = map[Source]string{}
	}
	trait.Modifiers.Init()
}

// ValidateEdition checks that the modifier effects are used by the edition.
func (trait *Trait) ValidateEdition(e Edition) error {
	return trait.Modifiers.ValidateEdition(e)
}
