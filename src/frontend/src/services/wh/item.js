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

const apiBasePath = "/api/wh/item";

const itemTypes = {
  0: "Melee",
  1: "Ranged",
  2: "Ammunition",
  3: "Armour",
  4: "Container",
  5: "Other",
  6: "Grimoire",
};

const meleeGroups = {
  0: "Basic",
  1: "Cavalry",
  2: "Fencing",
  3: "Brawling",
  4: "Flail",
  5: "Parry",
  6: "Polearm",
  7: "Two-Handed",
};

const rangedGroups = {
  0: "Blackpowder",
  1: "Bow",
  2: "Crossbow",
  3: "Engineering",
  4: "Entangling",
  5: "Explosives",
  6: "Sling",
  7: "Throwing",
};

const ammunitionGroups = {
  0: "Blackpowder And Engineering",
  1: "Bow",
  2: "Crossbow",
  3: "Sling",
  4: "Entangling",
};

const armorGroups = {
  0: "Soft Leather",
  1: "Boiled Leather",
  2: "Mail",
  3: "Plate",
  4: "Soft Kit",
  5: "Brigandine",
};

const armorLocations = {
  0: "Arms",
  1: "Body",
  2: "Legs",
  3: "Head",
};

const meleeReach = {
  0: "Personal",
  1: "Very Short",
  2: "Short",
  3: "Average",
  4: "Long",
  5: "Very Long",
  6: "Massive",
};

const weaponHands = {
  0: "Any",
  1: "One-Handed",
  2: "Two-Handed",
};

const itemAvailabilities = {
  0: "Common",
  1: "Scarce",
  2: "Rare",
  3: "Exotic",
};

const itemTypeOptions = () => {
  const options = [];
  for (let [k, v] of Object.entries(itemTypes)) {
    options.push({ value: Number(k), text: v });
  }
  return options;
};

const generateEmptyStats = () => {
  return [
    { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 },
    { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 },
    { dmg: 0, rng: 0, rngMult: 0, group: 0 },
    { points: 0, location: [], group: 0 },
    { capacity: 1, wearable: false },
    { carryType: { carriable: false, wearable: false } },
    { spells: [] },
  ];
};

const generateEmptyItem = () => {
  return {
    id: "",
    name: "",
    description: "",
    price: 0.0,
    enc: 0.0,
    availability: 0,
    properties: [],
    type: 0,
    stats: generateEmptyStats(),
    canEdit: false,
    shared: false,
    source: {},
  };
};

const convertApiToModelData = (apiData) => {
  const containerIsWearable = apiData.object.container.carryType === 0;
  const otherIsCarriable = apiData.object.other.carryType === 0 || apiData.object.other.carryType === 1;
  const otherIsWearable = apiData.object.other.carryType === 0;

  return {
    id: apiData.id,
    canEdit: apiData.canEdit,
    name: apiData.object.name,
    description: apiData.object.description,
    price: apiData.object.price,
    enc: apiData.object.enc,
    availability: apiData.object.availability,
    properties: apiData.object.properties,
    type: apiData.object.type,
    stats: [
      apiData.object.object.melee,
      apiData.object.object.ranged,
      apiData.object.object.ammunition,
      apiData.object.object.armour,
      apiData.object.object.grimoire,
      { capacity: apiData.object.container.capacity, wearable: containerIsWearable },
      { carryType: { carriable: otherIsCarriable, wearable: otherIsWearable } },
    ],
    shared: apiData.object.shared,
    source: apiData.object.source,
  };
};

const generateNewItem = (canEdit) => {
  const item = generateEmptyItem();
  item.name = "New item";
  item.canEdit = canEdit;
  item.shared = true;
  item.source = defaultSource();
  return item;
};

const convertModelToApiData = (item, includeId) => {
  const containerCarryType = item.stats[4].wearable ? 0 : 1;
  const otherCarryType = item.stats[5].carryType.wearable ? 0 : item.stats[5].carryType.carriable ? 1 : 2;

  let apiData = {
    name: item.name,
    description: item.description,
    price: item.price,
    enc: item.enc,
    availability: item.availability,
    properties: item.properties,
    shared: item.shared,
    source: item.source,
    type: item.type,
    melee: item.stats[0],
    ranged: item.stats[1],
    ammunition: item.stats[2],
    armour: item.stats[3],
    grimoire: item.stats[6],
    container: { capacity: item.stats[4].capacity, carryType: containerCarryType },
    other: { carryType: otherCarryType },
  };

  if (includeId) {
    apiData.id = item.id;
  }

  return apiData;
};

const compareItem = (item1, item2) => {
  for (let [key, value] of Object.entries(item1)) {
    if (key !== "stats" && key !== "properties" && key !== "source") {
      if (item2[key] !== value) {
        return false;
      }
    }
  }

  const itemType = item1.type;

  for (let [key, value] of Object.entries(item1.stats[itemType])) {
    if (key !== "location" && key !== "carryType" && key !== "spells") {
      if (item2.stats[itemType][key] !== value) {
        return false;
      }
    } else if (key === "location" || key === "spells") {
      if (!compareArrayIgnoreOrder(item2.stats[itemType][key], value)) {
        return false;
      }
    } else {
      if (JSON.stringify(item1.stats[itemType][key]) !== JSON.stringify(item2.stats[itemType][key])) {
        return false;
      }
    }
  }

  if (!compareObjects(item1.source, item2.source)) {
    return false;
  }

  return compareArrayIgnoreOrder(item1.properties, item2.properties);
};

class ItemApi {
  constructor(axiosInstance) {
    this.getElement = getElementFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.listElements = listElementsFunc(apiBasePath, axiosInstance, convertApiToModelData);
    this.createElement = createElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.updateElement = updateElementFunc(apiBasePath, axiosInstance, convertModelToApiData);
    this.deleteElement = deleteElementFunc(apiBasePath, axiosInstance);
  }
}

export {
  itemTypes,
  meleeGroups,
  rangedGroups,
  ammunitionGroups,
  armorGroups,
  armorLocations,
  meleeReach,
  weaponHands,
  itemAvailabilities,
  generateEmptyItem,
  generateNewItem,
  generateEmptyStats,
  compareItem,
  ItemApi,
  itemTypeOptions,
};
