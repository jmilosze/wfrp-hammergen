import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";
import { mutationTypes } from "@/services/wh/mutation";

const apiBasePath = "/api/skill";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    attribute: apiData.attribute,
    type: apiData.type,
    displayZero: apiData.display_zero,
    isGroup: apiData.is_group,
    group: apiData.group,
    canEdit: apiData.can_edit,
    shared: apiData.shared,
    source: apiData.source,
  };
};

const convertModelToApiData = (skill, includeId) => {
  let apiData = {
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

  if (includeId) {
    apiData.id = skill.id;
  }

  return apiData;
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
