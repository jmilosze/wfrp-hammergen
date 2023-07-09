package warhammer

type WhAttributes struct {
	WS  int `json:"WS" validate:"min=-99,max=99"`
	BS  int `json:"BS" validate:"min=-99,max=99"`
	S   int `json:"S" validate:"min=-99,max=99"`
	T   int `json:"T" validate:"min=-99,max=99"`
	I   int `json:"I" validate:"min=-99,max=99"`
	Ag  int `json:"Ag" validate:"min=-99,max=99"`
	Dex int `json:"Dex" validate:"min=-99,max=99"`
	Int int `json:"Int" validate:"min=-99,max=99"`
	WP  int `json:"WP" validate:"min=-99,max=99"`
	Fel int `json:"Fel" validate:"min=-99,max=99"`
}

func (a WhAttributes) InitAndCopy() WhAttributes {
	return WhAttributes{
		WS:  a.WS,
		BS:  a.BS,
		S:   a.S,
		T:   a.T,
		I:   a.I,
		Ag:  a.Ag,
		Dex: a.Dex,
		Int: a.Int,
		WP:  a.WP,
		Fel: a.Fel,
	}
}

type WhModifiers struct {
	Size       int `json:"size" validate:"min=-3,max=3"`
	Movement   int `json:"movement" validate:"min=-3,max=3"`
	Attributes WhAttributes
}

func (m WhModifiers) InitAndCopy() WhModifiers {
	return WhModifiers{
		Size:       m.Size,
		Movement:   m.Movement,
		Attributes: m.Attributes.InitAndCopy(),
	}
}
