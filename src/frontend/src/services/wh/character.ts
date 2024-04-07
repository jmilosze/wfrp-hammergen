import { DEFAULT_SIZE, getMovementFormula, getWoundsFormula, SpeciesWithRegion } from "./characterUtils.ts";
import { StatusStanding, StatusTier } from "./career.ts";
import {
  Attributes,
  attributesAreEqual,
  copyAttributes,
  getAttributes,
  multiplyAttributes,
  sumAttributes,
} from "./attributes.ts";
import { ApiResponse, validIntegerFn, validLongDescFn, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import { CharacterModifiers } from "./characterModifiers.ts";
import { objectsAreEqual } from "../../utils/object.ts";
import { AxiosInstance } from "axios";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";
import { apiResponseToCharacterFull, CharacterFull } from "./characterFull.ts";
import { ValidationStatus } from "../../utils/validation.ts";
import { setsAreEqual } from "../../utils/set.ts";
import { compareIdNumber, copyIdNumberArray, IdNumber, idNumberArrayToRecord } from "../../utils/idNumber.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/array.ts";

const API_BASE_PATH = "/api/wh/character";

export interface CharacterApiData {
  name: string;
  description: string;
  notes: string;
  species: SpeciesWithRegion;
  fate: number;
  fortune: number;
  resilience: number;
  resolve: number;
  brass: number;
  silver: number;
  gold: number;
  spentExp: number;
  currentExp: number;
  sin: number;
  corruption: number;
  status: StatusTier;
  standing: StatusStanding;
  career: IdNumber;
  baseAttributes: Attributes;
  attributeAdvances: Attributes;
  skills: IdNumber[];
  talents: IdNumber[];
  equippedItems: IdNumber[];
  carriedItems: IdNumber[];
  storedItems: IdNumber[];
  spells: string[];
  prayers: string[];
  mutations: string[];
  careerPath: IdNumber[];
  shared: boolean;
}

export class Character implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  notes: string;
  species: SpeciesWithRegion;
  fate: number;
  fortune: number;
  resilience: number;
  resolve: number;
  brass: number;
  silver: number;
  gold: number;
  spentExp: number;
  currentExp: number;
  sin: number;
  corruption: number;
  status: StatusTier;
  standing: StatusStanding;
  career: IdNumber;
  attributeRolls: Attributes;
  attributeAdvances: Attributes;
  skills: Record<string, number>;
  talents: Record<string, number>;
  equippedItems: Record<string, number>;
  carriedItems: Record<string, number>;
  storedItems: Record<string, number>;
  careerPath: IdNumber[];
  spells: Set<string>;
  prayers: Set<string>;
  mutations: Set<string>;
  shared: boolean;
  source: Source;
  modifiers: { talents: CharacterModifiers; mutations: CharacterModifiers };

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    notes = "",
    species = SpeciesWithRegion.None,
    fate = 0,
    fortune = 0,
    resilience = 0,
    resolve = 0,
    brass = 0,
    silver = 0,
    gold = 0,
    spentExp = 0,
    currentExp = 0,
    sin = 0,
    corruption = 0,
    status = StatusTier.Brass,
    standing = 0 as StatusStanding,
    career = { id: "000000000000000000000000", number: 1 } as IdNumber,
    attributeRolls = getAttributes(),
    attributeAdvances = getAttributes(),
    skills = {} as Record<string, number>,
    talents = {} as Record<string, number>,
    equippedItems = {} as Record<string, number>,
    carriedItems = {} as Record<string, number>,
    storedItems = {} as Record<string, number>,
    careerPath = [] as IdNumber[],
    spells = new Set<string>(),
    prayers = new Set<string>(),
    mutations = new Set<string>(),
    shared = false,
    source = {},
    modifiers = { talents: new CharacterModifiers(), mutations: new CharacterModifiers() },
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.notes = notes;
    this.species = species;
    this.fate = fate;
    this.fortune = fortune;
    this.resilience = resilience;
    this.resolve = resolve;
    this.brass = brass;
    this.silver = silver;
    this.gold = gold;
    this.spentExp = spentExp;
    this.currentExp = currentExp;
    this.sin = sin;
    this.corruption = corruption;
    this.status = status;
    this.standing = standing;
    this.career = career;
    this.attributeRolls = attributeRolls;
    this.attributeAdvances = attributeAdvances;
    this.skills = skills;
    this.talents = talents;
    this.equippedItems = equippedItems;
    this.carriedItems = carriedItems;
    this.storedItems = storedItems;
    this.careerPath = careerPath;
    this.spells = spells;
    this.prayers = prayers;
    this.mutations = mutations;
    this.shared = shared;
    this.source = source;
    this.modifiers = modifiers;
  }

  isEqualTo(otherCharacter: WhProperty): boolean {
    if (!(otherCharacter instanceof Character)) {
      return false;
    }
    return (
      this.id === otherCharacter.id &&
      this.canEdit === otherCharacter.canEdit &&
      this.name === otherCharacter.name &&
      this.description === otherCharacter.description &&
      this.notes === otherCharacter.notes &&
      this.species === otherCharacter.species &&
      this.fate === otherCharacter.fate &&
      this.fortune === otherCharacter.fortune &&
      this.resilience === otherCharacter.resilience &&
      this.resolve === otherCharacter.resolve &&
      this.brass === otherCharacter.brass &&
      this.silver === otherCharacter.silver &&
      this.gold === otherCharacter.gold &&
      this.spentExp === otherCharacter.spentExp &&
      this.currentExp === otherCharacter.currentExp &&
      this.sin === otherCharacter.sin &&
      this.corruption === otherCharacter.corruption &&
      this.status === otherCharacter.status &&
      this.standing === otherCharacter.standing &&
      compareIdNumber(this.career, otherCharacter.career) === 0 &&
      attributesAreEqual(this.attributeRolls, otherCharacter.attributeRolls) &&
      attributesAreEqual(this.attributeAdvances, otherCharacter.attributeAdvances) &&
      objectsAreEqual(this.skills, otherCharacter.skills) &&
      objectsAreEqual(this.talents, otherCharacter.talents) &&
      objectsAreEqual(this.equippedItems, otherCharacter.equippedItems) &&
      objectsAreEqual(this.carriedItems, otherCharacter.carriedItems) &&
      objectsAreEqual(this.storedItems, otherCharacter.storedItems) &&
      arraysAreEqualIgnoreOrder(this.careerPath, otherCharacter.careerPath, compareIdNumber) &&
      setsAreEqual(this.spells, otherCharacter.spells) &&
      setsAreEqual(this.prayers, otherCharacter.prayers) &&
      setsAreEqual(this.mutations, otherCharacter.mutations) &&
      this.shared === otherCharacter.shared &&
      objectsAreEqual(this.source, otherCharacter.source)
    );
  }

  updateSource(update: { id: string; notes: string; selected: boolean }): void {
    updateSource(this.source, update);
  }

  copy(): Character {
    return new Character({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      notes: this.notes,
      species: this.species,
      fate: this.fate,
      fortune: this.fortune,
      resilience: this.resilience,
      resolve: this.resolve,
      brass: this.brass,
      silver: this.silver,
      gold: this.gold,
      spentExp: this.spentExp,
      currentExp: this.currentExp,
      sin: this.sin,
      corruption: this.corruption,
      status: this.status,
      standing: this.standing,
      career: { id: this.career.id, number: this.career.number },
      attributeRolls: copyAttributes(this.attributeRolls),
      attributeAdvances: copyAttributes(this.attributeAdvances),
      skills: { ...this.skills },
      talents: { ...this.talents },
      equippedItems: { ...this.equippedItems },
      carriedItems: { ...this.carriedItems },
      storedItems: { ...this.storedItems },
      careerPath: copyIdNumberArray(this.careerPath),
      spells: new Set(this.spells),
      prayers: new Set(this.prayers),
      mutations: new Set(this.mutations),
      shared: this.shared,
      source: copySource(this.source),
      modifiers: { talents: this.modifiers.talents.copy(), mutations: this.modifiers.mutations.copy() },
    });
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validateNotes(): ValidationStatus {
    return validLongDescFn(this.notes);
  }

  validateFate(): ValidationStatus {
    return validIntegerFn(this.fate, 0, 1000);
  }

  validateFortune(): ValidationStatus {
    return validIntegerFn(this.fortune, 0, 1000);
  }

  validateResilience(): ValidationStatus {
    return validIntegerFn(this.resilience, 0, 1000);
  }

  validateResolve(): ValidationStatus {
    return validIntegerFn(this.resolve, 0, 1000);
  }

  validateBrass(): ValidationStatus {
    return validIntegerFn(this.brass, 0, 1000000);
  }

  validateSilver(): ValidationStatus {
    return validIntegerFn(this.silver, 0, 1000000);
  }

  validateGold(): ValidationStatus {
    return validIntegerFn(this.gold, 0, 1000000);
  }

  validateSin(): ValidationStatus {
    return validIntegerFn(this.sin, 0, 1000);
  }

  validateCorruption(): ValidationStatus {
    return validIntegerFn(this.sin, 0, 1000);
  }

  validateCurrentExp(): ValidationStatus {
    return validIntegerFn(this.currentExp, 0, 10000000);
  }

  validateSpentExp(): ValidationStatus {
    return validIntegerFn(this.spentExp, 0, 10000000);
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      sourceIsValid(this.source) &&
      this.validateNotes().valid &&
      this.validateFate().valid &&
      this.validateFortune().valid &&
      this.validateResilience().valid &&
      this.validateResolve().valid &&
      this.validateSin().valid &&
      this.validateCorruption().valid &&
      this.validateCurrentExp().valid &&
      this.validateSpentExp().valid
    );
  }

  getMovement(): number {
    return getMovementFormula(this.species) + this.modifiers.talents.movement + this.modifiers.mutations.movement;
  }

  getRacialAttributes(): Attributes {
    return getAttributes(this.species);
  }

  getBaseAttributes(): Attributes {
    return sumAttributes(this.getRacialAttributes(), this.attributeRolls);
  }

  getTotalAttributes(): Attributes {
    return sumAttributes(
      sumAttributes(this.getBaseAttributes(), this.attributeAdvances),
      sumAttributes(this.modifiers.talents.attributes, this.modifiers.mutations.attributes),
    );
  }

  getWounds() {
    const attributeTotal = this.getTotalAttributes();
    return getWoundsFormula(
      DEFAULT_SIZE + this.modifiers.talents.size + this.modifiers.mutations.size,
      attributeTotal.T,
      attributeTotal.WP,
      attributeTotal.S,
    );
  }

  updateCurrentCareer(id: string, number: number, selected: boolean) {
    if (!selected) {
      this.career.id = "000000000000000000000000";
      this.career.number = 1;
    } else {
      this.career.id = id;
      this.career.number = number;
    }
  }

  updatePastCareer(id: string, number: number, selected: boolean) {
    if (!selected) {
      for (const [i, pastCareer] of this.careerPath.entries()) {
        if (pastCareer.id === id && pastCareer.number === number) {
          delete this.careerPath[i];
          return;
        }
      }
    } else {
      for (const pastCareer of this.careerPath) {
        if (pastCareer.id === id && pastCareer.number === number) {
          return;
        }
      }
      this.careerPath.push({ id: id, number: number });
    }
  }
}

