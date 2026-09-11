package warhammer

type Talent struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Tests       string            `json:"tests" validate:"medium_string_valid"`
	MaxRank     int               `json:"maxRank" validate:"gte=0,lte=99"`
	Attribute   Attribute         `json:"attribute" validate:"att_type_valid"`
	Attribute2  Attribute         `json:"attribute2" validate:"att_type_valid"`
	IsGroup     bool              `json:"isGroup" validate:"boolean"`
	Modifiers   Modifiers         `json:"modifiers"`
	Group       []string          `json:"group" validate:"dive,id_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (talent *Talent) Init() {
	if talent.Group == nil {
		talent.Group = []string{}
	}
	if talent.Source == nil {
		talent.Source = map[Source]string{}
	}
	talent.Modifiers.Init()
}
