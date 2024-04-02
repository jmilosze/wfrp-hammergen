import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/array.ts";
import { AxiosInstance } from "axios";
import { ApiResponse, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { setsAreEqual } from "../../utils/set.ts";

export const enum ItemType {
  Melee = 0,
  Ranged,
  Ammunition,
  Armour,
  Container,
  Other,
  Grimoire,
}

export const itemTypeList = [
  ItemType.Melee,
  ItemType.Ranged,
  ItemType.Ammunition,
  ItemType.Armour,
  ItemType.Container,
  ItemType.Other,
  ItemType.Grimoire,
];

export function printItemType(itemType: ItemType) {
  switch (itemType) {
    case ItemType.Melee:
      return "Melee";
    case ItemType.Ranged:
      return "Ranged";
    case ItemType.Ammunition:
      return "Ammunition";
    case ItemType.Armour:
      return "Armour";
    case ItemType.Container:
      return "Container";
    case ItemType.Other:
      return "Other";
    case ItemType.Grimoire:
      return "Grimoire";
    default:
      return "";
  }
}

export const enum MeleeGroup {
  Basic = 0,
  Cavalry,
  Fencing,
  Brawling,
  Flail,
  Parry,
  Polearm,
  TwoHanded,
}

export const meleeGroupList = [
  MeleeGroup.Basic,
  MeleeGroup.Cavalry,
  MeleeGroup.Fencing,
  MeleeGroup.Brawling,
  MeleeGroup.Flail,
  MeleeGroup.Parry,
  MeleeGroup.Polearm,
  MeleeGroup.TwoHanded,
];

export function printMeleeGroup(meleeGroup: MeleeGroup) {
  switch (meleeGroup) {
    case MeleeGroup.Basic:
      return "Basic";
    case MeleeGroup.Cavalry:
      return "Cavalry";
    case MeleeGroup.Fencing:
      return "Fencing";
    case MeleeGroup.Brawling:
      return "Brawling";
    case MeleeGroup.Flail:
      return "Flail";
    case MeleeGroup.Parry:
      return "Parry";
    case MeleeGroup.Polearm:
      return "Polearm";
    case MeleeGroup.TwoHanded:
      return "Two-Handed";
    default:
      return "";
  }
}

export const enum RangedGroup {
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

export const rangedGroupList = [
  RangedGroup.Blackpowder,
  RangedGroup.Bow,
  RangedGroup.Crossbow,
  RangedGroup.Engineering,
  RangedGroup.Entangling,
  RangedGroup.Explosives,
  RangedGroup.Sling,
  RangedGroup.Throwing,
  RangedGroup.Blowpipe,
];

export function printRangedGroup(rangedGroup: RangedGroup) {
  switch (rangedGroup) {
    case RangedGroup.Blackpowder:
      return "Blackpowder";
    case RangedGroup.Bow:
      return "Bow";
    case RangedGroup.Crossbow:
      return "Crossbow";
    case RangedGroup.Engineering:
      return "Engineering";
    case RangedGroup.Entangling:
      return "Entangling";
    case RangedGroup.Explosives:
      return "Explosives";
    case RangedGroup.Sling:
      return "Sling";
    case RangedGroup.Throwing:
      return "Throwing";
    case RangedGroup.Blowpipe:
      return "Blowpipe";
    default:
      return "";
  }
}

export const enum AmmoGroup {
  BlackpowderAndEngineering = 0,
  Bow,
  Crossbow,
  Sling,
  Entangling,
  Blowpipe,
}

export const ammoGroupList = [
  AmmoGroup.BlackpowderAndEngineering,
  AmmoGroup.Bow,
  AmmoGroup.Crossbow,
  AmmoGroup.Sling,
  AmmoGroup.Entangling,
  AmmoGroup.Blowpipe,
];

export function printAmmoGroup(ammoGroup: AmmoGroup) {
  switch (ammoGroup) {
    case AmmoGroup.BlackpowderAndEngineering:
      return "Blackpowder and engineering";
    case AmmoGroup.Bow:
      return "Bow";
    case AmmoGroup.Crossbow:
      return "Crossbow";
    case AmmoGroup.Sling:
      return "Sling";
    case AmmoGroup.Entangling:
      return "Entangling";
    case AmmoGroup.Blowpipe:
      return "Blowpipe";
    default:
      return "";
  }
}

export const enum ArmourGroup {
  SoftLeather = 0,
  BoiledLeather,
  Mail,
  Plate,
  SoftKit,
  Brigandine,
}

export const armourGroupList = [
  ArmourGroup.SoftLeather,
  ArmourGroup.BoiledLeather,
  ArmourGroup.Mail,
  ArmourGroup.Plate,
  ArmourGroup.SoftKit,
  ArmourGroup.Brigandine,
];

export function printArmourGroup(armourGroup: ArmourGroup) {
  switch (armourGroup) {
    case ArmourGroup.SoftLeather:
      return "Soft leather";
    case ArmourGroup.BoiledLeather:
      return "Boiled leather";
    case ArmourGroup.Mail:
      return "Mail";
    case ArmourGroup.Plate:
      return "Plate";
    case ArmourGroup.SoftKit:
      return "Soft kit";
    case ArmourGroup.Brigandine:
      return "Brigandine";
    default:
      return "";
  }
}

export const enum ArmourLocation {
  Arms = 0,
  Body,
  Legs,
  Head,
}

export function printArmourLocation(armourLocation: ArmourLocation) {
  switch (armourLocation) {
    case ArmourLocation.Arms:
      return "Arms";
    case ArmourLocation.Body:
      return "Body";
    case ArmourLocation.Legs:
      return "Legs";
    case ArmourLocation.Head:
      return "Head";
    default:
      return "";
  }
}

export const enum MeleeReach {
  Personal = 0,
  VeryShort,
  Short,
  Average,
  Long,
  VeryLong,
  Massive,
}

export function printMeleeReach(meleeReach: MeleeReach) {
  switch (meleeReach) {
    case MeleeReach.Personal:
      return "Personal";
    case MeleeReach.VeryShort:
      return "Very Short";
    case MeleeReach.Short:
      return "Short";
    case MeleeReach.Average:
      return "Average";
    case MeleeReach.Long:
      return "Long";
    case MeleeReach.VeryLong:
      return "VeryLong";
    case MeleeReach.Massive:
      return "Massive";
    default:
      return "";
  }
}

export const enum WeaponHands {
  Any = 0,
  OneHanded,
  TwoHanded,
}

export const enum Availability {
  Common = 0,
  Scarce,
  Rare,
  Exotic,
}

export const availabilityList = [Availability.Common, Availability.Scarce, Availability.Rare, Availability.Exotic];

export function printAvailability(availability: Availability) {
  switch (availability) {
    case Availability.Common:
      return "Common";
    case Availability.Scarce:
      return "Scarce";
    case Availability.Rare:
      return "Rare";
    case Availability.Exotic:
      return "Exotic";
    default:
      return "";
  }
}

export const enum CarryType {
  CarriableAndWearable = 0,
  CarriableAndNotWearable,
  NotCarriableAndNotWearable,
}

const API_BASE_PATH = "/api/wh/item";

export type MeleeType = {
  hands: WeaponHands;
  dmg: number;
  dmgSbMult: number;
  reach: MeleeReach;
  group: MeleeGroup;
};

export type RangedType = {
  hands: WeaponHands;
  dmg: number;
  dmgSbMult: number;
  rng: number;
  rngSbMult: number;
  group: RangedGroup;
};

export type AmmoType = {
  dmg: number;
  rng: number;
  rngMult: number;
  group: AmmoGroup;
};

export type ArmourType = {
  points: number;
  location: ArmourLocation[];
  group: ArmourGroup;
};

export type ContainerType = {
  capacity: number;
  carryType: CarryType;
};

export type OtherType = {
  carryType: CarryType;
};

export interface ItemApiData {
  name: string;
  description: string;
  price: number;
  enc: number;
  availability: Availability;
  properties: string[];
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: string[] };
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
  availability: Availability;
  properties: Set<string>;
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: Set<string> };
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
    availability = Availability.Common,
    properties = new Set<string>(),
    type = ItemType.Melee,
    melee = {
      hands: WeaponHands.OneHanded,
      dmg: 0,
      dmgSbMult: 0,
      reach: MeleeReach.Personal,
      group: MeleeGroup.Basic,
    } as MeleeType,
    ranged = {
      hands: WeaponHands.OneHanded,
      dmg: 0,
      dmgSbMult: 0,
      rng: 0,
      rngSbMult: 0,
      group: RangedGroup.Bow,
    } as RangedType,
    ammunition = { dmg: 0, rng: 0, rngMult: 0, group: AmmoGroup.Bow } as AmmoType,
    armour = { points: 0, location: [], group: ArmourGroup.SoftLeather } as ArmourType,
    grimoire = { spells: new Set<string>() },
    container = { capacity: 1, carryType: CarryType.NotCarriableAndNotWearable } as ContainerType,
    other = { carryType: CarryType.NotCarriableAndNotWearable } as OtherType,
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
    this.properties = properties;
    this.type = type;
    this.melee = melee;
    this.ranged = ranged;
    this.ammunition = ammunition;
    this.armour = armour;
    this.grimoire = grimoire;
    this.container = container;
    this.other = other;
    this.shared = shared;
    this.source = source;
  }

  copy(): Item {
    return new Item({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      price: this.price,
      enc: this.enc,
      availability: this.availability,
      properties: new Set(this.properties),
      type: this.type,
      melee: {
        hands: this.melee.hands,
        dmg: this.melee.dmg,
        dmgSbMult: this.melee.dmgSbMult,
        reach: this.melee.reach,
        group: this.melee.group,
      },
      ranged: {
        hands: this.ranged.hands,
        dmg: this.ranged.dmg,
        dmgSbMult: this.ranged.dmgSbMult,
        rng: this.ranged.rng,
        rngSbMult: this.ranged.rngSbMult,
        group: this.ranged.group,
      },
      ammunition: {
        dmg: this.ammunition.dmg,
        rng: this.ammunition.rng,
        rngMult: this.ammunition.rngMult,
        group: this.ammunition.group,
      },
      armour: {
        points: this.armour.points,
        location: [...this.armour.location],
        group: this.armour.group,
      },
      grimoire: { spells: new Set(this.grimoire.spells) },
      container: { capacity: this.container.capacity, carryType: this.container.carryType },
      other: { carryType: this.other.carryType },
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validShortDescFn(this.description);
  }

  isValid(): boolean {
    return (
      this.validateName().valid && this.validateDescription().valid && sourceIsValid(this.source)
      // Finish implementation
    );
  }

  isEqualTo(otherItem: WhProperty): boolean {
    if (!(otherItem instanceof Item)) {
      return false;
    }

    if (
      this.id !== otherItem.id ||
      this.canEdit !== otherItem.canEdit ||
      this.name !== otherItem.name ||
      this.description !== otherItem.description ||
      this.price !== otherItem.price ||
      this.enc !== otherItem.enc ||
      this.availability !== otherItem.availability ||
      this.type !== otherItem.type ||
      !setsAreEqual(this.properties, otherItem.properties) ||
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
      return (
        this.armour.group === otherItem.armour.group &&
        this.armour.points === otherItem.armour.points &&
        arraysAreEqualIgnoreOrder(this.armour.location, otherItem.armour.location)
      );
    }
    if (this.type === ItemType.Container) {
      return objectsAreEqual(this.container, otherItem.container);
    }
    if (this.type === ItemType.Other) {
      return objectsAreEqual(this.other, otherItem.other);
    }
    if (this.type === ItemType.Grimoire) {
      return setsAreEqual(this.grimoire.spells, otherItem.grimoire.spells);
    }

    return true;
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(itemApi: ApiResponse<ItemApiData>): Item {
  const newItem = new Item({
    id: itemApi.id,
    canEdit: itemApi.canEdit,
    name: itemApi.object.name,
    description: itemApi.object.description,
    price: itemApi.object.price,
    enc: itemApi.object.enc,
    availability: itemApi.object.availability,
    properties: new Set(itemApi.object.properties),
    type: itemApi.object.type,
    melee: itemApi.object.melee,
    ranged: itemApi.object.ranged,
    ammunition: itemApi.object.ammunition,
    armour: itemApi.object.armour,
    grimoire: { spells: new Set(itemApi.object.grimoire.spells) },
    container: itemApi.object.container,
    other: itemApi.object.other,
    shared: itemApi.object.shared,
    source: itemApi.object.source,
  });

  return newItem.copy();
}

export function modelToApi(item: Item): ItemApiData {
  return {
    name: item.name,
    description: item.description,
    price: item.price,
    enc: item.enc,
    availability: item.availability,
    properties: [...item.properties],
    type: item.type,
    melee: {
      hands: item.melee.hands,
      dmg: item.melee.dmg,
      dmgSbMult: item.melee.dmgSbMult,
      reach: item.melee.reach,
      group: item.melee.group,
    },
    ranged: {
      hands: item.ranged.hands,
      dmg: item.ranged.dmg,
      dmgSbMult: item.ranged.dmgSbMult,
      rng: item.ranged.rng,
      rngSbMult: item.ranged.rngSbMult,
      group: item.ranged.group,
    },
    ammunition: {
      dmg: item.ammunition.dmg,
      rng: item.ammunition.rng,
      rngMult: item.ammunition.rngMult,
      group: item.ammunition.group,
    },
    armour: {
      points: item.armour.points,
      location: [...item.armour.location],
      group: item.armour.group,
    },
    grimoire: { spells: [...item.grimoire.spells] },
    container: { capacity: item.container.capacity, carryType: item.container.carryType },
    other: { carryType: item.other.carryType },
    shared: item.shared,
    source: copySource(item.source),
  };
}

export class ItemApi implements WhApi<Item, ItemApiData> {
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
