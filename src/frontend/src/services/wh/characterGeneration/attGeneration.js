import { diceRoll } from "../../../utils/randomUtils";
import { attCost } from "./expCost";
import { racialAttributes, attributes } from "../attributes";
import * as c from "../characterConstants";

export function speciesAtts(speciesWithRegion) {
  if (c.HUMAN_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.human));
  } else if (c.HALFLING_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.halfling));
  } else if (c.DWARF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.dwarf));
  } else if (c.HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.elf));
  } else if (c.GNOME_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.gnome));
  } else if (c.OGRE_LIST.includes(speciesWithRegion)) {
    return JSON.parse(JSON.stringify(racialAttributes.ogre));
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

export function getBaseAttributes(speciesWithRegion, rolls) {
  const base = JSON.parse(JSON.stringify(rolls));
  let racial = speciesAtts(speciesWithRegion);
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
