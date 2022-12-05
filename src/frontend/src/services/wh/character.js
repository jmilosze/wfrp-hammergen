import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator";
import { compareArrayIgnoreOrder, compareStringNumber } from "../../utils/arrayUtils";
import { careerClasses, statusTiers } from "./career";
import {
  getWoundsFormula,
  getMovementFormula,
  formatSkills,
  formatItems,
  formatSpells,
  formatMutations,
  getCareerName,
  getCareerLevelName,
  csvStr,
} from "./utils";
import { sumAndMultAttr, getAttributes } from "./attributes";
import { generateEmptyModifiers, sumAndMultModifiers } from "./characterModifiers";

const apiBasePath = "/api/character";
const apiCharacterDisplayPath = "/api/character_resolved";
const apiSkillPath = "/api/skill";

const species = {
  0: "Human",
  1: "Halfling",
  2: "Dwarf",
  3: "High Elf",
  4: "Wood Elf",
  5: "Gnome",
};

const defaultSize = 3; // Average

const generateEmptyCharacter = () => {
  return {
    id: "",
    name: "",
    species: 0,
    fate: 0,
    fortune: 0,
    resilience: 0,
    resolve: 0,
    brass: 0,
    silver: 0,
    gold: 0,
    spentExp: 0,
    currentExp: 0,
    status: 0,
    standing: 0,
    description: "",
    notes: "",
    careerPath: [],
    career: {},
    attributeRolls: getAttributes(),
    attributeAdvances: getAttributes(),
    skills: [],
    talents: [],
    equippedItems: [],
    carriedItems: [],
    storedItems: [],
    spells: [],
    sin: 0,
    corruption: 0,
    mutations: [],
    canEdit: false,
    shared: false,

    modifiers: generateEmptyModifiers(),
  };
};

const generateEmptyCharacterForDisplay = () => {
  return {
    id: "",
    name: "",
    species: "",
    description: "",
    careerName: "",
    className: "",
    careerLevelName: "",
    status: "",
    standing: 0,
    pastCareers: [],
    movement: 0,
    walk: 0,
    run: 0,
    brass: 0,
    silver: 0,
    gold: 0,
    fate: 0,
    fortune: 0,
    resilience: 0,
    resolve: 0,
    wounds: 0,
    currentExp: 0,
    spentExp: 0,
    totalExp: 0,
    attributes: getAttributes(),
    baseAttributes: getAttributes(),
    otherAttributes: getAttributes(),
    attributeAdvances: getAttributes(),
    basicSkills: [],
    advancedSkills: [],
    talents: [],
    equippedArmor: [],
    equippedWeapon: [],
    equippedOther: [],
    carried: [],
    stored: [],
    encWeapon: 0,
    encArmor: 0,
    encOther: 0,
    encCarried: 0,
    notes: "",
    spells: [],
    sin: 0,
    corruption: 0,
    mutations: [],
    canEdit: false,

    modifiers: generateEmptyModifiers(),
  };
};

const generateNewCharacter = (canEdit) => {
  const newCharacter = generateEmptyCharacter();
  newCharacter.name = "New character";
  newCharacter.canEdit = canEdit;
  newCharacter.shared = true;
  return newCharacter;
};

const convertModelToApiData = (character, includeId) => {
  const apiData = {
    name: character.name,
    species: character.species,
    fate: character.fate,
    fortune: character.fortune,
    resilience: character.resilience,
    resolve: character.resolve,
    brass: character.brass,
    silver: character.silver,
    gold: character.gold,
    spent_exp: character.spentExp,
    current_exp: character.currentExp,
    status: character.status,
    standing: character.standing,
    description: character.description,
    notes: character.notes,
    attribute_advances: JSON.parse(JSON.stringify(character.attributeAdvances)),
    skills: JSON.parse(JSON.stringify(character.skills)),
    talents: JSON.parse(JSON.stringify(character.talents)),
    equipped_items: JSON.parse(JSON.stringify(character.equippedItems)),
    carried_items: JSON.parse(JSON.stringify(character.carriedItems)),
    stored_items: JSON.parse(JSON.stringify(character.storedItems)),
    spells: JSON.parse(JSON.stringify(character.spells)),
    sin: character.sin,
    corruption: character.corruption,
    mutations: JSON.parse(JSON.stringify(character.mutations)),
    shared: character.shared,
  };

  apiData.career_path = [];
  for (let c of character.careerPath) {
    apiData.career_path.push({ id: c.id, level: c.number });
  }
  apiData.career = { id: character.career.id, level: character.career.number };

  const baseAttributes = getBaseAttributes(character);
  apiData.base_attributes = JSON.parse(JSON.stringify(baseAttributes));

  if (includeId) {
    apiData.id = character.id;
  }

  return apiData;
};

