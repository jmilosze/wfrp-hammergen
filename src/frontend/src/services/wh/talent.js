import { compareArrayIgnoreOrder } from "../../utils/arrayUtils";
import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import { checkModifiers, compareModifiers, generateEmptyModifiers } from "./characterModifiers";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/wh/talent";

const convertApiToModelData = (apiData) => {
  return {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    description: apiData.object.description,
    tests: apiData.object.tests,
    maxRank: apiData.object.maxRank,
    maxRankAtt: apiData.object.attribute,
    isGroup: apiData.object.isGroup,
    group: apiData.object.group,
    hasModifiers: checkModifiers(apiData.object.modifiers),
    modifiers: apiData.object.modifiers,
    shared: apiData.object.shared,
    source: apiData.object.source,
  };
};

const convertModelToApiData = (talent) => {
  return {
    name: talent.name,
    description: talent.description,
    tests: talent.tests,
    max_rank: talent.maxRank,
    max_rank_att: talent.maxRankAtt,
    modifiers: talent.modifiers,
    is_group: talent.isGroup,
    group: talent.group,
    shared: talent.shared,
    source: talent.source,
  };
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
  const checkAlways = ["name", "description", "isGroup", "shared", "id", "canEdit"];
  const checkIfNotGroup = ["tests", "maxRank", "maxRankAtt"];

  for (let k of checkAlways) {
    if (talent1[k] !== talent2[k]) {
      return false;
    }
  }

  if (!compareObjects(talent1.source, talent2.source)) {
    return false;
  }

  if (talent1.isGroup) {
    return true;
  }

  for (let k of checkIfNotGroup) {
    if (talent1[k] !== talent2[k]) {
      return false;
    }
  }

  if (!compareArrayIgnoreOrder(talent1.group, talent2.group)) {
    return false;
  }

  return compareModifiers(talent1.modifiers, talent2.modifiers);
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
    source: {},
  };
};

const generateNewTalent = (canEdit) => {
  const talent = generateEmptyTalent();
  talent.name = "New talent";
  talent.canEdit = canEdit;
  talent.shared = true;
  talent.source = defaultSource();
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

function maxRankTalentDisplay(isGroup, maxRankValue, maxRankAttValue) {
  if (isGroup) {
    return "";
  }

  const constPart = maxRankValue > 0 ? maxRankValue.toString() : "";
  const attName = talentAttributes[maxRankAttValue];
  const bonusPart = attName !== "None" ? attName + " Bonus" : "";

  if (constPart !== "" && bonusPart !== "") {
    return constPart + " + " + bonusPart;
  } else {
    return constPart + bonusPart;
  }
}

export { TalentApi, generateEmptyTalent, generateNewTalent, compareTalent, talentAttributes, maxRankTalentDisplay };
