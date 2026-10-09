import { copySource, Source, sourceIsValid } from "../core/source.ts";
import { defineContentApi, ApiResponse } from "../core/api.ts";
import { Edition, variant } from "../core/edition.ts";
import {
  validateIdNumber,
  validFloatFn,
  validIntegerFn,
  validLongDescFn,
  validShortDescFn,
} from "../core/validators.ts";
import { Visibility, WhEntity } from "../core/entity.ts";
import { ValidationStatus } from "../../../utils/validation.ts";
import { updateSet } from "../../../utils/set.ts";
import { IdNumber, idNumberArrayToRecord, updateIdNumberRecord } from "../../../utils/idNumber.ts";
import { isEqualEntity } from "../../../utils/equal.ts";
import { IdValue, validateValues } from "../../../utils/idValue.ts";
export {
  BRASS_PER_GOLD,
  BRASS_PER_SILVER,
  SILVER_PER_GOLD,
  brassToCoins,
  coinsToBrass,
  printPrice,
  type Coins,
} from "../../../utils/currency.ts";

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
  Engineering,
}

// Melee groups of each edition; 5e has no Parry or Engineering group.
export const meleeGroupsByEdition: Record<Edition, MeleeGroup[]> = {
  "4e": [
    MeleeGroup.Basic,
    MeleeGroup.Cavalry,
    MeleeGroup.Fencing,
    MeleeGroup.Brawling,
    MeleeGroup.Flail,
    MeleeGroup.Parry,
    MeleeGroup.Polearm,
    MeleeGroup.TwoHanded,
    MeleeGroup.Engineering,
  ],
  "5e": [
    MeleeGroup.Basic,
    MeleeGroup.Cavalry,
    MeleeGroup.Fencing,
    MeleeGroup.Brawling,
    MeleeGroup.Flail,
    MeleeGroup.Polearm,
    MeleeGroup.TwoHanded,
  ],
};

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
    case MeleeGroup.Engineering:
      return "Engineering";
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
  Other,
  Leather,
  Shield,
}

// Armour groups of each edition; in 5e shields are armour.
export const armourGroupsByEdition: Record<Edition, ArmourGroup[]> = {
  "4e": [
    ArmourGroup.SoftLeather,
    ArmourGroup.BoiledLeather,
    ArmourGroup.Mail,
    ArmourGroup.Plate,
    ArmourGroup.SoftKit,
    ArmourGroup.Brigandine,
    ArmourGroup.Other,
  ],
  "5e": [ArmourGroup.Leather, ArmourGroup.Mail, ArmourGroup.Plate, ArmourGroup.Shield, ArmourGroup.Other],
};

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
    case ArmourGroup.Other:
      return "Other";
    case ArmourGroup.Leather:
      return "Leather";
    case ArmourGroup.Shield:
      return "Shield";
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

export const armourLocationList: ArmourLocation[] = [
  ArmourLocation.Arms,
  ArmourLocation.Body,
  ArmourLocation.Legs,
  ArmourLocation.Head,
];

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

export const meleeReachList: MeleeReach[] = [
  MeleeReach.Personal,
  MeleeReach.VeryShort,
  MeleeReach.Short,
  MeleeReach.Average,
  MeleeReach.Long,
  MeleeReach.VeryLong,
  MeleeReach.Massive,
];

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
      return "Very Long";
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

export const weaponHandsList = [WeaponHands.Any, WeaponHands.OneHanded, WeaponHands.TwoHanded];

export function printWeaponHands(weaponHands: WeaponHands) {
  switch (weaponHands) {
    case WeaponHands.Any:
      return "Any";
    case WeaponHands.OneHanded:
      return "One-handed";
    case WeaponHands.TwoHanded:
      return "Two-handed";
    default:
      return "";
  }
}

export const enum Availability {
  Common = 0,
  Scarce,
  Rare,
  Exotic,
  Unique = 4,
}

export const availabilityList = [
  Availability.Common,
  Availability.Scarce,
  Availability.Rare,
  Availability.Exotic,
  Availability.Unique,
];

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
    case Availability.Unique:
      return "Unique";
    default:
      return "";
  }
}

export const enum CarryType {
  CarriableAndWearable = 0,
  CarriableAndNotWearable,
  NotCarriableAndNotWearable,
}

export const carryTypeList: CarryType[] = [
  CarryType.CarriableAndWearable,
  CarryType.CarriableAndNotWearable,
  CarryType.NotCarriableAndNotWearable,
];

