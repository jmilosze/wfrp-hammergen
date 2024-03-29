import { compareObjects } from "../../utils/objectUtils";
import { defaultSource } from "./source";
import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/wh/spell";

const convertApiToModelData = (apiData) => {
  const spell = {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    cn: apiData.object.cn,
    range: apiData.object.range,
    target: apiData.object.target,
    duration: apiData.object.duration,
    description: apiData.object.description,
    shared: apiData.object.shared,
    source: apiData.object.source,
  };

  return spell;
};

const convertModelToApiData = (spell) => {
  const apiData = {
    name: spell.name,
    cn: spell.cn,
    range: spell.range,
    target: spell.target,
    duration: spell.duration,
    description: spell.description,
    shared: spell.shared,
    source: spell.source,
  };

  return apiData;
};

class SpellApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

const compareSpell = (spell1, spell2) => {
  for (let [key, value] of Object.entries(spell1)) {
    if (key !== "source") {
      if (spell2[key] !== value) {
        return false;
      }
    }
  }

  return compareObjects(spell1.source, spell2.source);
};

const generateEmptySpell = () => {
  return {
    id: "",
    name: "",
    cn: 0,
    range: "",
    target: "",
    duration: "",
    description: "",
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewSpell = (canEdit) => {
  const spell = generateEmptySpell();
  spell.name = "New spell";
  spell.canEdit = canEdit;
  spell.shared = true;
  spell.source = defaultSource();
  return spell;
};

export { SpellApi, generateEmptySpell, generateNewSpell, compareSpell };
