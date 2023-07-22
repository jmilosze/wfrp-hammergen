import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/wh/skill";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    description: apiData.object.description,
    attribute: apiData.object.attribute,
    type: apiData.object.type,
    displayZero: apiData.object.displayZero,
    isGroup: apiData.object.isGroup,
    group: apiData.object.group,
    shared: apiData.object.shared,
    source: apiData.object.source,
  };
};

const convertModelToApiData = (skill) => {
  return {
    name: skill.name,
    description: skill.description,
    attribute: skill.attribute,
    type: skill.type,
    display_zero: skill.displayZero,
    is_group: skill.isGroup,
    group: skill.group,
    shared: skill.shared,
    source: skill.source,
  };
};

class SkillApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const compareSkill = (skill1, skill2) => {
  for (let [key, value] of Object.entries(skill1)) {
    if (key !== "group" && key !== "source") {
      if (skill2[key] !== value) {
        return false;
      }
    }
  }

  if (!compareArrayIgnoreOrder(skill1.group, skill2.group)) {
    return false;
  }

  return compareObjects(skill1.source, skill2.source);
};

const generateEmptySkill = () => {
  return {
    id: "",
    name: "",
    description: "",
    attribute: 1,
    type: 0,
    displayZero: false,
    isGroup: false,
    group: [],
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewSkill = (canEdit) => {
  const skill = generateEmptySkill();
  skill.name = "New skill";
  skill.canEdit = canEdit;
  skill.shared = true;
  skill.source = defaultSource();
  return skill;
};

const skillTypesGroup = {
  0: "Basic",
  1: "Advanced",
  2: "Mixed",
};

const skillTypesIndividual = {
  0: "Basic",
  1: "Advanced",
};

function skillTypeGroupOptions() {
  const options = [];
  for (let [k, v] of Object.entries(skillTypesGroup)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
}

const skillAttributeTypesIndividual = {
  1: "WS",
  2: "BS",
  3: "S",
  4: "T",
  5: "I",
  6: "Ag",
  7: "Dex",
  8: "Int",
  9: "WP",
  10: "Fel",
};

const skillAttributeTypesGroup = {
  1: "WS",
  2: "BS",
  3: "S",
  4: "T",
  5: "I",
  6: "Ag",
  7: "Dex",
  8: "Int",
  9: "WP",
  10: "Fel",
  11: "Various",
};

function skillAttributeTypeGroupOptions() {
  const options = [];
  for (let [k, v] of Object.entries(skillAttributeTypesGroup)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
}

export {
  SkillApi,
  generateEmptySkill,
  generateNewSkill,
  compareSkill,
  skillTypesGroup,
  skillTypesIndividual,
  skillAttributeTypesIndividual,
  skillAttributeTypesGroup,
  skillTypeGroupOptions,
  skillAttributeTypeGroupOptions,
};
