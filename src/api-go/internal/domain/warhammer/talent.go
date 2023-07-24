package warhammer

type Talent struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Tests       string            `json:"tests" validate:"medium_string_valid"`
	MaxRank     int               `json:"maxRank" validate:"gte=0,lte=99"`
	Attribute   Attribute         `json:"attribute" validate:"att_type_valid"`
	IsGroup     bool              `json:"isGroup" validate:"boolean"`
	Modifiers   *Modifiers        `json:"modifiers"`
	Group       []string          `json:"group" validate:"dive,id_valid"`
	Shared      bool              `json:"shared" validate:"shared_valid"`
	Source      map[Source]string `json:"source" validate:"source_valid"`
}

func (talent *Talent) IsShared() bool {
	return talent.Shared
}

func (talent *Talent) Copy() WhObject {
	if talent == nil {
		return nil
	}

	return &Talent{
		Name:        talent.Name,
		Description: talent.Description,
		Tests:       talent.Tests,
		MaxRank:     talent.MaxRank,
		Attribute:   talent.Attribute,
		IsGroup:     talent.IsGroup,
		Modifiers:   talent.Modifiers.Copy(),
		Group:       append([]string(nil), talent.Group...),
		Shared:      talent.Shared,
		Source:      copySourceMap(talent.Source),
	}
}

func (talent *Talent) InitNilPointers() {
	if talent == nil {
		return
	}

	if talent.Modifiers == nil {
		talent.Modifiers = &Modifiers{}
	}
	talent.Modifiers.InitNilPointers()

	if talent.Group == nil {
		talent.Group = []string{}
	}

	if talent.Source == nil {
		talent.Source = map[Source]string{}
	}
}
