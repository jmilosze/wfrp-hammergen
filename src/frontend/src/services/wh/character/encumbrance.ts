// Encumbrance of a character's equipped and carried trappings; the same rules in both editions.
import { ItemType } from "@/services/wh/content/item.ts";
import { IdNumberValue } from "@/utils/idNumberValue.ts";

export interface EncumbranceItem {
  type: ItemType;
  enc: number;
  capacity: number;
  number: number;
}

export interface Encumbrance {
  weapons: number;
  armour: number;
  otherEquipped: number;
  carried: number;
  inContainers: number;
  containerCapacity: number;
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
  // Packs and Containers (4e p. 301, 5e p. 308): only the container's own Enc counts, so carried trappings up to the
  // equipped and carried containers' Carries count 0. Which trappings fit is left to the player.
  const containerCapacity = sum(
    [...equipped, ...carried].filter((x) => x.type === ItemType.Container).map((x) => x.capacity * x.number),
  );
  const carriedContainers = sum(carried.filter((x) => x.type === ItemType.Container).map((x) => x.enc * x.number));
  const carriedOther = sum(carried.filter((x) => x.type !== ItemType.Container).map((x) => x.enc * x.number));
  const inContainers = Math.min(carriedOther, containerCapacity);
  const carriedEnc = carriedContainers + carriedOther - inContainers;
  return {
    weapons: weapons,
    armour: armour,
    otherEquipped: otherEquipped,
    carried: carriedEnc,
    inContainers: inContainers,
    containerCapacity: containerCapacity,
    total: weapons + armour + otherEquipped + carriedEnc,
  };
}

// encumbranceItems pairs the character's trappings (entries with quantities) with the items' type, Enc and container
// capacity. Ids missing from the list (e.g. while it is still loading) are left out.
export function encumbranceItems(
  selected: IdNumberValue[],
  items: { id: string; type: ItemType; enc: number; container: { capacity: number } }[],
): EncumbranceItem[] {
  const byId = new Map(items.map((x) => [x.id, x]));
  return selected.flatMap((entry) => {
    const item = byId.get(entry.id);
    return item ? [{ type: item.type, enc: item.enc, capacity: item.container.capacity, number: entry.number }] : [];
  });
}
