export type SelectRandomFn = <T>(array: T[]) => T;
export type RollInTableFn = <T>(sides: number, rolls: number, table: [T, number, number][]) => T;
export type RollDiceFn = (sides: number, rolls: number) => number;

export function selectRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function rollInTable<T>(sides: number, rolls: number, table: [T, number, number][]): T {
  const roll = rollDice(sides, rolls);
  for (const element of table) {
    if (roll >= element[1] && roll < element[2]) {
      return element[0];
    }
  }
  throw new Error(`invalid table ${table}`);
}

export function rollDice(sides: number, rolls: number): number {
  let sumOfRolls = 0;
  for (let i = 0; i < rolls; ++i) {
    sumOfRolls += Math.floor(Math.random() * sides) + 1;
  }
  return sumOfRolls;
}

export function selectWeighted<T>(
  items: T[],
  getWeight: (item: T) => number,
  rollDiceFn: RollDiceFn = rollDice,
): T {
  if (items.length === 0) {
    throw new Error("cannot select from empty array");
  }

  const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);
  let roll = rollDiceFn(totalWeight, 1);

  for (const item of items) {
    roll -= getWeight(item);
    if (roll <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}