const convertApiToModelData = (apiData) => {
  const newCharacter = {
    id: apiData.id,
    name: apiData.name,
    species: apiData.species,
    fate: apiData.fate,
    fortune: apiData.fortune,
    resilience: apiData.resilience,
    resolve: apiData.resolve,
    brass: apiData.brass,
    silver: apiData.silver,
    gold: apiData.gold,
    spentExp: apiData.spent_exp,
    currentExp: apiData.current_exp,
    status: apiData.status,
    standing: apiData.standing,
    description: apiData.description,
    notes: apiData.notes,
    attributeAdvances: JSON.parse(JSON.stringify(apiData.attribute_advances)),
    skills: JSON.parse(JSON.stringify(apiData.skills)),
    talents: JSON.parse(JSON.stringify(apiData.talents)),
    equippedItems: JSON.parse(JSON.stringify(apiData.equipped_items)),
    carriedItems: JSON.parse(JSON.stringify(apiData.carried_items)),
    storedItems: JSON.parse(JSON.stringify(apiData.stored_items)),
    spells: JSON.parse(JSON.stringify(apiData.spells)),
    sin: apiData.sin,
    corruption: apiData.corruption,
    mutations: JSON.parse(JSON.stringify(apiData.mutations)),
    shared: apiData.shared,
    canEdit: apiData.can_edit,

    modifiers: generateEmptyModifiers(),
  };

  newCharacter.careerPath = [];
  for (let c of apiData.career_path) {
    newCharacter.careerPath.push({ id: c.id, number: c.level });
  }

  newCharacter.career = { id: apiData.career.id, number: apiData.career.level };

  const attributeRacial = getAttributes(newCharacter.species);
  newCharacter.attributeRolls = {};
  for (let [key, value] of Object.entries(apiData.base_attributes)) {
    newCharacter.attributeRolls[key] = value - attributeRacial[key];
  }

  return newCharacter;
};

class CharacterApi {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;

