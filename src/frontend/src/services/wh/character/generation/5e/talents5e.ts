// 5e talents at creation: the species talents and the level 1 career talent, picked at random or in guided creation.
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { Talent } from "@/services/wh/content/talent.ts";
import { Attributes, zeroAttributes } from "@/services/wh/core/attributes.ts";
import { availableMembers, EntityGroupMap, expandGroups } from "@/services/wh/character/generation/shared/groups.ts";
import {
  calculateMaxTalentRanks,
  RANDOM_TALENT,
  RandomTalents,
  rollRandomTalent,
  speciesTalentEntries,
} from "@/services/wh/character/generation/shared/talents.ts";

// The talents of a list that the character can take a rank of: those below their maximum rank.
function eligibleTalents(
  availableTalents: string[],
  talents: Record<string, number>,
  maxRanks: Record<string, number>,
): string[] {
  return availableTalents.filter((id) => id in maxRanks && (talents[id] ?? 0) < maxRanks[id]);
}

// careerTalentOptions5e lists the talents the player can take from a career level's talents: a group means any of its
// members.
export function careerTalentOptions5e(
  careerTalents: string[],
  talentGroupMap: EntityGroupMap,
  talents: Record<string, number>,
  maxRanks: Record<string, number>,
): string[] {
  return eligibleTalents(expandGroups(careerTalents, talentGroupMap), talents, maxRanks);
}

// randomCareerTalent5e picks a random talent that is below its maximum rank; null when there is none.
export function randomCareerTalent5e(
  availableTalents: string[],
  talents: Record<string, number>,
  maxRanks: Record<string, number>,
  selectRandomFn: SelectRandomFn,
): string | null {
  const eligible = eligibleTalents(availableTalents, talents, maxRanks);
  return eligible.length === 0 ? null : selectRandomFn(eligible);
}

// Takes one rank of a random talent that is below its maximum rank; returns false when there is none.
export function takeCareerTalent5e(
  talents: Record<string, number>,
  availableTalents: string[],
  maxRanks: Record<string, number>,
  selectRandomFn: SelectRandomFn,
): boolean {
  const talent = randomCareerTalent5e(availableTalents, talents, maxRanks, selectRandomFn);
  if (talent === null) {
    return false;
  }
  talents[talent] = (talents[talent] ?? 0) + 1;
  return true;
}

// The talents step of guided creation.
export interface GuidedTalents5e {
  // The option taken of each species talent entry with a choice ("A or B"), by entry index.
  options: Record<number, string>;
  // The member picked for each entry settled to a group, by entry index.
  members: Record<number, string>;
  // The talents the Random Talents rolls gave, one per random entry in the species' order. Kept until Start over; a roll
  // that clashes with a talent the character has from elsewhere is rolled again (p. 23).
  randomRolls: string[];
  // The level 1 career talent; null until picked.
  career: string | null;
}

export function newGuidedTalents5e(): GuidedTalents5e {
  return { options: {}, members: {}, randomRolls: [], career: null };
}

// What the talents step works with: the species' talent entries, the Random Talents table, the career's level 1
// talents, the talent groups and list, and the characteristics (for maximum ranks; null until settled).
export interface TalentsContext5e {
  speciesTalents: string[];
  randomTalents: RandomTalents;
  level1Talents: string[];
  talentGroupMap: EntityGroupMap;
  talentList: Talent[];
  attributes: Attributes | null;
}

// A species talent entry as settled so far. kind: what its option is (null while a choice is not made); talent: the
// talent it gives, null while unsettled (a member not picked, a random entry not rolled or whose roll clashes).
export interface SpeciesTalentRow5e {
  index: number;
  options: string[];
  option: string | null;
  kind: "talent" | "group" | "random" | null;
  talent: string | null;
  // For a random entry, its place among the species' random entries (the index into randomRolls).
  randomIndex: number | null;
}

export function speciesTalentRows5e(g: GuidedTalents5e, context: TalentsContext5e): SpeciesTalentRow5e[] {
  const entries = speciesTalentEntries(context.speciesTalents);
  let randomCount = 0;
  const rows: SpeciesTalentRow5e[] = entries.map((entry, index) => {
    const option = entry.options.length === 1 ? entry.options[0] : (g.options[index] ?? null);
    if (option === null) {
      return { index, options: entry.options, option, kind: null, talent: null, randomIndex: null };
    } else if (option === RANDOM_TALENT) {
      const randomIndex = randomCount++;
      return { index, options: entry.options, option, kind: "random", talent: null, randomIndex };
    } else if (option in context.talentGroupMap) {
      return {
        index,
        options: entry.options,
        option,
        kind: "group",
        talent: g.members[index] ?? null,
        randomIndex: null,
      };
    }
    return { index, options: entry.options, option, kind: "talent", talent: option, randomIndex: null };
  });
  // Random entries take their rolls once the rest is known, so a roll that clashes shows as not rolled.
  const taken = rows.flatMap((x) => (x.talent === null ? [] : [x.talent]));
  for (const row of rows) {
    const rolled = row.randomIndex === null ? undefined : g.randomRolls[row.randomIndex];
    if (rolled !== undefined && !taken.includes(rolled)) {
      row.talent = rolled;
      taken.push(rolled);
    }
  }
  return rows;
}

