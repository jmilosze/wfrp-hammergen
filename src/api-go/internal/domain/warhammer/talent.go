package warhammer

import "errors"

type Talent struct {
	Name        string            `json:"name" validate:"name_valid"`
	Description string            `json:"description" validate:"desc_valid"`
	Tests       string            `json:"tests" validate:"medium_string_valid"`
	MaxRank     int               `json:"maxRank" validate:"gte=0,lte=999"` // 999 means unlimited
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

// ValidateEdition checks rules that depend on the edition:
//   - modifier effects: only those used by the edition;
//   - max rank (5e): a fixed number only (no characteristic bonuses), at least 1 unless the talent is a group;
//   - tests (5e): none, 5e talents have no Tests line.
func (talent *Talent) ValidateEdition(e Edition) error {
	if err := talent.Modifiers.ValidateEdition(e); err != nil {
		return err
	}
	if e != Edition5e {
		return nil
	}
	if talent.Tests != "" {
		return errors.New("5e talents have no tests")
	}
	if talent.Attribute != AttNone || talent.Attribute2 != AttNone {
		return errors.New("5e talents have no characteristic-based max rank")
	}
	if !talent.IsGroup && talent.MaxRank < 1 {
		return errors.New("5e talents need a max rank of at least 1")
	}
	return nil
}