    this.getElementForDisplay = this.getElementForDisplay.bind(this);
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }

  async getElementForDisplay(id) {
    const skillsPromise = this.axiosInstance.get(apiSkillPath);
    const rawCharacterPromise = this.axiosInstance.get(`${apiCharacterDisplayPath}/${id}`);

    const rawSkills = (await skillsPromise).data.data;
    const rawCharacter = (await rawCharacterPromise).data.data;

    const totalModifiers = sumAndMultModifiers([
      ...rawCharacter.mutations.map((t) => ({ multiplier: 1, modifiers: t.value.modifiers })),
      ...rawCharacter.talents.map((t) => ({ multiplier: t.number, modifiers: t.value.modifiers })),
    ]);

    const otherAttributes = totalModifiers.attributes;
    const sizeModifier = totalModifiers.size;
    const movementModifier = totalModifiers.movement;

    const attributes = sumAndMultAttr([
      { multiplier: 1, attributes: otherAttributes },
      { multiplier: 1, attributes: rawCharacter.base_attributes },
      { multiplier: 1, attributes: rawCharacter.attribute_advances },
    ]);

    const [basicSkills, advancedSkills] = formatSkills(rawCharacter.skills, rawSkills, attributes);
    const equippedArmor = rawCharacter.equipped_items.filter((x) => x.value.stats.type === 3);
    const equippedWeapon = rawCharacter.equipped_items.filter((x) => [0, 1, 2].includes(x.value.stats.type));
    const equippedOther = rawCharacter.equipped_items.filter((x) => [4, 5].includes(x.value.stats.type));

    return {
      id: id,
      name: rawCharacter.name,
      species: species[rawCharacter.species],
      fate: rawCharacter.fate,
      fortune: rawCharacter.fortune,
      resilience: rawCharacter.resilience,
      resolve: rawCharacter.resolve,
      brass: rawCharacter.brass,
      silver: rawCharacter.silver,
      gold: rawCharacter.gold,
      spentExp: rawCharacter.spent_exp,
      currentExp: rawCharacter.current_exp,
      status: statusTiers[rawCharacter.status],
      standing: rawCharacter.standing,
      description: rawCharacter.description,
      notes: rawCharacter.notes,
      sin: rawCharacter.sin,
      corruption: rawCharacter.corruption,
      shared: rawCharacter.shared,
      canEdit: rawCharacter.can_edit,

      careerName: getCareerName(rawCharacter.career),
      careerLevelName: getCareerLevelName(rawCharacter.career),
      className: careerClasses[rawCharacter.career.value.class],
      pastCareers: rawCharacter.career_path.map((x) => `${getCareerName(x)}`),

      baseAttributes: rawCharacter.base_attributes,
      otherAttributes: otherAttributes,
      attributeAdvances: rawCharacter.attribute_advances,
      attributes: attributes,

      movement: getMovementFormula(rawCharacter.species) + movementModifier,
      walk: 2 * (getMovementFormula(rawCharacter.species) + movementModifier),
      run: 4 * (getMovementFormula(rawCharacter.species) + movementModifier),
      wounds: getWoundsFormula(defaultSize + sizeModifier, attributes.T, attributes.WP, attributes.S),

      talents: rawCharacter.talents.map((x) => ({ name: x.value.name, rank: x.number })),
      basicSkills: basicSkills,
      advancedSkills: advancedSkills,

      equippedArmor: formatItems(equippedArmor, attributes),
      equippedWeapon: formatItems(equippedWeapon, attributes),
      equippedOther: formatItems(equippedOther, attributes),
      carried: formatItems(rawCharacter.carried_items, attributes),
      stored: formatItems(rawCharacter.stored_items, attributes),

      spells: formatSpells(rawCharacter.spells),
      mutations: formatMutations(rawCharacter.mutations),

      encWeapon: equippedWeapon.map((x) => x.value.enc * x.number).reduce((x, y) => x + y, 0),
      encArmor: equippedArmor.map((x) => (x.value.enc > 0 ? x.value.enc - 1 : 0) * x.number).reduce((x, y) => x + y, 0),
      encOther: equippedOther.map((x) => (x.value.enc > 0 ? x.value.enc - 1 : 0) * x.number).reduce((x, y) => x + y, 0),
      encCarried: rawCharacter.carried_items.map((x) => x.value.enc).reduce((x, y) => x + y, 0),
    };
  }
}

const compareCharacter = (character1, character2) => {
  const noCopyKeys = [
    "career",
    "careerPath",
    "attributeAdvances",
    "attributeRolls",
    "skills",
    "talents",
    "equippedItems",
    "carriedItems",
    "storedItems",
    "spells",
    "mutations",
    "modifiers",
  ];

  for (let [key, value] of Object.entries(character1)) {
    if (!noCopyKeys.includes(key)) {
      if (character2[key] !== value) {
        return false;
      }
    }
  }

  if (character1.career.id !== character2.career.id || character1.career.number !== character2.career.number) {
    return false;
  }

  const stringNumberArrays = ["careerPath", "skills", "talents", "equippedItems", "carriedItems", "storedItems"];
  for (let arr of stringNumberArrays) {
    if (!compareArrayIgnoreOrder(character1[arr], character2[arr], compareStringNumber)) {
      return false;
    }
  }

  for (let attKey of ["attributeAdvances", "attributeRolls"]) {
    for (let [key, value] of Object.entries(character1[attKey])) {
      if (value !== character2[attKey][key]) {
        return false;
      }
    }
  }

  const stringArrays = ["spells", "mutations"];
  for (let arr of stringArrays) {
    if (!compareArrayIgnoreOrder(character1[arr], character2[arr])) {
      return false;
    }
  }
  return true;
};

function getWounds(character) {
  const attributeTotal = getTotalAttributes(character);
  return getWoundsFormula(
    defaultSize + character.modifiers.size,
    attributeTotal.T,
    attributeTotal.WP,
    attributeTotal.S
  );
}

function getMovement(character) {
  return getMovementFormula(character.species) + character.modifiers.movement;
}

function getBaseAttributes(character) {
  const attributeRacial = getAttributes(character.species);
  const baseAttributes = {};
  for (let [key, value] of Object.entries(character.attributeRolls)) {
    baseAttributes[key] = value + attributeRacial[key];
  }
  return baseAttributes;
}

