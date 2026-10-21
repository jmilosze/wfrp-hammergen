// Encumbrance of a character's equipped and carried trappings; the same rules in both editions.
import { ItemType } from "@/services/wh/content/item.ts";
import { IdNumberValue } from "@/utils/idNumberValue.ts";

export interface EncumbranceItem {
  type: ItemType;
  enc: number;
  number: number;
}

export interface Encumbrance {
  weapons: number;
  armour: number;
  otherEquipped: number;
  carried: number;
  total: number;
}

const WEAPON_TYPES = [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition];
const OTHER_TYPES = [ItemType.Container, ItemType.Other];

// Worn items (armour, clothing and other equipped trappings) count 1 less, often 0.
function wornEnc(item: EncumbranceItem): number {
  return Math.max(item.enc - 1, 0) * item.number;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function getEncumbrance(equipped: EncumbranceItem[], carried: EncumbranceItem[]): Encumbrance {
  const weapons = sum(equipped.filter((x) => WEAPON_TYPES.includes(x.type)).map((x) => x.enc * x.number));
  const armour = sum(equipped.filter((x) => x.type === ItemType.Armour).map(wornEnc));
  const otherEquipped = sum(equipped.filter((x) => OTHER_TYPES.includes(x.type)).map(wornEnc));
  const carriedEnc = sum(carried.map((x) => x.enc * x.number));
  return {
    weapons: weapons,
    armour: armour,
    otherEquipped: otherEquipped,
    carried: carriedEnc,
    total: weapons + armour + otherEquipped + carriedEnc,
  };
}

// encumbranceItems pairs the character's trappings (entries with quantities) with the items' type and Enc. Ids missing
// from the list (e.g. while it is still loading) are left out.
export function encumbranceItems(
  selected: IdNumberValue[],
  items: { id: string; type: ItemType; enc: number }[],
): EncumbranceItem[] {
  const byId = new Map(items.map((x) => [x.id, x]));
  return selected.flatMap((entry) => {
    const item = byId.get(entry.id);
    return item ? [{ type: item.type, enc: item.enc, number: entry.number }] : [];
  });
}
