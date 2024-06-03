import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { Source, copySource, updateSource, sourceIsValid } from "./source.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { ApiResponse, validLongDescFn, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { setValidationStatus, ValidationStatus } from "../../utils/validation.ts";
import { setsAreEqual } from "../../utils/set.ts";

const CASTING_NUMBER_RE = /^([1-9][0-9]|[0-9])$/;
const API_BASE_PATH = "/api/wh/spell";

export const enum SpellType {
  SpellTypeOther = 0,
  SpellTypePetty = 1,
  SpellTypeArcane = 2,
  SpellTypeLore = 3,
}

export const spellTypeList = [
  SpellType.SpellTypePetty,
  SpellType.SpellTypeArcane,
  SpellType.SpellTypeLore,
  SpellType.SpellTypeOther,
];

export function printSpellType(spellType: SpellType): string {
  switch (spellType) {
    case SpellType.SpellTypeOther:
      return "Other spell";
    case SpellType.SpellTypePetty:
      return "Petty spell";
    case SpellType.SpellTypeArcane:
      return "Arcane spell";
    case SpellType.SpellTypeLore:
      return "Lore spell";
    default:
      return "";
  }
}

export const enum SpellLabel {
  // Lore labels
  SpellLabelBeasts = 0,
  SpellLabelDeath = 1,
  SpellLabelFire = 3,
  SpellLabelHeavens = 4,
  SpellLabelLife = 5,
  SpellLabelLight = 6,
  SpellLabelMetal = 7,
  SpellLabelShadows = 8,
  SpellLabelDaemonology = 9,
  SpellLabelNecromancy = 10,
  SpellLabelHedgecraft = 11,
  SpellLabelWitchcraft = 12,
  SpellLabelNurgle = 13,
  SpellLabelSlaanesh = 14,
  SpellLabelTzeentch = 15,
  SpellLabelHighGeneral = 16,
  SpellLabelHighSlann = 17,
  SpellLabelBigWaaagh = 18,
  SpellLabelLittleWaaagh = 19,
  SpellLabelPlague = 20,
  SpellLabelRuin = 21,
  SpellLabelStealth = 22,
  SpellLabelGreatMaw = 23,
  // Other labels
  SpellLabelCustom = 1000,
  SpellLabelRitual = 1001,
  SpellLabelSkaven = 1002,
  SpellLabelChaos = 1003,
  SpellLabelFimirMarsh = 1004,
  // Derived labels
  SpellLabelLoreAny = 100,
  SpellLabelLoreColour = 101,
  SpellLabelLoreDark = 102,
  SpellLabelLoreWitch = 103,
  SpellLabelLoreChaos = 104,
  SpellLabelLoreHighMagic = 105,
  SpellLabelLoreWaaagh = 106,
  SpellLabelLoreSkaven = 107,
}

export function printSpellLabel(spellLabel: SpellLabel): string {
  switch (spellLabel) {
    case SpellLabel.SpellLabelSkaven:
      return "Skaven";
    case SpellLabel.SpellLabelChaos:
      return "Chaos";
    case SpellLabel.SpellLabelFimirMarsh:
      return "Fimir Marsh Magic";
    case SpellLabel.SpellLabelLight:
      return "The Lore of Light";
    case SpellLabel.SpellLabelMetal:
      return "The Lore of Metal";
    case SpellLabel.SpellLabelLife:
      return "The Lore of Life";
    case SpellLabel.SpellLabelHeavens:
      return "The Lore of Heavens";
    case SpellLabel.SpellLabelShadows:
      return "The Lore of Shadows";
    case SpellLabel.SpellLabelDeath:
      return "The Lore of Death";
    case SpellLabel.SpellLabelFire:
      return "The Lore of Fire";
    case SpellLabel.SpellLabelBeasts:
      return "The Lore of Beasts";
    case SpellLabel.SpellLabelDaemonology:
      return "The Lore of Daemonology";
    case SpellLabel.SpellLabelNecromancy:
      return "The Lore of Necromancy";
    case SpellLabel.SpellLabelHedgecraft:
      return "The Lore of Hedgecraft";
    case SpellLabel.SpellLabelWitchcraft:
      return "The Lore of Witchcraft";
    case SpellLabel.SpellLabelNurgle:
      return "The Lore of Nurgle";
    case SpellLabel.SpellLabelSlaanesh:
      return "The Lore of Slaanesh";
    case SpellLabel.SpellLabelTzeentch:
      return "The Lore of Tzeentch";
    case SpellLabel.SpellLabelHighGeneral:
      return "General High Magic";
    case SpellLabel.SpellLabelHighSlann:
      return "Slann High Magic";
    case SpellLabel.SpellLabelGreatMaw:
      return "The Lore of The Great Maw";
    case SpellLabel.SpellLabelLittleWaaagh:
      return "The Lore of Little Waaagh!";
    case SpellLabel.SpellLabelBigWaaagh:
      return "The Lore of Big Waaagh!";
    case SpellLabel.SpellLabelPlague:
      return "The Lore of Plague";
    case SpellLabel.SpellLabelStealth:
      return "The Lore of Stealth";
    case SpellLabel.SpellLabelRuin:
      return "The Lore of Ruin.";
    case SpellLabel.SpellLabelCustom:
      return "Custom Spell";
    case SpellLabel.SpellLabelRitual:
      return "Ritual";
    case SpellLabel.SpellLabelLoreAny:
      return "Any Lore";
    case SpellLabel.SpellLabelLoreColour:
      return "Any Colour Lore";
    case SpellLabel.SpellLabelLoreDark:
      return "Any Dark Lore";
    case SpellLabel.SpellLabelLoreWitch:
      return "Any Witch Lore";
    case SpellLabel.SpellLabelLoreChaos:
      return "Any Chaos Lore";
    case SpellLabel.SpellLabelLoreHighMagic:
      return "Any High Magic Lore";
    case SpellLabel.SpellLabelLoreWaaagh:
      return "Any Waaagh! Lore";
    case SpellLabel.SpellLabelLoreSkaven:
      return "Any Skaven Lore";
    default:
      return "";
  }
}

