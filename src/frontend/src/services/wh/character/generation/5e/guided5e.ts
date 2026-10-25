// 5e guided creation: its steps, a creation in progress, when each step is done, and the check after a
// change. The rules of each step are in its topic file (species5e.ts, career5e.ts…); a finished creation becomes a
// CreationChoices5e.
import {
  Career,
  getCareerAttributesByLevel,
  getCareerSkillsByLevel,
  getCareerTalentsByLevel,
} from "@/services/wh/content/career.ts";
import { Skill } from "@/services/wh/content/skill.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { Item } from "@/services/wh/content/item.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Attributes, sumAttributes, zeroAttributes } from "@/services/wh/core/attributes.ts";
import { Character } from "@/services/wh/character/character.ts";
import { getFateFortune5e } from "./fate5e.ts";
import { isEqualEntity } from "@/utils/equal.ts";
import { GenerationProps5e } from "@/services/wh/character/generation/shared/generationProps.ts";
import { resolveEntityGroups } from "@/services/wh/character/generation/shared/groups.ts";
import { getSpeciesAttributes5e } from "@/services/wh/character/rules/rules5e.ts";
import { CreationChoices5e } from "./creation5e.ts";
import { pickedSpecies5e, SpeciesPick5e, SpeciesRoll5e, speciesFortuneBonus5e } from "./species5e.ts";
import { CareerPick5e, CareerRoll5e, canKeepCareerRoll5e, careerBonusTrappings5e, pickedCareer5e } from "./career5e.ts";
import {
  characteristicRolls5e,
  characteristicsValid5e,
  GuidedCharacteristics5e,
  newGuidedCharacteristics5e,
  pointsFit5e,
} from "./characteristics5e.ts";
import {
  fitGuidedSkills5e,
  GuidedSkills5e,
  guidedSkillsValid5e,
  guidedSpeciesSkills5e,
  newGuidedSkills5e,
  SkillsContext5e,
} from "./skills5e.ts";
import {
  fitGuidedTalents5e,
  GuidedTalents5e,
  guidedTalentsValid5e,
  guidedSpeciesTalents5e,
  newGuidedTalents5e,
  speciesTalentRows5e,
  TalentsContext5e,
} from "./talents5e.ts";
import {
  fitGuidedTrappings5e,
  GuidedTrappings5e,
  guidedTrappings5e,
  newGuidedTrappings5e,
  TrappingsContext5e,
} from "./trappings5e.ts";
import { classTrappingEntries } from "@/services/wh/character/generation/shared/trappings.ts";
import { detailsNotes5e, GuidedDetails5e, guidedDetailsValid5e, newGuidedDetails5e } from "./details5e.ts";

export type GuidedStep5e =
  "species" | "career" | "characteristics" | "skills" | "talents" | "trappings" | "details" | "summary";

// The book's steps (pp. 22–42), with its step 5 split into talents, trappings and details, and the species skills and
// talents next to the career ones.
export const GUIDED_STEPS_5E: { id: GuidedStep5e; title: string }[] = [
  { id: "species", title: "Species" },
  { id: "career", title: "Class and career" },
  { id: "characteristics", title: "Characteristics" },
  { id: "skills", title: "Skills" },
  { id: "talents", title: "Talents" },
  { id: "trappings", title: "Trappings and wealth" },
  { id: "details", title: "Details" },
  { id: "summary", title: "Summary" },
];

// The 5e content guided creation works with (5e only, as the generator).
export interface GuidedContext5e {
  careers: Career[];
  skills: Skill[];
  talents: Talent[];
  items: Item[];
  generationProps: GenerationProps5e;
}

// A creation in progress. Rolls are kept until Start over, so going back never gives a new first roll.
export interface GuidedState5e {
  step: GuidedStep5e;
  // Steps whose choice an earlier change cleared, until the player opens them.
  attention: GuidedStep5e[];
  speciesRolls: SpeciesRoll5e[];
  species: SpeciesPick5e | null;
  careerRolls: CareerRoll5e[];
  career: CareerPick5e | null;
  characteristics: GuidedCharacteristics5e;
  skills: GuidedSkills5e;
  talents: GuidedTalents5e;
  trappings: GuidedTrappings5e;
  details: GuidedDetails5e;
}

export function newGuidedState5e(): GuidedState5e {
  return {
    step: "species",
    attention: [],
    speciesRolls: [],
    species: null,
    careerRolls: [],
    career: null,
    characteristics: newGuidedCharacteristics5e(),
    skills: newGuidedSkills5e(),
    talents: newGuidedTalents5e(),
    trappings: newGuidedTrappings5e(),
    details: newGuidedDetails5e(),
  };
}

export function guidedSpecies5e(state: GuidedState5e): SpeciesWithRegion | null {
  return state.species === null ? null : pickedSpecies5e(state.speciesRolls, state.species);
}

