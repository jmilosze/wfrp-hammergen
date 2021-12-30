import {
  getElementFunc,
  listElementsFunc,
  createElementFunc,
  updateElementFunc,
  deleteElementFunc,
} from "./crudGenerator";

const apiBasePath = "/api/spell";

const convertApiToModelData = (apiData) => {
  const spell = {
    id: apiData.id,
    name: apiData.name,
    cn: apiData.cn,
    range: apiData.range,
    target: apiData.target,
    duration: apiData.duration,
    description: apiData.description,
    type: apiData.type,
    canEdit: apiData.can_edit,
    shared: apiData.shared,
  };

  if (spell.cn === -1) {
    spell.type = "prayer";
    spell.cn = 0;
  } else {
    spell.type = "spell";
  }

  return spell;
};

const convertModelToApiData = (spell, includeId) => {
  const apiData = {
    name: spell.name,
    cn: spell.cn,
    range: spell.range,
    target: spell.target,
    duration: spell.duration,
    description: spell.description,
    shared: spell.shared,
  };

  if (spell.type === "prayer") {
    apiData.cn = -1;
  }
  if (includeId) {
    apiData.id = spell.id;
  }

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

const spellTypes = {
  prayer: "Prayer",
  spell: "Spell",
};

const compareSpell = (spell1, spell2) => {
  if (spell1.type === "spell" || spell2.type === "spell") {
    for (let [key, value] of Object.entries(spell1)) {
      if (spell2[key] !== value) {
        return false;
      }
    }
    return true;
  } else {
    for (let [key, value] of Object.entries(spell1)) {
      if (key !== "cn" && spell2[key] !== value) {
        return false;
      }
    }
    return true;
  }
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
    type: "prayer",
    canEdit: false,
    shared: false,
  };
};

const generateNewSpell = (canEdit) => {
  const spell = generateEmptySpell();
  spell.name = "New prayer/spell";
  spell.canEdit = canEdit;
  spell.shared = true;
  return spell;
};

export { SpellApi, generateEmptySpell, generateNewSpell, spellTypes, compareSpell };
