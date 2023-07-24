package warhammer

import "errors"

type Modifiers struct {
	Size       int         `json:"size" validate:"min=-3,max=3"`
	Movement   int         `json:"movement" validate:"min=-3,max=3"`
	Attributes *Attributes `json:"attributes"`
}

func (modifiers *Modifiers) Copy() *Modifiers {
	if modifiers == nil {
		return nil
	}

	return &Modifiers{
		Size:       modifiers.Size,
		Movement:   modifiers.Movement,
		Attributes: modifiers.Attributes.Copy(),
	}
}

func (modifiers *Modifiers) InitNilPointers() error {
	if modifiers == nil {
		return errors.New("talent pointer is nil")
	}

	if modifiers.Attributes == nil {
		modifiers.Attributes = &Attributes{}
	}
	return nil
}