// The career taken, from the careers the wizard offers; null when none is taken.
export function guidedCareer5e(state: GuidedState5e, context: GuidedContext5e): Career | null {
  if (state.career === null) {
    return null;
  }
  const id = pickedCareer5e(state.careerRolls, state.career);
  return context.careers.find((x) => x.id === id) ?? null;
}

// The characteristics so far (rolls, species and creation points); null until the species and the method are settled.
export function guidedAttributes5e(state: GuidedState5e): Attributes | null {
  const species = guidedSpecies5e(state);
  const rolls = characteristicRolls5e(state.characteristics);
  return species === null || rolls === null
    ? null
    : sumAttributes(getSpeciesAttributes5e(species), rolls, state.characteristics.points);
}

// The level 1 career characteristics; none before a career is taken.
function level1Attributes(state: GuidedState5e, context: GuidedContext5e) {
  const career = guidedCareer5e(state, context);
  return career === null ? [] : getCareerAttributesByLevel(career)[0];
}

// What the skills step works with; the lists are empty while the species or the career is missing.
export function guidedSkillsContext5e(state: GuidedState5e, context: GuidedContext5e): SkillsContext5e {
  const species = guidedSpecies5e(state);
  const career = guidedCareer5e(state, context);
  return {
    speciesSkills: species === null ? [] : (context.generationProps.speciesSkills[species] ?? []),
    speciesLanguages: species === null ? [] : (context.generationProps.speciesLanguages[species] ?? []),
    level1Skills: career === null ? [] : getCareerSkillsByLevel(career)[0],
    skillGroupMap: resolveEntityGroups(context.skills),
  };
}

// What the talents step works with; the lists are empty while the species or the career is missing.
export function guidedTalentsContext5e(state: GuidedState5e, context: GuidedContext5e): TalentsContext5e {
  const species = guidedSpecies5e(state);
  const career = guidedCareer5e(state, context);
  return {
    speciesTalents: species === null ? [] : (context.generationProps.speciesTalents[species] ?? []),
    randomTalents: context.generationProps.randomTalents,
    level1Talents: career === null ? [] : getCareerTalentsByLevel(career)[0],
    talentGroupMap: resolveEntityGroups(context.talents),
    talentList: context.talents,
    attributes: guidedAttributes5e(state),
  };
}

// What the trappings step works with.
export function guidedTrappingsContext5e(state: GuidedState5e, context: GuidedContext5e): TrappingsContext5e {
  const career = guidedCareer5e(state, context);
  return {
    career: career,
    classEntries: career === null ? [] : classTrappingEntries(career, context.generationProps),
    items: context.items,
    // The career roll's level 2 trappings, as many as level 2 has.
    bonusTrappings:
      state.career === null || career === null
        ? 0
        : Math.min(
            careerBonusTrappings5e(state.careerRolls, state.career),
            career.level2.trappings.length + career.level2.money.length,
          ),
  };
}

// Oh Fickle Fate (p. 40): +1 Fate for keeping the first roll of the species, the career and the characteristics (A).
export function fickleFateBonus5e(state: GuidedState5e): number {
  const firstSpecies = state.species !== null && speciesFortuneBonus5e(state.speciesRolls, state.species) === 1;
  const firstCareer = state.career !== null && careerBonusTrappings5e(state.careerRolls, state.career) === 2;
  return firstSpecies && firstCareer && state.characteristics.method === "inOrder" ? 1 : 0;
}

// completeChoices5e gives the choices once every one is made, null before.
export function completeChoices5e(state: GuidedState5e, context: GuidedContext5e): CreationChoices5e | null {
  const species = guidedSpecies5e(state);
  const career = guidedCareer5e(state, context);
  const attributeRolls = characteristicRolls5e(state.characteristics);
  const trappings = guidedTrappings5e(state.trappings, guidedTrappingsContext5e(state, context));
  if (
    state.species === null ||
    species === null ||
    career === null ||
    attributeRolls === null ||
    !guidedStepDone5e("characteristics", state, context) ||
    !guidedStepDone5e("skills", state, context) ||
    !guidedStepDone5e("talents", state, context) ||
    trappings === null ||
    !guidedDetailsValid5e(state.details)
  ) {
    return null;
  }
  return {
    species,
    career,
    name: state.details.name.trim(),
    description: state.details.description,
    notes: detailsNotes5e(state.details),
    attributeRolls,
    attributePoints: state.characteristics.points,
    speciesSkills: guidedSpeciesSkills5e(state.skills, guidedSkillsContext5e(state, context)),
    careerSkillAdvances: state.skills.advances,
    speciesTalents: guidedSpeciesTalents5e(speciesTalentRows5e(state.talents, guidedTalentsContext5e(state, context))),
    careerTalent: state.talents.career,
    ...trappings,
    bonusFortune: speciesFortuneBonus5e(state.speciesRolls, state.species),
    bonusFate: fickleFateBonus5e(state),
  };
}