export function printCarryType(carryType: CarryType): string {
  switch (carryType) {
    case CarryType.CarriableAndWearable:
      return "Can be carried and worn";
    case CarryType.CarriableAndNotWearable:
      return "Can be carried";
    case CarryType.NotCarriableAndNotWearable:
      return "Cannot be carried";
    default:
      return "";
  }
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
  properties: IdValue[];
  runes: IdNumber[];
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: string[] };
  container: ContainerType;
  other: OtherType;
  source: Source;
}

const ITEM_SUBTYPE_KEYS: Record<ItemType, string> = {
  [ItemType.Melee]: "melee",
  [ItemType.Ranged]: "ranged",
  [ItemType.Ammunition]: "ammunition",
  [ItemType.Armour]: "armour",
  [ItemType.Grimoire]: "grimoire",
  [ItemType.Container]: "container",
  [ItemType.Other]: "other",
};

const ALL_SUBTYPE_KEYS = ["melee", "ranged", "ammunition", "armour", "grimoire", "container", "other"];

export class Item extends WhEntity {
  price: number;
  enc: number;
  availability: Availability;
  // Values of the item's qualities and flaws by id.
  properties: Record<string, string>;
  runes: Record<string, number>;
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: Set<string> };
  container: ContainerType;
  other: OtherType;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    price = 0,
    enc = 0,
    availability = Availability.Common,
    properties = {} as Record<string, string>,
    runes = {} as Record<string, number>,
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
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.price = price;
    this.enc = enc;
    this.availability = availability;
    this.properties = properties;
    this.runes = runes;
    this.type = type;
    this.melee = melee;
    this.ranged = ranged;
    this.ammunition = ammunition;
    this.armour = armour;
    this.grimoire = grimoire;
    this.container = container;
    this.other = other;
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validatePrice(): ValidationStatus {
    return validFloatFn(this.price, 0, 24000000000);
  }

  validateEnc(): ValidationStatus {
    return validFloatFn(this.enc, 0, 1000);
  }

  validateMeleeDmgSbMult(): ValidationStatus {
    return validFloatFn(this.melee.dmgSbMult, 0, 10);
  }

  validateMeleeDmg(): ValidationStatus {
    return validIntegerFn(this.melee.dmg, -100, 100);
  }

  validateRangedDmgSbMult(): ValidationStatus {
    return validFloatFn(this.ranged.dmgSbMult, 0, 10);
  }

  validateRangedDmg(): ValidationStatus {
    return validIntegerFn(this.ranged.dmg, -100, 100);
  }

  validateRangedRngSbMult(): ValidationStatus {
    return validFloatFn(this.ranged.rngSbMult, 0, 10);
  }

  validateRangedRng(): ValidationStatus {
    return validIntegerFn(this.ranged.rng, -10000, 10000);
  }

  validateAmmunitionDmg(): ValidationStatus {
    return validIntegerFn(this.ammunition.dmg, -100, 100);
  }

  validateAmmunitionRngMult(): ValidationStatus {
    return validFloatFn(this.ammunition.rngMult, 0, 10);
  }

  validateAmmunitionRng(): ValidationStatus {
    return validIntegerFn(this.ammunition.rng, -10000, 10000);
  }

  validateArmourPoints(): ValidationStatus {
    return validIntegerFn(this.armour.points, 0, 100);
  }

  validateContainerCapacity(): ValidationStatus {
    return validIntegerFn(this.container.capacity, 0, 1000);
  }

  validateRunes(): ValidationStatus {
    return validateIdNumber("Rune number", this.runes, 1, 1000);
  }

  // forEdition resets weapon and armour groups the edition doesn't have.
  forEdition(edition: Edition): this {
    const variant = super.forEdition(edition);
    if (!meleeGroupsByEdition[edition].includes(variant.melee.group)) {
      variant.melee.group = meleeGroupsByEdition[edition][0];
    }
    if (!armourGroupsByEdition[edition].includes(variant.armour.group)) {
      variant.armour.group = armourGroupsByEdition[edition][0];
    }
    return variant;
  }

  validateProperties(): ValidationStatus {
    return validateValues("Quality and flaw", Object.values(this.properties));
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      sourceIsValid(this.source) &&
      this.validatePrice().valid &&
      this.validateEnc().valid &&
      this.validateMeleeDmgSbMult().valid &&
      this.validateMeleeDmg().valid &&
      this.validateRangedDmgSbMult().valid &&
      this.validateRangedDmg().valid &&
      this.validateRangedRngSbMult().valid &&
      this.validateRangedRng().valid &&
      this.validateAmmunitionDmg().valid &&
      this.validateAmmunitionRngMult().valid &&
      this.validateAmmunitionRng().valid &&
      this.validateArmourPoints().valid &&
      this.validateContainerCapacity().valid &&
      this.validateRunes().valid &&
      this.validateProperties().valid
    );
  }

  override isEqualTo(otherItem: unknown): boolean {
    const activeKey = ITEM_SUBTYPE_KEYS[this.type];
    const ignoredKeys = new Set(ALL_SUBTYPE_KEYS.filter((k) => k !== activeKey));
    return isEqualEntity(this, otherItem, { ignoredKeys });
  }

  resetDetails() {
    this.properties = {} as Record<string, string>;
    this.runes = {} as Record<string, number>;

    if (this.type !== ItemType.Melee) {
      this.melee = {
        hands: WeaponHands.OneHanded,
        dmg: 0,
        dmgSbMult: 0,
        reach: MeleeReach.Personal,
        group: MeleeGroup.Basic,
      };
    }

    if (this.type !== ItemType.Ranged) {
      this.ranged = {
        hands: WeaponHands.OneHanded,
        dmg: 0,
        dmgSbMult: 0,
        rng: 0,
        rngSbMult: 0,
        group: RangedGroup.Bow,
      };
    }

    if (this.type !== ItemType.Ammunition) {
      this.ammunition = { dmg: 0, rng: 0, rngMult: 0, group: AmmoGroup.Bow };
    }

    if (this.type !== ItemType.Armour) {
      this.armour = { points: 0, location: [], group: ArmourGroup.SoftLeather };
    }

    if (this.type !== ItemType.Grimoire) {
      this.grimoire = { spells: new Set<string>() };
    }

    if (this.type !== ItemType.Container) {
      this.container = { capacity: 1, carryType: CarryType.NotCarriableAndNotWearable };
    }

    if (this.type !== ItemType.Other) {
      this.other = { carryType: CarryType.NotCarriableAndNotWearable };
    }
  }

  updateProperties(id: string, selected: boolean): void {
    if (selected) {
      if (!(id in this.properties)) {
        this.properties[id] = "";
      }
    } else {
      delete this.properties[id];
    }
  }

  updatePropertyValue(id: string, value: string): void {
    this.properties[id] = value;
  }

  updateRunes(id: string, number: number): void {
    updateIdNumberRecord(this.runes, { id: id, number: number });
  }

  updateSpells(id: string, selected: boolean): void {
    updateSet(this.grimoire.spells, id, selected);
  }

  canBeEquipped(): boolean {
    if (
      [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition, ItemType.Armour, ItemType.Grimoire].includes(this.type)
    ) {
      return true;
    }

    if (this.type === ItemType.Container && this.container.carryType === CarryType.CarriableAndWearable) {
      return true;
    }

    return this.type === ItemType.Other && this.other.carryType === CarryType.CarriableAndWearable;
  }

  canBeCarried(): boolean {
    if (
      [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition, ItemType.Armour, ItemType.Grimoire].includes(this.type)
    ) {
      return true;
    }

    if (
      this.type === ItemType.Container &&
      (this.container.carryType === CarryType.CarriableAndWearable ||
        this.container.carryType === CarryType.CarriableAndNotWearable)
    ) {
      return true;
    }

    return (
      this.type === ItemType.Other &&
      (this.other.carryType === CarryType.CarriableAndWearable ||
        this.other.carryType === CarryType.CarriableAndNotWearable)
    );
  }
}

