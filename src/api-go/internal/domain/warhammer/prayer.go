package warhammer

type Prayer struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Range       string            `json:"range" validate:"medium_string_valid"`
	Target      string            `json:"target" validate:"medium_string_valid"`
	Duration    string            `json:"duration" validate:"medium_string_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (prayer *Prayer) Init() {
	if prayer.Source == nil {
		prayer.Source = map[Source]string{}
	}
}
