import { copySource, Source } from "./source.ts";
import { WhProperty } from "./crudGenerator.ts";

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

// const API_BASE_PATH = "/api/wh/item";

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
      melee: JSON.parse(JSON.stringify(this.melee)),
      ranged: JSON.parse(JSON.stringify(this.ranged)),
      ammunition: JSON.parse(JSON.stringify(this.ammunition)),
      armour: JSON.parse(JSON.stringify(this.armour)),
      grimoire: JSON.parse(JSON.stringify(this.grimoire)),
      container: JSON.parse(JSON.stringify(this.container)),
      other: JSON.parse(JSON.stringify(this.other)),
      type: this.type,
      shared: this.shared,
      source: copySource(this.source),
    });
  }
}
