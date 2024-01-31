export function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function diceRoll(sides: number, rolls: number): number {
  let sumOfRolls = 0;
  for (let i = 0; i < rolls; ++i) {
    sumOfRolls += Math.floor(Math.random() * sides) + 1;
  }
  return sumOfRolls;
}

export function rollInTable<T>(sides: number, rolls: number, table: [T, number, number][]): T {
  const roll = diceRoll(sides, rolls);
  for (const element of table) {
    if (roll >= element[1] && roll < element[2]) {
      return element[0];
    }
  }
  throw new Error(`invalid table ${table}`);
}
