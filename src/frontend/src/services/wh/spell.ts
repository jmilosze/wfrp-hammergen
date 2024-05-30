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
import { arraysAreEqualIgnoreOrder } from "../../utils/array.ts";

const CASTING_NUMBER_RE = /^([1-9][0-9]|[0-9])$/;
const API_BASE_PATH = "/api/wh/spell";

export const enum SpellType {
  SpellTypeOther = 0,
  SpellTypePetty = 1,
  SpellTypeArcane = 2,
  SpellTypeLore = 3,
}

export function printSpellType(spellType: SpellType) {
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
  SpellLabelSkaven = 0,
  SpellLabelChaos = 1,
  SpellLabelFimirMarsh = 2,
  SpellLabelLight = 3,
  SpellLabelMetal = 4,
  SpellLabelLife = 5,
  SpellLabelHeavens = 6,
  SpellLabelShadows = 7,
  SpellLabelDeath = 8,
  SpellLabelFire = 9,
  SpellLabelBeasts = 10,
  SpellLabelDaemonology = 11,
  SpellLabelNecromancy = 12,
  SpellLabelHedgecraft = 13,
  SpellLabelWitchcraft = 14,
  SpellLabelNurgle = 15,
  SpellLabelSlaanesh = 16,
  SpellLabelTzeentch = 17,
  SpellLabelHighGeneral = 18,
  SpellLabelHighSlann = 19,
  SpellLabelGreatMaw = 20,
  SpellLabelLittleWaaagh = 21,
  SpellLabelBigWaaagh = 22,
  SpellLabelPlague = 23,
  SpellLabelStealth = 24,
  SpellLabelRuin = 25,
  SpellLabelCustom = 26,
  SpellLabelRitual = 27,
  // Derived labels
  SpellLabelLoreColour = 1000,
  SpellLabelLoreDark = 1001,
  SpellLabelLoreWitch = 1002,
  SpellLabelLoreChaos = 1003,
  SpellLabelLoreHighMagic = 1004,
  SpellLabelLoreWaaagh = 1005,
  SpellLabelLoreSkaven = 1006,
}

export function printSpellLabel(spellLabel: SpellLabel) {
  switch (spellLabel) {
    case SpellLabel.SpellLabelSkaven:
      return "Skaven spell";
    case SpellLabel.SpellLabelChaos:
      return "Chaos spell";
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
      return "Custom Lore";
    case SpellLabel.SpellLabelRitual:
      return "Ritual";
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

export const colourLores = [
  SpellLabel.SpellLabelLight,
  SpellLabel.SpellLabelMetal,
  SpellLabel.SpellLabelLife,
  SpellLabel.SpellLabelHeavens,
  SpellLabel.SpellLabelShadows,
  SpellLabel.SpellLabelDeath,
  SpellLabel.SpellLabelFire,
  SpellLabel.SpellLabelBeasts,
];
export const darkLores = [SpellLabel.SpellLabelDaemonology, SpellLabel.SpellLabelNecromancy];
export const witchLores = [SpellLabel.SpellLabelHedgecraft, SpellLabel.SpellLabelWitchcraft];
export const chaosLores = [SpellLabel.SpellLabelNurgle, SpellLabel.SpellLabelSlaanesh, SpellLabel.SpellLabelTzeentch];
export const highMagic = [SpellLabel.SpellLabelHighGeneral, SpellLabel.SpellLabelHighSlann];
export const waaaghLores = [SpellLabel.SpellLabelBigWaaagh, SpellLabel.SpellLabelLittleWaaagh];
export const skavenLores = [SpellLabel.SpellLabelPlague, SpellLabel.SpellLabelStealth, SpellLabel.SpellLabelRuin];
export const otherLores = [SpellLabel.SpellLabelGreatMaw];
export const allLores = colourLores.concat(
  darkLores,
  witchLores,
  chaosLores,
  highMagic,
  waaaghLores,
  skavenLores,
  otherLores,
);

export function getAllowedLabels(spellType: SpellType): SpellLabel[] {
  if (spellType === SpellType.SpellTypePetty || spellType === SpellType.SpellTypeArcane) {
    return [SpellLabel.SpellLabelSkaven, SpellLabel.SpellLabelChaos];
  } else if (spellType === SpellType.SpellTypeOther) {
    return [SpellLabel.SpellLabelFimirMarsh, SpellLabel.SpellLabelCustom];
  } else if (spellType === SpellType.SpellTypeLore) {
    return [...allLores, SpellLabel.SpellLabelCustom];
  } else {
    return [];
  }
}

export function getSimplifiedLabels(spellType: SpellType, allLabels: SpellLabel[]): SpellLabel[] {
  if (spellType !== SpellType.SpellTypeLore) {
    return allLabels;
  }

  const colourLoresSet = new Set(colourLores);
  const witchLoresSet = new Set(witchLores);
  const chaosLoresSet = new Set(chaosLores);
  const highMagicSet = new Set(highMagic);
  const waaaghLoresSet = new Set(waaaghLores);
  const skavenLoresSet = new Set(skavenLores);
  const otherLoresSet = new Set(otherLores);

  const otherLabels: SpellLabel[] = [];

  for (const label of allLabels) {
    let otherLabel = true;
    for (const spellSet of [
      colourLoresSet,
      witchLoresSet,
      chaosLoresSet,
      highMagicSet,
      waaaghLoresSet,
      skavenLoresSet,
      otherLoresSet,
    ]) {
      if (spellSet.has(label)) {
        colourLoresSet.delete(label);
        otherLabel = false;
        break;
      }
    }

    if (otherLabel) {
      otherLabels.push(label);
    }
  }

  const returnLabels: SpellLabel[] = [];

  if (
    colourLoresSet.size === 0 &&
    witchLoresSet.size === 0 &&
    chaosLoresSet.size === 0 &&
    highMagicSet.size === 0 &&
    waaaghLoresSet.size === 0 &&
    skavenLoresSet.size === 0 &&
    otherLoresSet.size === 0
  ) {
    returnLabels.push(SpellLabel.SpellLabelA);
  }
}

export type SpellClassification = {
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
  classification: SpellClassification;
  source: Source;
}

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
    classification = { type: SpellType.SpellTypeOther, labels: [] } as SpellClassification,
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
      classification: { type: this.classification.type, labels: [...this.classification.labels] },
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
      arraysAreEqualIgnoreOrder(this.classification.labels, otherSpell.classification.labels) &&
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
    classification: spellApi.object.classification,
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
    classification: spell.classification,
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