export const colourLores = new Set([
  SpellLabel.SpellLabelLight,
  SpellLabel.SpellLabelMetal,
  SpellLabel.SpellLabelLife,
  SpellLabel.SpellLabelHeavens,
  SpellLabel.SpellLabelShadows,
  SpellLabel.SpellLabelDeath,
  SpellLabel.SpellLabelFire,
  SpellLabel.SpellLabelBeasts,
]);
export const darkLores = new Set([SpellLabel.SpellLabelDaemonology, SpellLabel.SpellLabelNecromancy]);
export const witchLores = new Set([SpellLabel.SpellLabelHedgecraft, SpellLabel.SpellLabelWitchcraft]);
export const chaosLores = new Set([
  SpellLabel.SpellLabelNurgle,
  SpellLabel.SpellLabelSlaanesh,
  SpellLabel.SpellLabelTzeentch,
]);
export const highMagicLores = new Set([SpellLabel.SpellLabelHighGeneral, SpellLabel.SpellLabelHighSlann]);
export const waaaghLores = new Set([SpellLabel.SpellLabelBigWaaagh, SpellLabel.SpellLabelLittleWaaagh]);
export const skavenLores = new Set([
  SpellLabel.SpellLabelPlague,
  SpellLabel.SpellLabelStealth,
  SpellLabel.SpellLabelRuin,
]);
export const otherLores = new Set([SpellLabel.SpellLabelGreatMaw]);
export const allLores = new Set(
  [...colourLores].concat(
    [...darkLores],
    [...witchLores],
    [...chaosLores],
    [...highMagicLores],
    [...waaaghLores],
    [...skavenLores],
    [...otherLores],
  ),
);

export function getAllowedLabels(spellType: SpellType): SpellLabel[] {
  if (spellType === SpellType.SpellTypePetty || spellType === SpellType.SpellTypeArcane) {
    return [SpellLabel.SpellLabelSkaven, SpellLabel.SpellLabelChaos];
  } else if (spellType === SpellType.SpellTypeOther) {
    return [SpellLabel.SpellLabelFimirMarsh, SpellLabel.SpellLabelCustom];
  } else if (spellType === SpellType.SpellTypeLore) {
    return [...allLores, SpellLabel.SpellLabelRitual];
  } else {
    return [];
  }
}

export function extractGroupFromLabels(
  allLabels: Set<SpellLabel>,
  labelGroup: Set<SpellLabel>,
): { extracted: Set<SpellLabel>; remaining: Set<SpellLabel>; all: boolean } {
  const ret = { extracted: new Set(), remaining: new Set(), all: false } as {
    extracted: Set<SpellLabel>;
    remaining: Set<SpellLabel>;
    all: boolean;
  };
  for (const label of allLabels) {
    if (labelGroup.has(label)) {
      ret.extracted.add(label);
    } else {
      ret.remaining.add(label);
    }
  }

  if (ret.extracted.size === labelGroup.size) {
    ret.all = true;
  }

  return ret;
}

