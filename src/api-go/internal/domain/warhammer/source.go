package warhammer

import (
	"fmt"
)

type Source string

const (
	SourceCustom                        = "0"
	SourceWFRP                          = "1"
	SourceRoughNightsAndHardDays        = "2"
	SourceArchivesOfTheEmpireVolI       = "3"
	SourceArchivesOfTheEmpireVolII      = "4"
	SourceArchivesOfTheEmpireVolIII     = "5"
	SourceUpInArms                      = "6"
	SourceWindsOfMagic                  = "7"
	SourceMiddenheim                    = "8"
	SourceSalzenmund                    = "9"
	SourceSeaOfClaws                    = "10"
	SourceLustria                       = "11"
	SourceEnemyInShadowsCompanion       = "12"
	SourceDeathOnTheReikCompanion       = "13"
	SourceEnemyInShadows                = "14"
	SourceDeathOnTheReik                = "15"
	SourcePowerBehindTheThrone          = "16"
	SourcePowerBehindTheThroneCompanion = "17"
	SourceTheHornedRat                  = "18"
	SourceTheHornedRatCompanion         = "19"
	SourceEmpireInRuins                 = "20"
	SourceEmpireInRuinsCompanion        = "21"
	SourceImperialZoo                   = "22"
	SourceAltdorf                       = "23"
	SourceUbersreikAdventures1          = "24"
	SourceUbersreikAdventures2          = "25"
	SourceStarterSetGuideToUbersreik    = "26"
	SourceStarterSetAdventureBook       = "27"
	SourceUbersreikAdventures3          = "28"
	SourceTribesAndTribulations         = "29"
	SourceReiklandMiscellanea           = "30"
	SourcePatronsOfTheOldWorld          = "31"
	SourceBuildingsOfReikland           = "32"
	SourceOneShotsOfTheReikland         = "33"
	SourceMonumentsOfTheReikland        = "34"
	SourceShrinesOfSigmar               = "35"
	SourceSullasarasSpells              = "36"
	SourceBloodAndBramble               = "37"
	SourceDwarfPlayersGuide             = "38"
	SourceDeftStepsLightFingers         = "39"
	SourceHighElfPlayersGuide           = "40"
)

func sourceValues() string {
	return formatStringValues([]Source{
		SourceCustom,
		SourceWFRP,
		SourceRoughNightsAndHardDays,
		SourceArchivesOfTheEmpireVolI,
		SourceArchivesOfTheEmpireVolII,
		SourceArchivesOfTheEmpireVolIII,
		SourceUpInArms,
		SourceWindsOfMagic,
		SourceMiddenheim,
		SourceSalzenmund,
		SourceSeaOfClaws,
		SourceLustria,
		SourceEnemyInShadowsCompanion,
		SourceDeathOnTheReikCompanion,
		SourceEnemyInShadows,
		SourceDeathOnTheReik,
		SourcePowerBehindTheThrone,
		SourcePowerBehindTheThroneCompanion,
		SourceTheHornedRat,
		SourceTheHornedRatCompanion,
		SourceEmpireInRuins,
		SourceEmpireInRuinsCompanion,
		SourceImperialZoo,
		SourceAltdorf,
		SourceUbersreikAdventures1,
		SourceUbersreikAdventures2,
		SourceStarterSetGuideToUbersreik,
		SourceStarterSetAdventureBook,
		SourceUbersreikAdventures3,
		SourceTribesAndTribulations,
		SourceReiklandMiscellanea,
		SourcePatronsOfTheOldWorld,
		SourceBuildingsOfReikland,
		SourceOneShotsOfTheReikland,
		SourceMonumentsOfTheReikland,
		SourceShrinesOfSigmar,
		SourceSullasarasSpells,
		SourceBloodAndBramble,
		SourceDwarfPlayersGuide,
		SourceDeftStepsLightFingers,
		SourceHighElfPlayersGuide,
	})
}

func copySourceMap(input map[Source]string) map[Source]string {
	if input == nil {
		return nil
	}

	output := make(map[Source]string, len(input))
	for key, value := range input {
		output[key] = value
	}
	return output
}

func GetSourceValidationAliases() map[string]string {
	return map[string]string{
		"source_valid": fmt.Sprintf("dive,keys,oneof=%s,endkeys,min=0,max=25,excludesall=<>", sourceValues()),
	}
}
