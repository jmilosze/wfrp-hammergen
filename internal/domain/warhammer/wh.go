package warhammer

import (
	"fmt"
	"strings"
)

type Wh struct {
	Id      string
	OwnerId string
	CanEdit bool
	Object  WhObject
}

const (
	WhTypeMutation = "mutation"
	WhTypeSpell    = "spell"
	WhTypeProperty = "property"
	WhTypeItem     = "item"
)

type WhType string

var WhTypes = []WhType{WhTypeMutation, WhTypeSpell, WhTypeProperty, WhTypeItem}

func NewWh(t WhType) (Wh, error) {
	var wh Wh

	switch t {
	case WhTypeMutation:
		wh.Object = &WhMutation{}
	case WhTypeSpell:
		wh.Object = &WhSpell{}
	case WhTypeProperty:
		wh.Object = &WhProperty{}
	case WhTypeItem:
		wh.Object = &WhItem{}
	default:
		return wh, fmt.Errorf("invalid Wh type %s", t)
	}

	return wh, nil
}

func (w *Wh) InitAndCopy() *Wh {
	if w == nil {
		return nil
	}

	return &Wh{
		Id:      strings.Clone(w.Id),
		OwnerId: strings.Clone(w.OwnerId),
		Object:  w.Object.InitAndCopy(),
	}
}

func (w *Wh) IsShared() bool {
	return w.Object.IsShared()
}

type WhObject interface {
	InitAndCopy() WhObject
	IsShared() bool
}
