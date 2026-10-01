package warhammer

import "testing"

func TestModifiersValidateEdition(t *testing.T) {
	for name, tc := range map[string]struct {
		edition Edition
		effects []EffectType
		wantErr bool
	}{
		"4e no effects":     {Edition4e, []EffectType{}, false},
		"4e hardy":          {Edition4e, []EffectType{EffectTypeHardy}, false},
		"4e strong back":    {Edition4e, []EffectType{EffectTypeStrongBack}, true},
		"4e sturdy":         {Edition4e, []EffectType{EffectTypeHardy, EffectTypeSturdy}, true},
		"5e all effects":    {Edition5e, []EffectType{EffectTypeHardy, EffectTypeStrongBack, EffectTypeSturdy}, false},
		"5e unknown effect": {Edition5e, []EffectType{3}, true},
	} {
		t.Run(name, func(t *testing.T) {
			modifiers := Modifiers{Effects: tc.effects}
			if err := modifiers.ValidateEdition(tc.edition); (err != nil) != tc.wantErr {
				t.Errorf("got error %v, want error %v", err, tc.wantErr)
			}
		})
	}
}
