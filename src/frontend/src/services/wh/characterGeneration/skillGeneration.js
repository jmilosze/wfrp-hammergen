import { selectRandom } from "../../../utils/randomUtils";
import { skillCost } from "./expCost";

let SKILL_ADV = [40, 30, 20, 10];
let LEVEL_1_MAX_ADV_PER_SKILL = 10;
let SKILL_FILL_UP_SKILLS = 8;
let SKILL_FILL_UP_PER_LVL = 5;

export function resolveSkillGroups(listOfSkills) {
  let resolvedGroups = {};

  for (let skill of listOfSkills) {
    if (skill.group.length > 0) {
      for (let group of skill.group) {
        if (resolvedGroups.hasOwnProperty(group)) {
          resolvedGroups[group].push(skill.id);
        } else {
          resolvedGroups[group] = [skill.id];
        }
      }
    }
  }
  return resolvedGroups;
}

export function generateSpeciesSkills(speciesSkills, resolvedSkillGroups) {
  let generatedSkills = {};
  let skillList = JSON.parse(JSON.stringify(speciesSkills));

  for (let advances of [3, 5]) {
    for (let i = 0; i < 3; ++i) {
      let newSkill = selectRandom(skillList);
      skillList = skillList.filter((x) => x !== newSkill);

      if (resolvedSkillGroups.hasOwnProperty(newSkill)) {
        let newSubSkill = selectRandom(resolvedSkillGroups[newSkill]);
        generatedSkills[newSubSkill] = advances;
      } else {
        generatedSkills[newSkill] = advances;
      }
    }
  }
  return generatedSkills;
}

export function generateSkills(species, speciesSkills, careerSkills, listOfSkills, level) {
  let resolvedSkillGroups = resolveSkillGroups(listOfSkills);
  let skills = generateSpeciesSkills(speciesSkills[species], resolvedSkillGroups);
  let expSpent = 0;
  let availSkills = genAvailSkills(resolvedSkillGroups, careerSkills);
  [skills, expSpent] = genLvlSkill(skills, availSkills[0], SKILL_ADV[0], LEVEL_1_MAX_ADV_PER_SKILL, expSpent);
  expSpent = 0;

  let allAvailSkills = availSkills[0];
  for (let tmpLvl = 2; tmpLvl <= level; ++tmpLvl) {
    let fillUpTo = (tmpLvl - 1) * SKILL_FILL_UP_PER_LVL;
    [skills, expSpent] = fillUpLvlSkill(skills, allAvailSkills, fillUpTo, SKILL_FILL_UP_SKILLS, expSpent);
    allAvailSkills = allAvailSkills.concat(availSkills[tmpLvl - 1]);
    [skills, expSpent] = genLvlSkill(skills, availSkills[tmpLvl - 1], SKILL_ADV[tmpLvl - 1], 100, expSpent);
  }

  let generatedSkills = [];
  for (let [id, number] of Object.entries(skills)) {
    generatedSkills.push({ id: id, number: number });
  }

  return [generatedSkills, expSpent];
}

function genAvailSkills(resolvedSkillGroups, careerSkills) {
  let skillGroups = JSON.parse(JSON.stringify(resolvedSkillGroups));

  let availSkills = [new Set(), new Set(), new Set(), new Set()];

  for (let lvl = 0; lvl < 4; ++lvl) {
    for (let skill of careerSkills[lvl]) {
      if (skillGroups.hasOwnProperty(skill)) {
        if (skillGroups[skill].length > 0) {
          let newSkill = selectRandom(skillGroups[skill]);
          let indexToRemove = skillGroups[skill].indexOf(newSkill);
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

function fillUpLvlSkill(previousSkills, availSkills, fillUpTo, numSkills, currentCost) {
  let skills = JSON.parse(JSON.stringify(previousSkills));
  let availSkillArray = Array.from(availSkills);
  let cost = currentCost;

  for (let skillNo = 0; skillNo < numSkills; ++skillNo) {
    if (availSkillArray.length < 1) {
      break;
    }

    let skill = selectRandom(availSkillArray);
    let indexToRemove = availSkillArray.indexOf(skill);
    availSkillArray.splice(indexToRemove, 1);

    for (let adv = 0; adv < fillUpTo; ++adv) {
      if (skills[skill] >= fillUpTo) {
        break;
      }

      if (skills.hasOwnProperty(skill)) {
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

function genLvlSkill(previousSkills, availSkills, advNumber, maxAdvPerSkill, currentCost) {
  let skills = JSON.parse(JSON.stringify(previousSkills));
  let availSkillArray = Array.from(availSkills);
  let advCounter = {};
  let cost = currentCost;

  for (let adv = 0; adv < advNumber; ++adv) {
    if (availSkillArray.length < 1) {
      break;
    }

    let skill = selectRandom(availSkillArray);

    if (skills.hasOwnProperty(skill)) {
      cost += skillCost(skills[skill]);
      skills[skill] += 1;
    } else {
      cost += skillCost(0);
      skills[skill] = 1;
    }

    if (advCounter.hasOwnProperty(skill)) {
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
