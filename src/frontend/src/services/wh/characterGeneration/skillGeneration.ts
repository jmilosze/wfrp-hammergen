import { Skill } from "../skill.ts";
import { SelectRandomFn } from "../../../utils/randomUtils.ts";
import { skillCost } from "./expCost.ts";

const SKILL_ADV = [40, 30, 20, 10];
const LEVEL_1_MAX_ADV_PER_SKILL = 10;
const SKILL_FILL_UP_SKILLS = 8;
const SKILL_FILL_UP_PER_LVL = 5;

export function resolveSkillGroups(listOfWhSkills: Skill[]): Record<string, string[]> {
  const resolvedGroups: Record<string, string[]> = {};

  for (const skill of listOfWhSkills) {
    if (skill.group.length > 0) {
      for (const group of skill.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(skill.id);
        } else {
          resolvedGroups[group] = [skill.id];
        }
      }
    }
  }
  return resolvedGroups;
}

export function generateSpeciesSkills(
  speciesSkills: string[],
  resolvedSkillGroups: Record<string, string[]>,
  selectRandomFn: SelectRandomFn,
): Record<string, number> {
  const generatedSkills: Record<string, number> = {};
  let skillList = [...new Set(speciesSkills)];

  for (const advances of [3, 5]) {
    for (let i = 0; i < 3; ++i) {
      const newSkill = selectRandomFn(skillList);
      skillList = skillList.filter((x) => x !== newSkill);

      if (newSkill in resolvedSkillGroups) {
        const newSubSkill = selectRandomFn(resolvedSkillGroups[newSkill]);
        generatedSkills[newSubSkill] = advances;
      } else {
        generatedSkills[newSkill] = advances;
      }
    }
  }
  return generatedSkills;
}

function genAvailSkills(
  resolvedSkillGroups: Record<string, string[]>,
  careerSkills: [string[], string[], string[], string[]],
  selectRandomFn: SelectRandomFn,
): [string[], string[], string[], string[]] {
  const skillGroups: Record<string, string[]> = JSON.parse(JSON.stringify(resolvedSkillGroups));
  const availSkills: [Set<string>, Set<string>, Set<string>, Set<string>] = [
    new Set(),
    new Set(),
    new Set(),
    new Set(),
  ];

  for (let lvl = 0; lvl < 4; ++lvl) {
    for (const skill of careerSkills[lvl]) {
      if (skill in skillGroups) {
        if (skillGroups[skill].length > 0) {
          const newSkill = selectRandomFn(skillGroups[skill]);
          const indexToRemove = skillGroups[skill].indexOf(newSkill);
          skillGroups[skill].splice(indexToRemove, 1);
          availSkills[lvl].add(newSkill);
        }
      } else {
        availSkills[lvl].add(skill);
      }
    }
  }

  return [
    Array.from(availSkills[0]),
    Array.from(availSkills[1]),
    Array.from(availSkills[2]),
    Array.from(availSkills[3]),
  ];
}

function fillUpLvlSkill(
  previousSkills: Record<string, number>,
  availSkills: string[],
  fillUpTo: number,
  numSkills: number,
  currentCost: number,
  selectRandomFn: SelectRandomFn,
): [Record<string, number>, number] {
  const skills: Record<string, number> = JSON.parse(JSON.stringify(previousSkills));
  const availSkillArray: string[] = [...new Set(availSkills)];
  let cost = currentCost;

  for (let skillNo = 0; skillNo < numSkills; ++skillNo) {
    if (availSkillArray.length < 1) {
      break;
    }

    const skill = selectRandomFn(availSkillArray);
    availSkillArray.splice(availSkillArray.indexOf(skill), 1);

    for (let adv = 0; adv < fillUpTo; ++adv) {
      if (skill in skills && skills[skill] >= fillUpTo) {
        break;
      }

      if (skill in skills) {
        cost += skillCost(skills[skill]);
        skills[skill] += 1;
      } else {
        cost += skillCost(0);
        skills[skill] = 1;
      }
    }
  }
  return [skills, cost];
}

function genLvlSkill(
  previousSkills: Record<string, number>,
  availSkills: string[],
  advNumber: number,
  maxAdvPerSkill: number,
  currentCost: number,
) {
  const skills: Record<string, number> = JSON.parse(JSON.stringify(previousSkills));
  const availSkillArray: string[] = [...new Set(availSkills)];
  const advCounter: Record<string, number> = {};
  let cost: number = currentCost;

  for (let adv = 0; adv < advNumber; ++adv) {
    if (availSkillArray.length < 1) {
      break;
    }

    let skill = selectRandom(availSkillArray);

    if (Object.hasOwn(skills, skill)) {
      cost += skillCost(skills[skill]);
      skills[skill] += 1;
    } else {
      cost += skillCost(0);
      skills[skill] = 1;
    }

    if (Object.hasOwn(advCounter, skill)) {
      advCounter[skill] += 1;
    } else {
      advCounter[skill] = 1;
    }

    if (advCounter[skill] === maxAdvPerSkill) {
      let indexToRemove = availSkillArray.indexOf(skill);
      availSkillArray.splice(indexToRemove, 1);
    }
  }

  return [skills, cost];
}
