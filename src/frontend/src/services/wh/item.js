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

const apiBasePath = "/api/item";

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
  4: "Entagling",
  5: "Explosives",
  6: "Sling",
  7: "Throwing",
};

const ammunitionGroups = {
  0: "Blackpowder And Engineering",
  1: "Bow",
  2: "Crossbow",
  3: "Sling",
  4: "Entagling",
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
  1: "One-Handed",
  2: "Two-Handed",
};

const itemAvailabilities = {
  0: "Common",
  1: "Scarce",
  2: "Rare",
  3: "Exotic",
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
  const item = {
    id: apiData.id,
    name: apiData.name,
    description: apiData.description,
    price: apiData.price,
    enc: apiData.enc,
    availability: apiData.availability,
    properties: apiData.properties,
    type: apiData.stats.type,
    stats: generateEmptyStats(),
    canEdit: apiData.can_edit,
    shared: apiData.shared,
    source: apiData.source,
  };

  if (apiData.stats.type === 0) {
    item.stats[0] = {
      hands: apiData.stats.hands,
      dmg: apiData.stats.dmg,
      dmgSbMult: apiData.stats.dmg_sb_mult,
      reach: apiData.stats.reach,
      group: apiData.stats.group,
    };
  } else if (apiData.stats.type === 1) {
    item.stats[1] = {
      hands: apiData.stats.hands,
      dmg: apiData.stats.dmg,
      dmgSbMult: apiData.stats.dmg_sb_mult,
      rng: apiData.stats.rng,
      rngSbMult: apiData.stats.rng_sb_mult,
      group: apiData.stats.group,
    };
  } else if (apiData.stats.type === 2) {
    item.stats[2] = {
      dmg: apiData.stats.dmg,
      rng: apiData.stats.rng,
      rngMult: apiData.stats.rng_mult,
      group: apiData.stats.group,
    };
  } else if (apiData.stats.type === 3) {
    item.stats[3] = {
      points: apiData.stats.points,
      location: JSON.parse(JSON.stringify(apiData.stats.location)),
      group: apiData.stats.group,
    };
  } else if (apiData.stats.type === 4) {
    item.stats[4] = {
      capacity: apiData.stats.capacity,
      wearable: apiData.stats.wearable,
    };
  } else if (apiData.stats.type === 6) {
    item.stats[6] = { spells: JSON.parse(JSON.stringify(apiData.stats.spells)) };
  } else {
    item.stats[5] = {
      carryType: {
        carriable: apiData.stats.carry_type.carriable,
        wearable: apiData.stats.carry_type.wearable,
      },
    };
  }

  return item;
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
  let apiData = {
    name: item.name,
    description: item.description,
    price: item.price,
    enc: item.enc,
    availability: item.availability,
    properties: item.properties,
    shared: item.shared,
    source: item.source,
  };

  if (includeId) {
    apiData.id = item.id;
  }

  if (item.type === 0) {
    apiData.stats = {
      type: 0,
      hands: item.stats[0].hands,
      dmg: item.stats[0].dmg,
      dmg_sb_mult: item.stats[0].dmgSbMult,
      reach: item.stats[0].reach,
      group: item.stats[0].group,
    };
  } else if (item.type === 1) {
    apiData.stats = {
      type: 1,
      hands: item.stats[1].hands,
      dmg: item.stats[1].dmg,
      dmg_sb_mult: item.stats[1].dmgSbMult,
      rng: item.stats[1].rng,
      rng_sb_mult: item.stats[1].rngSbMult,
      group: item.stats[1].group,
    };
  } else if (item.type === 2) {
    apiData.stats = {
      type: 2,
      dmg: item.stats[2].dmg,
      rng: item.stats[2].rng,
      rng_mult: item.stats[2].rngMult,
      group: item.stats[2].group,
    };
  } else if (item.type === 3) {
    apiData.stats = {
      type: 3,
      points: item.stats[3].points,
      location: JSON.parse(JSON.stringify(item.stats[3].location)),
      group: item.stats[3].group,
    };
  } else if (item.type === 4) {
    apiData.stats = {
      type: 4,
      capacity: item.stats[4].capacity,
      wearable: item.stats[4].wearable,
    };
  } else if (item.type === 6) {
    apiData.stats = { spells: JSON.parse(JSON.stringify(item.stats[6].spells)) };
  } else {
    apiData.stats = {
      type: 5,
      carry_type: {
        carriable: item.stats[5].carryType.carriable,
        wearable: item.stats[5].carryType.wearable,
      },
    };
  }

  apiData.stats.type = item.type;

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
};
