package warhammer

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

//func (modifiers *Modifiers) InitNilPointers() {
//	if modifiers.Attributes == nil {
//		modifiers.Attributes = NewAttributes()
//	}
//
//}

func NewModifiers() *Modifiers {
	return &Modifiers{Attributes: NewAttributes()}
}
