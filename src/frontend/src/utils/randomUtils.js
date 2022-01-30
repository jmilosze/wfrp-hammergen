export function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function diceRoll(sides, rolls) {
  let sumOfRolls = 0;
  for (let i = 0; i < rolls; ++i) {
    sumOfRolls += Math.floor(Math.random() * sides) + 1;
  }
  return sumOfRolls;
}

export function rollInTable(sides, rolls, table) {
  let roll = diceRoll(sides, rolls);
  for (let element of table) {
    if (roll >= element[1] && roll < element[2]) {
      return element[0];
    }
  }
}
