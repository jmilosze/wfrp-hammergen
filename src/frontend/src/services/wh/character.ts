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
import { ApiResponse, copyRecordWithObject, IdNumber, validShortDescFn, WhApi, WhProperty } from "./common.ts";
import { copySource, Source, sourceIsValid, updateSource } from "./source.ts";
import { CharacterModifiers } from "./characterModifiers.ts";
import { compareIdNumber } from "./common.ts";
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
  skills: Record<string, IdNumber>;
  talents: Record<string, IdNumber>;
  equippedItems: Record<string, IdNumber>;
  carriedItems: Record<string, IdNumber>;
  storedItems: Record<string, IdNumber>;
  careerPath: Record<string, IdNumber>;
  spells: Set<string>;
  prayers: Set<string>;
  mutations: Set<string>;
  shared: boolean;
  source: Source;
  modifiers: CharacterModifiers;

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
    career = { id: "", number: 0 } as IdNumber,
    attributeRolls = getAttributes(),
    attributeAdvances = getAttributes(),
    skills = {} as Record<string, IdNumber>,
    talents = {} as Record<string, IdNumber>,
    equippedItems = {} as Record<string, IdNumber>,
    carriedItems = {} as Record<string, IdNumber>,
    storedItems = {} as Record<string, IdNumber>,
    careerPath = {} as Record<string, IdNumber>,
    spells = new Set<string>(),
    prayers = new Set<string>(),
    mutations = new Set<string>(),
    shared = false,
    source = {},
    modifiers = new CharacterModifiers(),
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
      objectsAreEqual(this.careerPath, otherCharacter.careerPath) &&
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
      skills: copyRecordWithObject(this.skills),
      talents: copyRecordWithObject(this.talents),
      equippedItems: copyRecordWithObject(this.equippedItems),
      carriedItems: copyRecordWithObject(this.carriedItems),
      storedItems: copyRecordWithObject(this.storedItems),
      careerPath: copyRecordWithObject(this.careerPath),
      spells: new Set(this.spells),
      prayers: new Set(this.prayers),
      mutations: new Set(this.mutations),
      shared: this.shared,
      source: copySource(this.source),
      modifiers: this.modifiers.copy(),
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

  getMovement(): number {
    return getMovementFormula(this.species) + this.modifiers.movement;
  }

  getRacialAttributes(): Attributes {
    return getAttributes(this.species);
  }

  getBaseAttributes(): Attributes {
    return sumAttributes(this.getRacialAttributes(), this.attributeRolls);
  }

  getTotalAttributes(): Attributes {
    return sumAttributes(sumAttributes(this.getBaseAttributes(), this.attributeAdvances), this.modifiers.attributes);
  }

  getWounds() {
    const attributeTotal = this.getTotalAttributes();
    return getWoundsFormula(DEFAULT_SIZE + this.modifiers.size, attributeTotal.T, attributeTotal.WP, attributeTotal.S);
  }
}

export function apiResponseToModel(characterApi: ApiResponse<CharacterApiData>): Character {
  return new Character({
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
    attributeAdvances: JSON.parse(JSON.stringify(characterApi.object.attributeAdvances)),
    skills: JSON.parse(JSON.stringify(characterApi.object.skills)),
    talents: JSON.parse(JSON.stringify(characterApi.object.talents)),
    equippedItems: JSON.parse(JSON.stringify(characterApi.object.equippedItems)),
    carriedItems: JSON.parse(JSON.stringify(characterApi.object.carriedItems)),
    storedItems: JSON.parse(JSON.stringify(characterApi.object.storedItems)),
    careerPath: JSON.parse(JSON.stringify(characterApi.object.careerPath)),
    spells: JSON.parse(JSON.stringify(characterApi.object.spells)),
    prayers: JSON.parse(JSON.stringify(characterApi.object.prayers)),
    mutations: JSON.parse(JSON.stringify(characterApi.object.mutations)),
    shared: characterApi.object.shared,
    source: {},
    modifiers: new CharacterModifiers(),
  });
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
    attributeAdvances: JSON.parse(JSON.stringify(character.attributeAdvances)),
    skills: JSON.parse(JSON.stringify(character.skills)),
    talents: JSON.parse(JSON.stringify(character.talents)),
    equippedItems: JSON.parse(JSON.stringify(character.equippedItems)),
    carriedItems: JSON.parse(JSON.stringify(character.carriedItems)),
    storedItems: JSON.parse(JSON.stringify(character.storedItems)),
    careerPath: JSON.parse(JSON.stringify(character.careerPath)),
    spells: JSON.parse(JSON.stringify(character.spells)),
    prayers: JSON.parse(JSON.stringify(character.prayers)),
    mutations: JSON.parse(JSON.stringify(character.mutations)),
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
