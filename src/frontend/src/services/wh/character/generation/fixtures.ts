import { copyCareerLevel, Career, StatusTier, zeroCareerLevel } from "../../content/career.ts";
import { AttributeName } from "../../core/attributes.ts";

// Test fixtures shared by the 4e and 5e generation tests.

export const selectFirst = <T>(array: T[]): T => array[0];

export function ids(prefix: string, from: number, to: number): string[] {
  const result = [];
  for (let i = from; i <= to; ++i) {
    result.push(`${prefix}${i}`);
  }
  return result;
}

// Level 1: WS, BS, S; level 2: T; level 3: I; level 4: Ag. Ten level 1 skills, two talents per level.
export function testCareer(): Career {
  const level = (attributes: AttributeName[], skills: string[], talents: string[], status: StatusTier) => ({
    ...copyCareerLevel(zeroCareerLevel),
    exists: true,
    status,
    standing: 3 as const,
    attributes,
    skills: new Set(skills),
    talents: new Set(talents),
  });
  return new Career({
    id: "career1",
    careerClass: 0,
    level1: level(
      [AttributeName.WS, AttributeName.BS, AttributeName.S],
      ids("s", 1, 10),
      ["t1a", "t1b"],
      StatusTier.Brass,
    ),
    level2: level([AttributeName.T], ids("s", 11, 16), ["t2a", "t2b"], StatusTier.Silver),
    level3: level([AttributeName.I], ids("s", 17, 20), ["t3a", "t3b"], StatusTier.Silver),
    level4: level([AttributeName.Ag], ids("s", 21, 22), ["t4a", "t4b"], StatusTier.Gold),
  });
}

export function sumValues(values: Record<string, number>): number {
  return Object.values(values).reduce((total, x) => total + x, 0);
}
