// 5e level 1 character creation (pp. 22–42): every choice and kept roll in one place, and the character built from
// them. Guided creation (HG-44) fills the choices step by step; the generator fills them at random.
import { NEW_ID } from "@/services/wh/core/entity.ts";
import { Character } from "@/services/wh/character/character.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Career } from "@/services/wh/content/career.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { Attributes, sumAttributes } from "@/services/wh/core/attributes.ts";
import { IdNumberValue, mergeEntries } from "@/utils/idNumberValue.ts";
import { generateStatusAndStanding } from "@/services/wh/character/generation/shared/status.ts";
import { applyCareerSkillAdvances5e } from "./skills5e.ts";
import { getFateFortune5e } from "./fate5e.ts";

// The choices and kept rolls of 5e level 1 creation.
export interface CreationChoices5e {
  species: SpeciesWithRegion;
  career: Career;
  name: string;
  description: string;
  notes: string;
  // The 2d10 results as assigned to the characteristics (or the point spread of method C).
  attributeRolls: Attributes;
  // The creation points over the level 1 career characteristics (CREATION_CHARACTERISTIC_POINTS_5E).
  attributePoints: Attributes;
  // The fluent languages and the five species skills, with their points.
  speciesSkills: Record<string, number>;
  // The eight career skill Advances: number of Advances per level 1 career skill.
  careerSkillAdvances: Record<string, number>;
  // The species talents with "A or B" choices, groups and Random Talents settled.
  speciesTalents: string[];
  // A rank of a level 1 career talent; null only when the career has none left to take.
  careerTalent: string | null;
  // Rolled: the class trappings, and the career trappings of level 1 and the level 2 bonus (p. 36).
  classTrappings: IdNumberValue[];
  careerTrappings: { carried: IdNumberValue[]; stored: IdNumberValue[] };
  // Career Advancement Tracker ticks of the level 2 bonus trappings (p. 36).
  bonusTicks: number;
  // Rolled: starting wealth plus the level 1 career money, [brass, silver, gold].
  coins: [number, number, number];
  // Keeping the first species roll (p. 23) and Oh Fickle Fate (p. 40).
  bonusFortune: number;
  bonusFate: number;
}

export function buildCharacter5e(choices: CreationChoices5e): Character {
  const { fate, fortune } = getFateFortune5e(choices.species);
  const { status, standing } = generateStatusAndStanding(choices.career, 1);
  const talents: Record<string, number> = {};
  for (const talent of choices.speciesTalents) {
    talents[talent] = 1;
  }
  if (choices.careerTalent !== null) {
    talents[choices.careerTalent] = (talents[choices.careerTalent] ?? 0) + 1;
  }

  return new Character({
    id: NEW_ID,
    edition: "5e",
    source: defaultSource(),
    name: choices.name,
    species: choices.species,
    career: { id: choices.career.id, number: 1 },
    description: choices.description,
    notes: choices.notes,
    fate: fate + choices.bonusFate,
    fortune: fortune + choices.bonusFortune,
    status: status,
    standing: standing,
    brass: choices.coins[0],
    silver: choices.coins[1],
    gold: choices.coins[2],
    attributeRolls: sumAttributes(choices.attributeRolls, choices.attributePoints),
    carriedItems: mergeEntries([...choices.classTrappings, ...choices.careerTrappings.carried]),
    storedItems: choices.careerTrappings.stored,
    skills: applyCareerSkillAdvances5e(choices.speciesSkills, choices.careerSkillAdvances),
    talents: talents,
    careerTicks: choices.bonusTicks,
  });
}