export function apiResponseToModel(characterApi: ApiResponse<CharacterApiData>): Character {
  const newCharacter = new Character({
    id: characterApi.id,
    canEdit: characterApi.canEdit,
    name: characterApi.object.name,
    description: characterApi.object.description,
    notes: characterApi.object.notes,
    species: characterApi.object.species,
    fate: characterApi.object.fate,
    fortune: characterApi.object.fortune,
    resilience: characterApi.object.resilience,
    resolve: characterApi.object.resolve,
    brass: characterApi.object.brass,
    silver: characterApi.object.silver,
    gold: characterApi.object.gold,
    spentExp: characterApi.object.spentExp,
    currentExp: characterApi.object.currentExp,
    sin: characterApi.object.sin,
    corruption: characterApi.object.corruption,
    status: characterApi.object.status,
    standing: characterApi.object.standing,
    career: characterApi.object.career,
    attributeRolls: sumAttributes(
      characterApi.object.baseAttributes,
      multiplyAttributes(-1, getAttributes(characterApi.object.species)),
    ),
    attributeAdvances: copyAttributes(characterApi.object.attributeAdvances),
    skills: idNumberArrayToRecord(characterApi.object.skills),
    talents: idNumberArrayToRecord(characterApi.object.talents),
    equippedItems: idNumberArrayToRecord(characterApi.object.equippedItems),
    carriedItems: idNumberArrayToRecord(characterApi.object.carriedItems),
    storedItems: idNumberArrayToRecord(characterApi.object.storedItems),
    careerPath: copyIdNumberArray(characterApi.object.careerPath),
    spells: new Set(characterApi.object.spells),
    prayers: new Set(characterApi.object.prayers),
    mutations: new Set(characterApi.object.mutations),
    shared: characterApi.object.shared,
    source: {},
    modifiers: { talents: new CharacterModifiers(), mutations: new CharacterModifiers() },
  });

  return newCharacter.copy();
}