export function getSimplifiedLabels(spellType: SpellType, allLabels: Set<SpellLabel>): Set<SpellLabel> {
  if (spellType !== SpellType.SpellTypeLore) {
    return allLabels;
  }

  const colour = extractGroupFromLabels(allLabels, colourLores);
  const dark = extractGroupFromLabels(colour.remaining, darkLores);
  const witch = extractGroupFromLabels(dark.remaining, witchLores);
  const chaos = extractGroupFromLabels(witch.remaining, chaosLores);
  const highMagic = extractGroupFromLabels(chaos.remaining, highMagicLores);
  const waaagh = extractGroupFromLabels(highMagic.remaining, waaaghLores);
  const skaven = extractGroupFromLabels(waaagh.remaining, skavenLores);
  const other = extractGroupFromLabels(skaven.remaining, otherLores);

  let ret = other.remaining;

  if (colour.all && dark.all && witch.all && chaos.all && highMagic.all && waaagh.all && skaven.all && other.all) {
    other.remaining.add(SpellLabel.SpellLabelLoreAny);
    return ret;
  }

  for (const group of [
    [colour, SpellLabel.SpellLabelLoreColour],
    [dark, SpellLabel.SpellLabelLoreDark],
    [witch, SpellLabel.SpellLabelLoreWitch],
    [chaos, SpellLabel.SpellLabelLoreChaos],
    [highMagic, SpellLabel.SpellLabelLoreHighMagic],
    [waaagh, SpellLabel.SpellLabelLoreWaaagh],
    [skaven, SpellLabel.SpellLabelLoreSkaven],
  ] as [{ extracted: Set<SpellLabel>; remaining: Set<SpellLabel>; all: boolean }, SpellLabel][]) {
    if (group[0].all) {
      ret.add(group[1]);
    } else {
      ret = new Set([...ret, ...group[0].extracted]);
    }
  }

  return ret;
}

export type SpellClassificationData = {
  type: SpellType;
  labels: SpellLabel[];
};

export interface SpellApiData {
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  classification: SpellClassificationData;
  source: Source;
}

export type SpellClassification = {
  type: SpellType;
  labels: Set<SpellLabel>;
};

export class Spell implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  cn: number;
  range: string;
  duration: string;
  shared: boolean;
  target: string;
  classification: SpellClassification;
  source: Source;

  constructor({
    id = "",
    name = "",
    cn = 0,
    range = "",
    target = "",
    duration = "",
    description = "",
    classification = { type: SpellType.SpellTypeOther, labels: new Set() } as SpellClassification,
    canEdit = false,
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.name = name;
    this.cn = cn;
    this.range = range;
    this.target = target;
    this.duration = duration;
    this.description = description;
    this.classification = classification;
    this.canEdit = canEdit;
    this.shared = shared;
    this.source = source;
  }

  copy(): Spell {
    return new Spell({
      id: this.id,
      name: this.name,
      cn: this.cn,
      range: this.range,
      target: this.target,
      duration: this.duration,
      description: this.description,
      classification: { type: this.classification.type, labels: new Set(this.classification.labels) },
      canEdit: this.canEdit,
      shared: this.shared,
      source: copySource(this.source),
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validateRange(): ValidationStatus {
    return validShortDescFn(this.range);
  }

  validateTarget(): ValidationStatus {
    return validShortDescFn(this.target);
  }

  validateDuration(): ValidationStatus {
    return validShortDescFn(this.duration);
  }

  validateCn(): ValidationStatus {
    return setValidationStatus(
      CASTING_NUMBER_RE.test(this.cn.toString()),
      "Casting Number is required and has to be between 0 and 99.",
    );
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      this.validateRange().valid &&
      this.validateTarget().valid &&
      this.validateDuration().valid &&
      this.validateCn().valid &&
      sourceIsValid(this.source)
    );
  }

  isEqualTo(otherSpell: WhProperty): boolean {
    if (!(otherSpell instanceof Spell)) {
      return false;
    }
    return (
      this.id === otherSpell.id &&
      this.canEdit === otherSpell.canEdit &&
      this.name === otherSpell.name &&
      this.cn === otherSpell.cn &&
      this.range === otherSpell.range &&
      this.target === otherSpell.target &&
      this.duration === otherSpell.duration &&
      this.description === otherSpell.description &&
      this.classification.type === otherSpell.classification.type &&
      setsAreEqual(this.classification.labels, otherSpell.classification.labels) &&
      this.shared === otherSpell.shared &&
      objectsAreEqual(this.source, otherSpell.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }
}

export function apiResponseToModel(spellApi: ApiResponse<SpellApiData>): Spell {
  const newSpell = new Spell({
    id: spellApi.id,
    canEdit: spellApi.canEdit,
    name: spellApi.object.name,
    cn: spellApi.object.cn,
    range: spellApi.object.range,
    target: spellApi.object.target,
    duration: spellApi.object.duration,
    description: spellApi.object.description,
    classification: {
      type: spellApi.object.classification.type,
      labels: new Set(spellApi.object.classification.labels),
    },
    shared: spellApi.object.shared,
    source: spellApi.object.source,
  });

  return newSpell.copy();
}

export function modelToApi(spell: Spell): SpellApiData {
  return {
    name: spell.name,
    cn: spell.cn,
    range: spell.range,
    target: spell.target,
    duration: spell.duration,
    description: spell.description,
    classification: { type: spell.classification.type, labels: [...spell.classification.labels] },
    shared: spell.shared,
    source: copySource(spell.source),
  };
}

export class SpellApi implements WhApi<Spell, SpellApiData> {
  getElement: (id: string) => Promise<Spell>;
  listElements: (id: string) => Promise<Spell[]>;
  createElement: (wh: Spell) => Promise<ApiResponse<SpellApiData>>;
  updateElement: (wh: Spell) => Promise<ApiResponse<SpellApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
