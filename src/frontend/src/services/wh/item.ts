import { copySource, Source } from "./source.ts";
import {
  ApiResponse,
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
  WhProperty,
} from "./crudGenerator.ts";
import { objectsAreEqual } from "../../utils/objectUtils.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/arrayUtils.ts";
import { AxiosInstance } from "axios";

export enum ItemType {
  Melee = 0,
  Ranged,
  Ammunition,
  Armour,
  Container,
  Other,
  Grimoire,
}

export enum MeleeGroup {
  Basic = 0,
  Cavalry,
  Fencing,
  Brawling,
  Flail,
  Parry,
  Polearm,
  "Two-Handed",
}

export enum RangedGroup {
  Blackpowder = 0,
  Bow,
  Crossbow,
  Engineering,
  Entangling,
  Explosives,
  Sling,
  Throwing,
  Blowpipe,
}

export enum AmmoGroup {
  "Blackpowder and engineering" = 0,
  Bow,
  Crossbow,
  Sling,
  Entangling,
  Blowpipe,
}

export enum ArmourGroup {
  "Soft leather" = 0,
  "Boiled leather",
  Mail,
  Plate,
  "Soft kit",
  Brigandine,
}

export enum ArmourLocation {
  Arms = 0,
  Body,
  Short,
  Legs,
  Head,
}

export enum MeleeReach {
  Personal = 0,
  "Very short",
  Short,
  Average,
  Long,
  "Very long",
  Massive,
}

export enum WeaponHands {
  Any = 0,
  "One-Handed",
  "Two-Handed",
}

export enum Availability {
  Common = 0,
  Scarce,
  Rare,
  Exotic,
}

export enum CarryType {
  "Carriable and wearable" = 0,
  "Carriable and not wearable",
  "Not carriable and not wearable",
}

const API_BASE_PATH = "/api/wh/item";

export type MeleeType = {
  hands: number;
  dmg: number;
  dmgSbMult: number;
  reach: number;
  group: number;
};

export type RangedType = {
  hands: number;
  dmg: number;
  dmgSbMult: number;
  rng: number;
  rngSbMult: number;
  group: number;
};

export type AmmoType = {
  dmg: number;
  rng: number;
  rngMult: number;
  group: number;
};

export type ArmourType = {
  points: number;
  location: number[];
  group: number;
};

export type ContainerType = {
  capacity: number;
  carryType: number;
};

export type OtherType = {
  carryType: number;
};

export type GrimoireType = {
  spells: string[];
};

export interface ItemApiData {
  name: string;
  description: string;
  price: number;
  enc: number;
  availability: number;
  properties: string[];
  type: number;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: GrimoireType;
  container: ContainerType;
  other: OtherType;
  shared: boolean;
  source: Source;
}

