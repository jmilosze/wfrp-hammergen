const SKILL_COST_TABLE = [10, 15, 20, 30, 40, 60, 80, 110, 140, 180, 220, 270, 320, 380, 440];
const ATT_COST_TABLE = [25, 30, 40, 50, 70, 90, 120, 150, 190, 230, 280, 330, 390, 450, 520];

function advCost(currentAdv: number, costTable: number[]) {
  const bracket = Math.floor(currentAdv / 5);
  if (bracket < costTable.length - 1) {
    return costTable[bracket];
  } else {
    return costTable[costTable.length - 1];
  }
}

export function skillCost(currentAdv: number): number {
  return advCost(currentAdv, SKILL_COST_TABLE);
}

export function attCost(currentAdv: number): number {
  return advCost(currentAdv, ATT_COST_TABLE);
}