// The species talents settled so far.
export function guidedSpeciesTalents5e(rows: SpeciesTalentRow5e[]): string[] {
  return rows.flatMap((x) => (x.talent === null ? [] : [x.talent]));
}

// Random Talents are rolled once every other entry is settled (Q4), so a roll never takes a talent still to be chosen.
export function canRollRandomTalents5e(rows: SpeciesTalentRow5e[]): boolean {
  return rows.every((x) => x.kind === "random" || x.talent !== null);
}

// rollGuidedRandomTalent5e rolls for a random entry, re-rolling talents the character already has; the result
// replaces any earlier roll of that entry that clashes.
export function rollGuidedRandomTalent5e(
  g: GuidedTalents5e,
  context: TalentsContext5e,
  randomIndex: number,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): GuidedTalents5e {
  const taken = guidedSpeciesTalents5e(speciesTalentRows5e(g, context));
  const rolled = rollRandomTalent(
    context.randomTalents,
    taken,
    g.randomRolls.filter((_, i) => i !== randomIndex),
    context.talentGroupMap,
    rollDiceFn,
    selectRandomFn,
  );
  if (rolled === null) {
    return g;
  }
  const randomRolls = [...g.randomRolls];
  randomRolls[randomIndex] = rolled;
  return { ...g, randomRolls: randomRolls };
}

// The members a group entry can take: not a talent the character has from another entry.
export function speciesGroupMembers5e(row: SpeciesTalentRow5e, rows: SpeciesTalentRow5e[], context: TalentsContext5e) {
  const others = guidedSpeciesTalents5e(rows.filter((x) => x.index !== row.index));
  return row.option === null ? [] : availableMembers(context.talentGroupMap, row.option, others);
}

function speciesTalentRanks(rows: SpeciesTalentRow5e[]): Record<string, number> {
  return Object.fromEntries(guidedSpeciesTalents5e(rows).map((id) => [id, 1]));
}

// The level 1 career talents the player can take a rank of, given the species talents and the characteristics.
export function careerTalentChoices5e(g: GuidedTalents5e, context: TalentsContext5e): string[] {
  if (context.attributes === null) {
    return [];
  }
  const talents = speciesTalentRanks(speciesTalentRows5e(g, context));
  const maxRanks = calculateMaxTalentRanks(talents, context.talentList, context.attributes, zeroAttributes());
  return careerTalentOptions5e(context.level1Talents, context.talentGroupMap, talents, maxRanks);
}

// fitGuidedTalents5e keeps the picks that still fit (D8): options of the species' entries, members of their groups not
// taken elsewhere, and a career talent still open. Random Talents rolls are kept.
export function fitGuidedTalents5e(g: GuidedTalents5e, context: TalentsContext5e): GuidedTalents5e {
  const entries = speciesTalentEntries(context.speciesTalents);
  const options = Object.fromEntries(
    Object.entries(g.options).filter(([i, option]) => entries[Number(i)]?.options.includes(option)),
  );
  const withOptions = { ...g, options: options, members: {} };
  const rows = speciesTalentRows5e(withOptions, context);
  const members = Object.fromEntries(
    Object.entries(g.members).filter(([i, member]) => {
      const row = rows[Number(i)];
      return row?.kind === "group" && speciesGroupMembers5e(row, rows, context).includes(member);
    }),
  );
  const fitted = { ...withOptions, members: members };
  const career = g.career !== null && careerTalentChoices5e(fitted, context).includes(g.career) ? g.career : null;
  return { ...fitted, career: career };
}

// guidedTalentsValid5e tells whether the step is settled: every species entry gives its talent, and a career talent is
// picked when there is one to take.
export function guidedTalentsValid5e(g: GuidedTalents5e, context: TalentsContext5e): boolean {
  const rows = speciesTalentRows5e(g, context);
  const choices = careerTalentChoices5e(g, context);
  return (
    context.attributes !== null &&
    rows.every((x) => x.talent !== null) &&
    (g.career === null ? choices.length === 0 : choices.includes(g.career))
  );
}