// guidedStepDone5e tells whether a step has all its choices; the summary is done once every choice is made.
export function guidedStepDone5e(step: GuidedStep5e, state: GuidedState5e, context: GuidedContext5e): boolean {
  switch (step) {
    case "species":
      return state.species !== null;
    case "career":
      return guidedCareer5e(state, context) !== null;
    case "characteristics":
      return characteristicsValid5e(state.characteristics, level1Attributes(state, context));
    case "skills":
      return (
        guidedCareer5e(state, context) !== null &&
        guidedSkillsValid5e(state.skills, guidedSkillsContext5e(state, context))
      );
    case "talents":
      return (
        guidedCareer5e(state, context) !== null &&
        guidedTalentsValid5e(state.talents, guidedTalentsContext5e(state, context))
      );
    case "trappings":
      return guidedTrappings5e(state.trappings, guidedTrappingsContext5e(state, context)) !== null;
    case "details":
      return guidedDetailsValid5e(state.details);
    case "summary":
      return completeChoices5e(state, context) !== null;
  }
}

// revalidate5e is the check after a change: every later choice that no longer fits the earlier ones is cleared,
// and its step marked for attention until the player opens it. Rolls are never cleared.
export function revalidate5e(state: GuidedState5e, context: GuidedContext5e): void {
  const species = guidedSpecies5e(state);
  const cleared: GuidedStep5e[] = [];

  // A career rolled for another species, or one not open to the species, no longer fits.
  const career = guidedCareer5e(state, context);
  if (
    state.career !== null &&
    (species === null ||
      career === null ||
      ("fromRoll" in state.career && !canKeepCareerRoll5e(state.careerRolls, state.career.fromRoll, species)) ||
      !career.allowedForSpeciesWithRegion(species))
  ) {
    state.career = null;
    cleared.push("career");
  }

  // Creation points on characteristics the career no longer has.
  const c = state.characteristics;
  if (c.method !== null && !pointsFit5e(c.points, c.method, level1Attributes(state, context))) {
    c.points = newGuidedCharacteristics5e().points;
    cleared.push("characteristics");
  }

  // Skill picks that no longer fit the species or the career.
  const skills = fitGuidedSkills5e(state.skills, guidedSkillsContext5e(state, context));
  if (!isEqualEntity(skills, state.skills)) {
    state.skills = skills;
    cleared.push("skills");
  }

  // Talent picks that no longer fit the species, the career or the characteristics.
  const talents = fitGuidedTalents5e(state.talents, guidedTalentsContext5e(state, context));
  if (!isEqualEntity(talents, state.talents)) {
    state.talents = talents;
    cleared.push("talents");
  }

  // Level 2 bonus trappings beyond what the career roll now gives.
  const trappings = fitGuidedTrappings5e(state.trappings, guidedTrappingsContext5e(state, context));
  if (trappings !== state.trappings) {
    state.trappings = trappings;
    cleared.push("trappings");
  }

  // Assigned only when it changes, as the wizard runs this check after every change.
  const attention = [...new Set([...state.attention, ...cleared])].filter((step) => step !== state.step);
  if (attention.join() !== state.attention.join()) {
    state.attention = attention;
  }
}

// Whether anything was rolled or chosen yet (the species step comes first).
export function guidedStarted5e(state: GuidedState5e): boolean {
  return state.speciesRolls.length > 0 || state.species !== null;
}

// The character so far, for the preview: species, characteristics, talents (their modifiers count, e.g. Hardy for
// Wounds) and Fate and Fortune with the bonuses earned so far; null until the species is settled.
export function guidedPreview5e(state: GuidedState5e, context: GuidedContext5e): Character | null {
  const species = guidedSpecies5e(state);
  if (state.species === null || species === null) {
    return null;
  }
  const talents: Record<string, number> = {};
  for (const id of guidedSpeciesTalents5e(speciesTalentRows5e(state.talents, guidedTalentsContext5e(state, context)))) {
    talents[id] = 1;
  }
  if (state.talents.career !== null) {
    talents[state.talents.career] = (talents[state.talents.career] ?? 0) + 1;
  }
  const rolls = characteristicRolls5e(state.characteristics);
  const { fate, fortune } = getFateFortune5e(species);
  const character = new Character({
    edition: "5e",
    species: species,
    attributeRolls: rolls === null ? zeroAttributes() : sumAttributes(rolls, state.characteristics.points),
    talents: talents,
    fate: fate + fickleFateBonus5e(state),
    fortune: fortune + speciesFortuneBonus5e(state.speciesRolls, state.species),
  });
  character.hydrateTalentModifiers(context.talents);
  return character;
}