function getRacialAttributes(character) {
  return getAttributes(character.species);
}

function getTotalAttributes(character) {
  const attributeRacial = getAttributes(character.species);
  const totalAttributes = {};
  for (let [key, value] of Object.entries(character.attributeRolls)) {
    totalAttributes[key] =
      value + attributeRacial[key] + character.attributeAdvances[key] + character.modifiers.attributes[key];
  }
  return totalAttributes;
}

function characterForDisplayToCsv(charForDisplay) {
  let csv = "Name,Species,Career,Class,Status,,,,,,\n";
  csv += csvStr(charForDisplay.name) + ",";
  csv += csvStr(charForDisplay.species) + ",";
  csv += csvStr(`${charForDisplay.careerName} (${charForDisplay.careerLevelName})`) + ",";
  csv += csvStr(charForDisplay.className) + ",";
  csv += csvStr(charForDisplay.status + " " + charForDisplay.standing) + ",";
  csv += ",,,,,\n";

  csv += "Past Careers,";
  csv += csvStr(charForDisplay.pastCareers.join(", ")) + ",";
  csv += ",,,,,,,,\n";
  csv += "Description,";
  csv += csvStr(charForDisplay.description) + ",";
  csv += ",,,,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Movement,,,Wealth,,,Fate And Resilience,,,,\n";
  csv += "Movement,Walk,Run,D,SS,GC,Fate,Fortune,Resilience,Resolve,\n";

  csv += charForDisplay.movement + "," + charForDisplay.walk + "," + charForDisplay.run + ",";
  csv += charForDisplay.brass + "," + charForDisplay.silver + "," + charForDisplay.gold + ",";
  csv +=
    charForDisplay.fate +
    "," +
    charForDisplay.fortune +
    "," +
    charForDisplay.resilience +
    "," +
    charForDisplay.resolve +
    ",\n";

  csv += ",,,,,,,,,,\n";
  csv += "Wounds,Sin Points,Corruption Points,Current XP,Spent XP,Total XP,,,,,\n";
  csv += charForDisplay.wounds + "," + charForDisplay.sin + "," + charForDisplay.corruption + ",";
  csv += charForDisplay.currentExp + "," + charForDisplay.spentExp + "," + charForDisplay.totalExp + ",";
  csv += ",,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Attributes,,,,,,,,,,\n";
  csv += ",WS,BS,S,T,I,Ag,Dex,Int,Wp,Fel\n";
  csv += "Base" + "," + charForDisplay.baseAttributes.WS + "," + charForDisplay.baseAttributes.BS + ",";
  csv += charForDisplay.baseAttributes.S + "," + charForDisplay.baseAttributes.T + ",";
  csv += charForDisplay.baseAttributes.I + "," + charForDisplay.baseAttributes.Ag + ",";
  csv += charForDisplay.baseAttributes.Dex + "," + charForDisplay.baseAttributes.Int + ",";
  csv += charForDisplay.baseAttributes.WP + "," + charForDisplay.baseAttributes.Fel + "\n";

  csv += "Other" + "," + charForDisplay.otherAttributes.WS + "," + charForDisplay.otherAttributes.BS + ",";
  csv += charForDisplay.otherAttributes.S + "," + charForDisplay.otherAttributes.T + ",";
  csv += charForDisplay.otherAttributes.I + "," + charForDisplay.otherAttributes.Ag + ",";
  csv += charForDisplay.otherAttributes.Dex + "," + charForDisplay.otherAttributes.Int + ",";
  csv += charForDisplay.otherAttributes.WP + "," + charForDisplay.otherAttributes.Fel + "\n";

  csv += "Advances" + "," + charForDisplay.attributeAdvances.WS + "," + charForDisplay.attributeAdvances.BS + ",";
  csv += charForDisplay.attributeAdvances.S + "," + charForDisplay.attributeAdvances.T + ",";
  csv += charForDisplay.attributeAdvances.I + "," + charForDisplay.attributeAdvances.Ag + ",";
  csv += charForDisplay.attributeAdvances.Dex + "," + charForDisplay.attributeAdvances.Int + ",";
  csv += charForDisplay.attributeAdvances.WP + "," + charForDisplay.attributeAdvances.Fel + "\n";

  csv += "Total" + "," + charForDisplay.attributes.WS + "," + charForDisplay.attributes.BS + ",";
  csv += charForDisplay.attributes.S + "," + charForDisplay.attributes.T + ",";
  csv += charForDisplay.attributes.I + "," + charForDisplay.attributes.Ag + ",";
  csv += charForDisplay.attributes.Dex + "," + charForDisplay.attributes.Int + ",";
  csv += charForDisplay.attributes.WP + "," + charForDisplay.attributes.Fel + "\n";

  csv += ",,,,,,,,,,\n";
  csv += "Basic Skills,,,,,,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Attr,Attr Val,Adv,Skill,\n";

  const basicSkills1 = charForDisplay.basicSkills.slice(0, Math.floor(charForDisplay.basicSkills.length / 2));
  const basicSkills2 = charForDisplay.basicSkills.slice(Math.floor(charForDisplay.basicSkills.length / 2));

  for (let i = 0; i < basicSkills2.length; ++i) {
    const s1 = basicSkills1[i];
    const s2 = basicSkills2[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + ", " + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    csv += csvStr(s2.name) + "," + s2.attributeName + ",";
    csv += s2.attributeValue + "," + s2.advances + ", " + s2.skill + ",\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Advanced Skills,,,,,Talents,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Times Taken,,,,\n";

  for (let i = 0; i < Math.max(charForDisplay.advancedSkills.length, charForDisplay.talents.length); ++i) {
    let s1 = charForDisplay.advancedSkills[i];
    let s2 = charForDisplay.talents[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + "," + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    if (s2) {
      csv += csvStr(s2.name) + "," + s2.rank + ",,,,\n";
    } else {
      csv += ",,,,,\n";
    }
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Armor,,,,,,,,,,\n";
  csv += "Name,Group,Locations,Enc,AP,Qualities,Number,,,,\n";

  for (const armor of charForDisplay.equippedArmor) {
    csv += csvStr(armor.name) + "," + csvStr(armor.locations.join(", ")) + "," + armor.enc + ",";
    csv += armor.ap + "," + csvStr(armor.qualities.join(", ")) + "," + armor.number + ",,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Weapons,,,,,,,,,,\n";
  csv += "Name,Group,Enc,Range/Reach,Damage,Qualities,Number,,,,\n";

  for (const weapon of charForDisplay.equippedWeapon) {
    csv += csvStr(weapon.name) + "," + weapon.group + "," + weapon.enc + "," + weapon.rng + ",";
    csv += weapon.dmg + "," + csvStr(weapon.qualities.join(", ")) + "," + weapon.number + ",,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Other Equipped,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of charForDisplay.equippedOther) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.desc) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Carried,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of charForDisplay.carried) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.desc) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Encumbrance,,,,,,,,,,\n";
  csv += "Armor,Weapon,Other,Carried,,,,,,,\n";
  csv +=
    charForDisplay.encArmor +
    "," +
    charForDisplay.encWeapon +
    "," +
    charForDisplay.encOther +
    "," +
    charForDisplay.encCarried +
    ",";
  csv += ",,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Stored,,,,,,,,,,\n";
  csv += "Name,Number,Description,,,,,,,\n";
  for (const item of charForDisplay.stored) {
    csv += csvStr(item.name) + "," + item.number + "," + csvStr(item.desc) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Spells/Prayers,,,,,,,,,,\n";
  csv += "Name,CN,Range,Target,Duration,,,,,,\n";

  for (const item of charForDisplay.spells) {
    csv += csvStr(item.name) + "," + (item.cn ? item.cn : "N/A") + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Mutations,,,,,,,,,,\n";
  csv += "Name,Type,Description,,,,,,,,\n";

  for (const item of charForDisplay.mutations) {
    csv += csvStr(item.name) + "," + item.type + "," + csvStr(item.description) + ",,,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Notes,,,,,,,,,,\n";
  csv += csvStr(charForDisplay.notes) + ",,,,,,,,,,\n";

  return csv;
}

export {
  species,
  generateEmptyCharacter,
  generateNewCharacter,
  CharacterApi,
  compareCharacter,
  getWounds,
  getMovement,
  getBaseAttributes,
  getRacialAttributes,
  getTotalAttributes,
  generateEmptyCharacterForDisplay,
  characterForDisplayToCsv,
};