export function apiResponseToModel(itemApi: ApiResponse<ItemApiData>, edition: Edition): Item {
  const data = variant(itemApi, edition);
  const newItem = new Item({
    id: itemApi.id,
    ownerId: itemApi.ownerId,
    visibility: itemApi.visibility,
    name: data.name,
    description: data.description,
    price: data.price,
    enc: data.enc,
    availability: data.availability,
    properties: Object.fromEntries(data.properties.map((x) => [x.id, x.value])),
    runes: idNumberArrayToRecord(data.runes),
    type: data.type,
    melee: data.melee,
    ranged: data.ranged,
    ammunition: data.ammunition,
    armour: data.armour,
    grimoire: { spells: new Set(data.grimoire.spells) },
    container: data.container,
    other: data.other,
    source: data.source,
  });

  return newItem;
}

export function modelToApi(item: Item): ItemApiData {
  return {
    name: item.name,
    description: item.description,
    price: item.price,
    enc: item.enc,
    availability: item.availability,
    properties: Object.entries(item.properties).map(([id, value]) => ({ id: id, value: value })),
    runes: Object.entries(item.runes).map((x) => ({ id: x[0], number: x[1] })),
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
    source: copySource(item.source),
  };
}

export const itemApi = defineContentApi<Item, ItemApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);
