package warhammer

type GenProps struct {
	Name           string
	ClassItems     map[CareerClass]*GenItems     `json:"classItems"`
	RandomTalents  []*GenRandomTalent            `json:"randomTalents"`
	SpeciesTalents map[CharacterSpecies][]string `json:"speciesTalents"`
	SpeciesSkills  map[CharacterSpecies][]string `json:"speciesSkills"`
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
