import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/talent";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    tests: apiData.tests,
    maxRank: apiData.max_rank,
    maxRankAtt: apiData.max_rank_att,
    isGroup: apiData.is_group,
    group: apiData.group,
    hasModifiers: checkModifiers(apiData.modifiers),
    modifiers: apiData.modifiers,
    canEdit: apiData.can_edit,
    shared: apiData.shared,
  };
};

const checkModifiers = (modifiers) => {
  if (modifiers.size !== 0) {
    return true;
  } else {
    for (let att of Object.values(modifiers.attributes)) {
      if (att !== 0) {
        return true;
      }
    }
  }
  return false;
};

const convertModelToApiData = (talent, includeId) => {
  let apiData = {
    name: talent.name,
    description: talent.description,
    tests: talent.tests,
    max_rank: talent.maxRank,
    max_rank_att: talent.maxRankAtt,
    modifiers: talent.modifiers,
    is_group: talent.isGroup,
    group: talent.group,
    shared: talent.shared,
  };

  if (includeId) {
    apiData.id = talent.id;
  }

  return apiData;
};

class TalentApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const compareTalent = (talent1, talent2) => {
  for (let [key, value] of Object.entries(talent1)) {
    if (key !== "group" && key !== "modifiers") {
      if (talent2[key] !== value) {
        return false;
      }
    }
  }

  if (!compareArrayIgnoreOrder(talent1.group, talent2.group)) {
    return false;
  }

  for (let [key, value] of Object.entries(talent1.modifiers.attributes)) {
    if (value !== talent2.modifiers.attributes[key]) {
      return false;
    }
  }

  return talent1.modifiers.size === talent2.modifiers.size;
};

const generateEmptyTalent = () => {
  return {
    id: "",
    name: "",
    description: "",
    tests: "",
    maxRank: 0,
    maxRankAtt: 0,
    hasModifiers: false,
    modifiers: generateEmptyModifiers(),
    isGroup: false,
    group: [],
    canEdit: false,
    shared: false,
  };
};

const generateEmptyModifiers = () => {
  return {
    size: 0,
    attributes: { WS: 0, BS: 0, S: 0, T: 0, I: 0, Ag: 0, Dex: 0, Int: 0, WP: 0, Fel: 0 },
  };
};

const generateNewTalent = (canEdit) => {
  const talent = generateEmptyTalent();
  talent.name = "New talent";
  talent.canEdit = canEdit;
  talent.shared = true;
  return talent;
};

const talentAttributes = {
  0: "None",
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

export { TalentApi, generateEmptyTalent, generateNewTalent, compareTalent, talentAttributes };
