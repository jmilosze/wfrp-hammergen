// 5e Advancement XP costs (p. 191).
// 5e Advancement XP costs (p. 191). Advances are stored as points (Q-ADV); one Advance is +5.
export const ADVANCE_POINTS_5E = 5;

export const TALENT_COST_5E = 100;

// Spent on the Advance Career Endeavour to move up one career level (p. 196).
export const CAREER_LEVEL_COST_5E = 100;

// Cost of the next Advance, by the number of Advances already taken (+5 up to +75).
const CHARACTERISTIC_COST_TABLE = [125, 175, 250, 350, 500, 700, 950, 1300, 1800, 2550, 3600, 5025, 6950, 9000, 11250];

const SKILL_COST_TABLE = [50, 75, 100, 150, 250, 400, 600, 850, 1200, 1700, 2500, 3500, 4750, 6500, 8500];

function advanceCost(currentPoints: number, costTable: number[]): number {
  const taken = Math.floor(currentPoints / ADVANCE_POINTS_5E);
  return costTable[Math.min(taken, costTable.length - 1)];
}

export function characteristicCost5e(currentPoints: number): number {
  return advanceCost(currentPoints, CHARACTERISTIC_COST_TABLE);
}

export function skillCost5e(currentPoints: number): number {
  return advanceCost(currentPoints, SKILL_COST_TABLE);
}
