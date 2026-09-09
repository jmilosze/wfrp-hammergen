package warhammer

type Trait struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Modifiers   Modifiers         `json:"modifiers"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}
