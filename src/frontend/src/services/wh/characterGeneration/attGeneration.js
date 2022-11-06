import { diceRoll } from "../../../utils/randomUtils";
import { attCost } from "./expCost";
import { racialAttributes, attributes } from "../character";

export function speciesAtts(species) {
  if (species === 0) {
    return JSON.parse(JSON.stringify(racialAttributes.human));
  } else if (species === 1) {
    return JSON.parse(JSON.stringify(racialAttributes.halfling));
  } else if (species === 2) {
    return JSON.parse(JSON.stringify(racialAttributes.dwarf));
  } else if (species === 5) {
    return JSON.parse(JSON.stringify(racialAttributes.gnome));
  } else if (species === 3 || species === 4) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else {
    return JSON.parse(JSON.stringify(racialAttributes.none));
  }
}

export function generateRolls() {
  let rolls = JSON.parse(JSON.stringify(racialAttributes.none));
  for (let key of Object.keys(rolls)) {
    rolls[key] = diceRoll(10, 2);
  }
  return rolls;
}

export function getBaseAttributes(species, rolls) {
  const base = JSON.parse(JSON.stringify(rolls));
  let racial = speciesAtts(species);
  for (let [key, value] of Object.entries(base)) {
    base[key] = value + racial[key];
  }
  return base;
}

export function generateAdv(careerAtts, attPoints, currentAdv) {
  let adv = JSON.parse(JSON.stringify(currentAdv));
  let cost = 0;
  for (let i = 0; i < attPoints; ++i) {
    let advAtt = careerAtts[diceRoll(careerAtts.length, 1) - 1];
    cost += attCost(currentAdv[attributes[advAtt]]);
    adv[attributes[advAtt]] += 1;
  }
  return [adv, cost];
}

export function fillUpAdv(careerAtts, fillUpTo, currentAdv, currentCost) {
  let adv = JSON.parse(JSON.stringify(currentAdv));
  let cost = currentCost;

  for (let advAtt of careerAtts) {
    while (adv[attributes[advAtt]] < fillUpTo) {
      adv[attributes[advAtt]] += 1;
      cost += attCost(currentAdv[attributes[advAtt]]);
    }
  }

  return [adv, cost];
}
