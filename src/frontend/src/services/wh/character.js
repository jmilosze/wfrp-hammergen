import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator";
import * as c from "./characterConstants";
import { compareArrayIgnoreOrder, compareStringNumber } from "../../utils/arrayUtils";
import { careerClasses, statusTiers } from "./career";
import {
  csvStr,
  formatItems,
  formatMutations,
  formatSkills,
  formatSpells,
  formatPrayers,
  getCareerLevelName,
  getCareerName,
  getMovementFormula,
  getWoundsFormula,
} from "./utils";
import { getAttributes, sumAndMultAttr } from "./attributes";
import { generateEmptyModifiers, sumAndMultModifiers } from "./characterModifiers";

const apiBasePath = "/api/wh/character";

const speciesWithRegion = {
  [c.HUMAN_REIKLAND]: "Human (Reikland)",
  [c.HUMAN_ALTDORF_SOUTH_BANK]: "Human (Altdorf South Bank)",
  [c.HUMAN_ALTDORF_EASTEND]: "Human (Altdorf Eastend)",
  [c.HUMAN_ALTDORF_HEXXERBEZRIK]: "Human (Altdorf Hexxerbezrik)",
  [c.HUMAN_ALTDORF_DOCKLANDS]: "Human (Altdorf Docklands)",
  [c.HUMAN_MIDDENHEIM]: "Human (Middenheim)",
  [c.HUMAN_MIDDENLAND]: "Human (Middenland)",
  [c.HUMAN_NORDLAND]: "Human (Nordland)",
  [c.HUMAN_SALZENMUND]: "Human (Salzenmund)",
  [c.HUMAN_TILEA]: "Human (Tilea)",
  [c.HUMAN_NORSE_BJORNLING]: "Human (Norse Bjornling)",
  [c.HUMAN_NORSE_SARL]: "Human (Norse Sarl)",
  [c.HUMAN_NORSE_SKAELING]: "Human (Norse Skaeling)",
  [c.HALFLING_DEFAULT]: "Halfling",
  [c.HALFLING_ASHFIELD]: "Halfling (Ashfield)",
  [c.HALFLING_BRAMBLEDOWN]: "Halfling (Brambledown)",
  [c.HALFLING_BRANDYSNAP]: "Halfling (Brandysnap)",
  [c.HALFLING_HAYFOOT]: "Halfling (Hayfoot)",
  [c.HALFLING_HOLLYFOOT]: "Halfling (Hollyfoot)",
  [c.HALFLING_HAYFOOT_HOLLYFOOT]: "Halfling (Hayfoot-Hollyfoot)",
  [c.HALFLING_LOSTPOCKETS]: "Halfling (Lostpockets)",
  [c.HALFLING_LOWHAVEN]: "Halfling (Lowhaven)",
  [c.HALFLING_RUMSTER]: "Halfling (Rumster)",
  [c.HALFLING_SKELFSIDER]: "Halfling (Skelfsider)",
  [c.HALFLING_THORNCOBBLE]: "Halfling (Thorncobble)",
  [c.HALFLING_TUMBLEBERRY]: "Halfling (Tumbleberry)",
  [c.DWARF_DEFAULT]: "Dwarf",
  [c.DWARF_ALTDORF]: "Dwarf (Atldorf)",
  [c.DWARF_CRAGFORGE_CLAN]: "Dwarf (Cragforge Clan)",
  [c.DWARF_GRUMSSON_CLAN]: "Dwarf (Grumsson Clan)",
  [c.DWARF_NORSE]: "Dwarf (Norse)",
  [c.HIGH_ELF_DEFAULT]: "High Elf",
  [c.WOOD_ELF_DEFAULT]: "Wood Elf",
  [c.GNOME_DEFAULT]: "Gnome",
  [c.OGRE_DEFAULT]: "Ogre",
};

function speciesWithRegionOptions() {
  const options = [];
  for (let [k, v] of Object.entries(speciesWithRegion)) {
    options.push({ value: k, text: v });
  }
  return options;
}

function speciesWithRegionToSpecies(speciesWithRegion) {
  return parseInt(speciesWithRegion.substring(0, 2));
}

const defaultSize = 3; // Average

