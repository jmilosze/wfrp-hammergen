package warhammer

type GenProps struct {
	Name           string
	ClassItems     map[CareerClass]*GenItems     `json:"classItems"`
	RandomTalents  []*GenRandomTalent            `json:"randomTalents"`
	SpeciesTalents map[CharacterSpecies][]string `json:"speciesTalents"`
	SpeciesSkills  map[CharacterSpecies][]string `json:"speciesSkills"`
	// SpeciesLanguages are the fluent languages of each species (5e: +30 each).
	SpeciesLanguages map[CharacterSpecies][]string `json:"speciesLanguages,omitempty"`
}

// GenPropsName is the name of the generation props document of an edition.
func GenPropsName(e Edition) string {
	if e == Edition5e {
		return "generationProps5e"
	}
	return "generationProps"
}

type IdStringMap map[string]string

type GenItems struct {
	Equipped IdStringMap `json:"equipped"`
	Carried  IdStringMap `json:"carried"`
	Stored   IdStringMap `json:"stored"`
}

type GenRandomTalent struct {
	Id      string `json:"id"`
	MinRoll int    `json:"minRoll"`
	MaxRoll int    `json:"maxRoll"`
}
