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
    id: apiData["id"],
    canEdit: apiData["canEdit"],
    name: apiData["object"]["name"],
    cn: apiData["object"]["cn"],
    range: apiData["object"]["range"],
    target: apiData["object"]["target"],
    duration: apiData["object"]["duration"],
    description: apiData["object"]["description"],
    type: apiData["object"]["type"],
    shared: apiData["object"]["shared"],
    source: apiData["object"]["source"],
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
    source: spell.source,
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

function spellTypeOptions() {
  const options = [];
  for (let [k, v] of Object.entries(spellTypes)) {
    options.push({ value: k, text: v });
  }
  return options;
}

const compareSpell = (spell1, spell2) => {
  for (let [key, value] of Object.entries(spell1)) {
    if (key !== "cn" && key !== "source") {
      if (spell2[key] !== value) {
        return false;
      }
    }
  }

  if (spell1.type === "spell" || spell2.type === "spell") {
    if (spell1.cn !== spell2.cn) {
      return false;
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
    type: "prayer",
    canEdit: false,
    shared: false,
    source: {},
  };
};

const generateNewSpell = (canEdit) => {
  const spell = generateEmptySpell();
  spell.name = "New prayer/spell";
  spell.canEdit = canEdit;
  spell.shared = true;
  spell.source = defaultSource();
  return spell;
};

export { SpellApi, generateEmptySpell, generateNewSpell, spellTypes, compareSpell, spellTypeOptions };
