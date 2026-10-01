package warhammer

import "testing"

func TestTalentValidateEdition(t *testing.T) {
	for name, tc := range map[string]struct {
		edition Edition
		talent  Talent
		wantErr bool
	}{
		"4e with characteristic bonuses": {Edition4e, Talent{Attribute: AttBS, Attribute2: AttWS}, false},
		"4e with max rank 0":             {Edition4e, Talent{MaxRank: 0}, false},
		"5e with fixed max rank":         {Edition5e, Talent{MaxRank: 2}, false},
		"5e unlimited":                   {Edition5e, Talent{MaxRank: 999}, false},
		"5e group without max rank":      {Edition5e, Talent{IsGroup: true}, false},
		"5e with attribute":              {Edition5e, Talent{MaxRank: 1, Attribute: AttBS}, true},
		"5e with attribute2":             {Edition5e, Talent{MaxRank: 1, Attribute2: AttWS}, true},
		"5e with max rank 0":             {Edition5e, Talent{MaxRank: 0}, true},
		"4e with tests":                  {Edition4e, Talent{Tests: "Charm"}, false},
		"5e with tests":                  {Edition5e, Talent{MaxRank: 1, Tests: "Charm"}, true},
		"4e with Strong Back effect":     {Edition4e, Talent{Modifiers: Modifiers{Effects: []EffectType{EffectTypeStrongBack}}}, true},
		"5e with Strong Back effect":     {Edition5e, Talent{MaxRank: 2, Modifiers: Modifiers{Effects: []EffectType{EffectTypeStrongBack}}}, false},
	} {
		t.Run(name, func(t *testing.T) {
			if err := tc.talent.ValidateEdition(tc.edition); (err != nil) != tc.wantErr {
				t.Errorf("got error %v, want error %v", err, tc.wantErr)
			}
		})
	}
}