export function modelToApi(character: Character): CharacterApiData {
  return {
    name: character.name,
    description: character.description,
    notes: character.notes,
    species: character.species,
    fate: character.fate,
    fortune: character.fortune,
    resilience: character.resilience,
    resolve: character.resolve,
    brass: character.brass,
    silver: character.silver,
    gold: character.gold,
    spentExp: character.spentExp,
    currentExp: character.currentExp,
    sin: character.sin,
    corruption: character.corruption,
    status: character.status,
    standing: character.standing,
    career: character.career,
    baseAttributes: character.getBaseAttributes(),
    attributeAdvances: copyAttributes(character.attributeAdvances),
    skills: Object.entries(character.skills).map((x) => ({ id: x[0], number: x[1] })),
    talents: Object.entries(character.talents).map((x) => ({ id: x[0], number: x[1] })),
    equippedItems: Object.entries(character.equippedItems).map((x) => ({ id: x[0], number: x[1] })),
    carriedItems: Object.entries(character.carriedItems).map((x) => ({ id: x[0], number: x[1] })),
    storedItems: Object.entries(character.storedItems).map((x) => ({ id: x[0], number: x[1] })),
    careerPath: copyIdNumberArray(character.careerPath),
    spells: [...character.spells],
    prayers: [...character.prayers],
    mutations: [...character.mutations],
    shared: character.shared,
  };
}

export class CharacterApi implements WhApi<Character, CharacterApiData> {
  getElement: (id: string) => Promise<Character>;
  listElements: (id: string) => Promise<Character[]>;
  createElement: (wh: Character) => Promise<ApiResponse<CharacterApiData>>;
  updateElement: (wh: Character) => Promise<ApiResponse<CharacterApiData>>;
  deleteElement: (id: string) => Promise<void>;
  getElementForDisplay: (id: string) => Promise<CharacterFull>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
    this.getElementForDisplay = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToCharacterFull, "?full=true");
  }
}
