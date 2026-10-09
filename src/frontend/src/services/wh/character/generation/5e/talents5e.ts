// 5e career talents.
import { SelectRandomFn } from "../../../../../utils/random.ts";

// Takes one rank of a random talent that is below its maximum rank; returns false when there is none.
export function takeCareerTalent5e(
  talents: Record<string, number>,
  availableTalents: string[],
  maxRanks: Record<string, number>,
  selectRandomFn: SelectRandomFn,
): boolean {
  const eligible = availableTalents.filter((id) => id in maxRanks && (talents[id] ?? 0) < maxRanks[id]);
  if (eligible.length === 0) {
    return false;
  }
  const talent = selectRandomFn(eligible);
  talents[talent] = (talents[talent] ?? 0) + 1;
  return true;
}
