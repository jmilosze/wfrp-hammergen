import { Talent } from "../talent.ts";
import {
  AttributeName,
  Attributes,
  copyAttributes,
  getAttributes,
  getAttributeValue,
  multiplyAttributes,
  sumAttributes,
} from "../attributes.ts";
import { IdNumber } from "../common.ts";

export function getTalentGroups(listOfTalents: Talent[]): Record<string, string[]> {
  const resolvedGroups: Record<string, string[]> = {};

  for (const talent of listOfTalents) {
    if (talent.group.length > 0) {
      for (const group of talent.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(talent.id);
        } else {
          resolvedGroups[group] = [talent.id];
        }
      }
    }
  }
  return resolvedGroups;
}

export function getAllTalentsMaxRank(
  selectedTalents: IdNumber[],
  listOfTalents: Talent[],
  baseAtts: Attributes,
  advances: Attributes,
) {
  const attributes = sumAttributes(baseAtts, advances, getTalentAtts(selectedTalents, listOfTalents));

  const talentsRank: Record<string, number> = {};
  for (const talent of listOfTalents) {
    talentsRank[talent.id] = getMaxRank(talent, attributes);
  }
  return talentsRank;
}

export function getTalentAtts(selectedTalents: IdNumber[], listOfTalents: Talent[]): Attributes {
  const attributes = getAttributes();

  for (const talent of listOfTalents) {
    for (const idNumber of selectedTalents) {
      if (talent.id === idNumber.id) {
        sumAttributes(attributes, multiplyAttributes(idNumber.number, copyAttributes(talent.modifiers.attributes)));
      }
    }
  }
  return attributes;
}

function getMaxRank(talent: Talent, atts: Attributes): number {
  if (talent.attribute !== AttributeName.None && talent.attribute !== AttributeName.Various) {
    return talent.maxRank + Math.floor(getAttributeValue(talent.attribute, atts) / 10);
  } else {
    return talent.maxRank;
  }
}