const generateEmptyCharacter = () => {
  return {
    id: "",
    name: "",
    speciesWithRegion: "0001",
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
    prayers: [],
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
    speciesWithRegion: "",
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
    prayers: [],
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

const convertApiToModelData = (apiData) => {
  const newCharacter = {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    speciesWithRegion: apiData.object.species,
    fate: apiData.object.fate,
    fortune: apiData.object.fortune,
    resilience: apiData.object.resilience,
    resolve: apiData.object.resolve,
    brass: apiData.object.brass,
    silver: apiData.object.silver,
    gold: apiData.object.gold,
    spentExp: apiData.object.spentExp,
    currentExp: apiData.object.currentExp,
    status: apiData.object.status,
    standing: apiData.object.standing,
    description: apiData.object.description,
    notes: apiData.object.notes,
    attributeAdvances: JSON.parse(JSON.stringify(apiData.object.attributeAdvances)),
    skills: JSON.parse(JSON.stringify(apiData.object.skills)),
    talents: JSON.parse(JSON.stringify(apiData.object.talents)),
    equippedItems: JSON.parse(JSON.stringify(apiData.object.equippedItems)),
    carriedItems: JSON.parse(JSON.stringify(apiData.object.carriedItems)),
    storedItems: JSON.parse(JSON.stringify(apiData.object.storedItems)),
    spells: JSON.parse(JSON.stringify(apiData.object.spells)),
    prayers: JSON.parse(JSON.stringify(apiData.object.prayers)),
    sin: apiData.object.sin,
    corruption: apiData.object.corruption,
    mutations: JSON.parse(JSON.stringify(apiData.object.mutations)),
    career: JSON.parse(JSON.stringify(apiData.object.career)),
    careerPath: JSON.parse(JSON.stringify(apiData.object.careerPath)),
    shared: apiData.object.shared,
    modifiers: generateEmptyModifiers(),
  };

  const attributeRacial = getAttributes(newCharacter.speciesWithRegion);
  newCharacter.attributeRolls = {};
  for (let [key, value] of Object.entries(apiData.object.baseAttributes)) {
    newCharacter.attributeRolls[key] = value - attributeRacial[key];
  }

  return newCharacter;
};

const convertModelToApiData = (character) => {
  return {
    name: character.name,
    species: character.speciesWithRegion,
    fate: character.fate,
    fortune: character.fortune,
    resilience: character.resilience,
    resolve: character.resolve,
    brass: character.brass,
    silver: character.silver,
    gold: character.gold,
    spentExp: character.spentExp,
    currentExp: character.currentExp,
    status: character.status,
    standing: character.standing,
    description: character.description,
    notes: character.notes,
    baseAttributes: JSON.parse(JSON.stringify(getBaseAttributes(character))),
    attributeAdvances: JSON.parse(JSON.stringify(character.attributeAdvances)),
    skills: JSON.parse(JSON.stringify(character.skills)),
    talents: JSON.parse(JSON.stringify(character.talents)),
    equippedItems: JSON.parse(JSON.stringify(character.equippedItems)),
    carriedItems: JSON.parse(JSON.stringify(character.carriedItems)),
    storedItems: JSON.parse(JSON.stringify(character.storedItems)),
    spells: JSON.parse(JSON.stringify(character.spells)),
    prayers: JSON.parse(JSON.stringify(character.prayers)),
    sin: character.sin,
    corruption: character.corruption,
    mutations: JSON.parse(JSON.stringify(character.mutations)),
    career: JSON.parse(JSON.stringify(character.career)),
    careerPath: JSON.parse(JSON.stringify(character.careerPath)),
    shared: character.shared,
  };
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
    const rawCharacterPromise = this.axiosInstance.get(`${apiBasePath}/${id}?full=true`);

    const rawCharacter = (await rawCharacterPromise).data.data;

    const totalModifiers = sumAndMultModifiers([
      ...rawCharacter.object.mutations.map((t) => ({ multiplier: 1, modifiers: t.object.modifiers })),
      ...rawCharacter.object.talents.map((t) => ({ multiplier: t.number, modifiers: t.wh.object.modifiers })),
    ]);

    const otherAttributes = totalModifiers.attributes;
    const sizeModifier = totalModifiers.size;
    const movementModifier = totalModifiers.movement;

    const attributes = sumAndMultAttr([
      { multiplier: 1, attributes: otherAttributes },
      { multiplier: 1, attributes: rawCharacter.object.baseAttributes },
      { multiplier: 1, attributes: rawCharacter.object.attributeAdvances },
    ]);

    const [basicSkills, advancedSkills] = formatSkills(rawCharacter.object.skills, attributes);
    const equippedArmor = rawCharacter.object.equippedItems.filter((x) => x.wh.object.type === 3);
    const equippedWeapon = rawCharacter.object.equippedItems.filter((x) => [0, 1, 2].includes(x.wh.object.type));
    const equippedOther = rawCharacter.object.equippedItems.filter((x) => [4, 5].includes(x.wh.object.type));
    return {
      id: id,
      name: rawCharacter.object.name,
      speciesWithRegion: speciesWithRegion[rawCharacter.object.species],
      fate: rawCharacter.object.fate,
      fortune: rawCharacter.object.fortune,
      resilience: rawCharacter.object.resilience,
      resolve: rawCharacter.object.resolve,
      brass: rawCharacter.object.brass,
      silver: rawCharacter.object.silver,
      gold: rawCharacter.object.gold,
      spentExp: rawCharacter.object.spentExp,
      currentExp: rawCharacter.object.currentExp,
      status: statusTiers[rawCharacter.object.status],
      standing: rawCharacter.object.standing,
      description: rawCharacter.object.description,
      notes: rawCharacter.object.notes,
      sin: rawCharacter.object.sin,
      corruption: rawCharacter.object.corruption,
      shared: rawCharacter.object.shared,
      canEdit: rawCharacter.canEdit,

      careerName: getCareerName(rawCharacter.object.career),
      careerLevelName: getCareerLevelName(rawCharacter.object.career),
      className: careerClasses[rawCharacter.object.career.wh.object.class],
      pastCareers: rawCharacter.object.careerPath.map((x) => `${getCareerName(x)}`),

      baseAttributes: rawCharacter.object.baseAttributes,
      otherAttributes: otherAttributes,
      attributeAdvances: rawCharacter.object.attributeAdvances,
      attributes: attributes,

      movement: getMovementFormula(rawCharacter.object.species) + movementModifier,
      walk: 2 * (getMovementFormula(rawCharacter.object.species) + movementModifier),
      run: 4 * (getMovementFormula(rawCharacter.object.species) + movementModifier),
      wounds: getWoundsFormula(defaultSize + sizeModifier, attributes.T, attributes.WP, attributes.S),

      talents: rawCharacter.object.talents.map((x) => ({ name: x.wh.object.name, rank: x.number })),
      basicSkills: basicSkills,
      advancedSkills: advancedSkills,

      equippedArmor: formatItems(equippedArmor, attributes),
      equippedWeapon: formatItems(equippedWeapon, attributes),
      equippedOther: formatItems(equippedOther, attributes),
      carried: formatItems(rawCharacter.object.carriedItems, attributes),
      stored: formatItems(rawCharacter.object.storedItems, attributes),

      spells: formatSpells(rawCharacter.object.spells),
      prayers: formatPrayers(rawCharacter.object.prayers),
      mutations: formatMutations(rawCharacter.object.mutations),

      encWeapon: equippedWeapon.map((x) => x.wh.object.enc * x.number).reduce((x, y) => x + y, 0),
      encArmor: equippedArmor
        .map((x) => (x.wh.object.enc > 0 ? x.wh.object.enc - 1 : 0) * x.number)
        .reduce((x, y) => x + y, 0),
      encOther: equippedOther
        .map((x) => (x.wh.object.enc > 0 ? x.wh.object.enc - 1 : 0) * x.number)
        .reduce((x, y) => x + y, 0),
      encCarried: rawCharacter.object.carriedItems.map((x) => x.wh.object.enc).reduce((x, y) => x + y, 0),
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
    "prayers",
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

  const stringArrays = ["spells", "prayers", "mutations"];
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
  return getMovementFormula(character.speciesWithRegion) + character.modifiers.movement;
}

function getBaseAttributes(character) {
  return sumAndMultAttr([
    { multiplier: 1, attributes: getAttributes(character.speciesWithRegion) },
    { multiplier: 1, attributes: character.attributeRolls },
  ]);
}

function getRacialAttributes(character) {
  return getAttributes(character.speciesWithRegion);
}

function getTotalAttributes(character) {
  return sumAndMultAttr([
    { multiplier: 1, attributes: getAttributes(character.speciesWithRegion) },
    { multiplier: 1, attributes: character.attributeRolls },
    { multiplier: 1, attributes: character.attributeAdvances },
    { multiplier: 1, attributes: character.modifiers.attributes },
  ]);
}

function characterForDisplayToCsv(charForDisplay) {
  let csv = "Name,Species,Career,Class,Status,,,,,,\n";
  csv += csvStr(charForDisplay.name) + ",";
  csv += csvStr(charForDisplay.speciesWithRegion) + ",";
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
  csv += "Notes,,,,,,,,,,\n";
  csv += csvStr(charForDisplay.notes) + ",,,,,,,,,,\n";

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
  csv += "Mutations,,,,,,,,,,\n";
  csv += "Name,Type,Description,,,,,,,,\n";

  for (const item of charForDisplay.mutations) {
    csv += csvStr(item.name) + "," + item.type + "," + csvStr(item.description) + ",,,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Spells,,,,,,,,,,\n";
  csv += "Name,CN,Range,Target,Duration,,,,,,\n";

  for (const item of charForDisplay.spells) {
    csv += csvStr(item.name) + "," + item.cn + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Prayers,,,,,,,,,,\n";
  csv += "Name,Range,Target,Duration,,,,,,\n";

  for (const item of charForDisplay.prayers) {
    csv += csvStr(item.name) + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Spells in Grimoires,,,,,,,,,,\n";
  for (let item of [...charForDisplay.carried, ...charForDisplay.stored]) {
    if (item.spells) {
      csv += item.name + ",,,,,,,,,\n";
      csv += "Name,CN,Range,Target,Duration,,,,,,\n";
      for (const spell of item.spells) {
        csv += csvStr(spell.name) + "," + spell.cn + "," + csvStr(spell.range) + ",";
        csv += csvStr(spell.target) + "," + csvStr(spell.duration) + ",,,,,,\n";
      }
    }
  }

  return csv;
}

export {
  generateEmptyCharacter,
  generateNewCharacter,
  CharacterApi,
  compareCharacter,
  getWounds,
  getWoundsFormula,
  getMovement,
  getBaseAttributes,
  getRacialAttributes,
  getTotalAttributes,
  generateEmptyCharacterForDisplay,
  characterForDisplayToCsv,
  speciesWithRegion,
  speciesWithRegionOptions,
  speciesWithRegionToSpecies,
};
