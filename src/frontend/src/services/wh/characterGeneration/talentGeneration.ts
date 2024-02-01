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
import { SelectRandomFn } from "../../../utils/randomUtils.ts";

export function getTalentGroups(listOfWhTalents: Talent[]): Record<string, string[]> {
  const resolvedGroups: Record<string, string[]> = {};

  for (const talent of listOfWhTalents) {
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
  listOfWhTalents: Talent[],
  baseAtts: Attributes,
  advances: Attributes,
) {
  const attributes = sumAttributes(baseAtts, advances, getTalentAtts(selectedTalents, listOfWhTalents));

  const talentsRank: Record<string, number> = {};
  for (const talent of listOfWhTalents) {
    talentsRank[talent.id] = getMaxRank(talent, attributes);
  }
  return talentsRank;
}

export function getTalentAtts(selectedTalents: IdNumber[], listOfWhTalents: Talent[]): Attributes {
  const attributes = getAttributes();

  for (const talent of listOfWhTalents) {
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

function generateAvailableTalents(
  talents: string[],
  talentGroups: Record<string, string[]>,
  selectRandomFn: SelectRandomFn,
): string[] {
  const talentGroupsCopy: Record<string, string[]> = JSON.parse(JSON.stringify(talentGroups));
  const availTalents: string[] = [];

  for (const talent of talents) {
    if (talent in talentGroupsCopy) {
      if (talentGroupsCopy[talent].length > 0) {
        const newTalent = selectRandomFn(talentGroupsCopy[talent]);
        const indexToRemove = talentGroupsCopy[talent].indexOf(newTalent);
        talentGroupsCopy[talent].splice(indexToRemove, 1);
        availTalents.push(newTalent);
      }
    } else {
      availTalents.push(talent);
    }
  }

  return [...new Set(availTalents)];
}