export class Item implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  price: number;
  enc: number;
  availability: number;
  properties: string[];
  type: number;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: GrimoireType;
  container: ContainerType;
  other: OtherType;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    price = 0,
    enc = 0,
    availability = 0,
    properties = [] as string[],
    type = 0,
    melee = { hands: 1, dmg: 0, dmgSbMult: 0, reach: 0, group: 0 } as MeleeType,
    ranged = { hands: 1, dmg: 0, dmgSbMult: 0, rng: 0, rngSbMult: 0, group: 0 } as RangedType,
    ammunition = { dmg: 0, rng: 0, rngMult: 0, group: 0 } as AmmoType,
    armour = { points: 0, location: [], group: 0 } as ArmourType,
    grimoire = { spells: [] } as GrimoireType,
    container = { capacity: 1, carryType: 0 } as ContainerType,
    other = { carryType: 0 } as OtherType,

    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.price = price;
    this.enc = enc;
    this.availability = availability;
    this.properties = JSON.parse(JSON.stringify(properties));
    this.type = type;
    this.melee = JSON.parse(JSON.stringify(melee));
    this.ranged = JSON.parse(JSON.stringify(ranged));
    this.ammunition = JSON.parse(JSON.stringify(ammunition));
    this.armour = JSON.parse(JSON.stringify(armour));
    this.grimoire = JSON.parse(JSON.stringify(grimoire));
    this.container = JSON.parse(JSON.stringify(container));
    this.other = JSON.parse(JSON.stringify(other));
    this.shared = shared;
    this.source = source;
  }

  copy() {
    return new Item({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      price: this.price,
      enc: this.enc,
      availability: this.availability,
      properties: JSON.parse(JSON.stringify(this.properties)),
      type: this.type,
      melee: JSON.parse(JSON.stringify(this.melee)),
      ranged: JSON.parse(JSON.stringify(this.ranged)),
      ammunition: JSON.parse(JSON.stringify(this.ammunition)),
      armour: JSON.parse(JSON.stringify(this.armour)),
      grimoire: JSON.parse(JSON.stringify(this.grimoire)),
      container: JSON.parse(JSON.stringify(this.container)),
      other: JSON.parse(JSON.stringify(this.other)),
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  isEqualTo(otherItem: Item): boolean {
    if (
      this.id !== otherItem.id ||
      this.canEdit !== otherItem.canEdit ||
      this.name !== otherItem.name ||
      this.description !== otherItem.description ||
      this.price !== otherItem.price ||
      this.enc !== otherItem.enc ||
      this.availability !== otherItem.availability ||
      !arraysAreEqualIgnoreOrder(this.properties, otherItem.properties) ||
      this.shared !== otherItem.shared ||
      !objectsAreEqual(this.source, otherItem.source)
    ) {
      return false;
    }

    if (this.type === ItemType.Melee) {
      return objectsAreEqual(this.melee, otherItem.melee);
    }
    if (this.type === ItemType.Ranged) {
      return objectsAreEqual(this.ranged, otherItem.ranged);
    }
    if (this.type === ItemType.Ammunition) {
      return objectsAreEqual(this.ammunition, otherItem.ammunition);
    }
    if (this.type === ItemType.Armour) {
      return objectsAreEqual(this.armour, otherItem.armour);
    }
    if (this.type === ItemType.Container) {
      return objectsAreEqual(this.container, otherItem.container);
    }
    if (this.type === ItemType.Other) {
      return objectsAreEqual(this.other, otherItem.other);
    }
    if (this.type === ItemType.Grimoire) {
      return objectsAreEqual(this.grimoire, otherItem.grimoire);
    }

    return true;
  }
}

export function apiResponseToModel(itemApi: ApiResponse<ItemApiData>): Item {
  return new Item({
    id: itemApi.id,
    canEdit: itemApi.canEdit,
    name: itemApi.object.name,
    description: itemApi.object.description,
    price: itemApi.object.price,
    enc: itemApi.object.enc,
    availability: itemApi.object.availability,
    properties: JSON.parse(JSON.stringify(itemApi.object.properties)),
    type: itemApi.object.type,
    melee: JSON.parse(JSON.stringify(itemApi.object.melee)),
    ranged: JSON.parse(JSON.stringify(itemApi.object.ranged)),
    ammunition: JSON.parse(JSON.stringify(itemApi.object.ammunition)),
    armour: JSON.parse(JSON.stringify(itemApi.object.armour)),
    grimoire: JSON.parse(JSON.stringify(itemApi.object.grimoire)),
    container: JSON.parse(JSON.stringify(itemApi.object.container)),
    other: JSON.parse(JSON.stringify(itemApi.object.other)),
    shared: itemApi.object.shared,
    source: copySource(itemApi.object.source),
  });
}

export function modelToApi(item: Item): ItemApiData {
  return {
    name: item.name,
    description: item.description,
    price: item.price,
    enc: item.enc,
    availability: item.availability,
    properties: JSON.parse(JSON.stringify(item.properties)),
    type: item.type,
    melee: JSON.parse(JSON.stringify(item.melee)),
    ranged: JSON.parse(JSON.stringify(item.ranged)),
    ammunition: JSON.parse(JSON.stringify(item.ammunition)),
    armour: JSON.parse(JSON.stringify(item.armour)),
    grimoire: JSON.parse(JSON.stringify(item.grimoire)),
    container: JSON.parse(JSON.stringify(item.container)),
    other: JSON.parse(JSON.stringify(item.other)),
    shared: item.shared,
    source: copySource(item.source),
  };
}

export class MutationApi {
  getElement: (id: string) => Promise<Item>;
  listElements: (id: string) => Promise<Item[]>;
  createElement: (wh: Item) => Promise<ApiResponse<ItemApiData>>;
  updateElement: (wh: Item) => Promise<ApiResponse<ItemApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
