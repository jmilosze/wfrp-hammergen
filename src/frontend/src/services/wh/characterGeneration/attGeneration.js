import { diceRoll } from "../../../utils/randomUtils";
import { attCost } from "./expCost";
import { racialAttributes, attributes } from "../attributes";

export function generateRolls() {
  let rolls = JSON.parse(JSON.stringify(racialAttributes.none));
  for (let key of Object.keys(rolls)) {
    rolls[key] = diceRoll(10, 2);
  }
  return rolls;
}

export function generateAdv(careerAtts, attPoints, currentAdv) {
  let adv = JSON.parse(JSON.stringify(currentAdv));
  let cost = 0;
  for (let i = 0; i < attPoints; ++i) {
    let advAtt = careerAtts[diceRoll(careerAtts.length, 1) - 1];
    cost += attCost(adv[attributes[advAtt]]);
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
      cost += attCost(adv[attributes[advAtt]]);
    }
  }

  return [adv, cost];
}
