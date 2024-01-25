import { SpeciesWithRegion } from "./characterConstants.ts";
import { StatusStanding, StatusTier } from "./career.ts";
import { Attributes, attributesAreEqual, getAttributes, multiplyAttributes, sumAttributes } from "./attributes.ts";
import { ApiResponse, IdNumber, WhProperty } from "./common.ts";
import { copySource, Source } from "./source.ts";
import { CharacterModifiers } from "./characterModifiers.ts";
import { arraysAreEqualIgnoreOrder } from "../../utils/arrayUtils.ts";
import { compareIdNumber } from "./common.ts";
import { objectsAreEqual } from "../../utils/objectUtils.ts";
import { getMovementFormula } from "./characterFormulas.ts";
import { AxiosInstance } from "axios";
import {
  createElementFunc,
  deleteElementFunc,
  getElementFunc,
  listElementsFunc,
  updateElementFunc,
} from "./crudGenerator.ts";

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
  career: string;
  careerPath: IdNumber[];
  shared: boolean;
}

export class Character implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  notes: string;
  career: string;
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
  attributeRolls: Attributes;
  attributeAdvances: Attributes;
  skills: IdNumber[];
  talents: IdNumber[];
  equippedItems: IdNumber[];
  carriedItems: IdNumber[];
  storedItems: IdNumber[];
  careerPath: IdNumber[];
  spells: string[];
  prayers: string[];
  mutations: string[];
  shared: boolean;
  source: Source;
  modifiers: CharacterModifiers;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    notes = "",
    career = "",
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
    attributeRolls = getAttributes(),
    attributeAdvances = getAttributes(),
    skills = [] as IdNumber[],
    talents = [] as IdNumber[],
    equippedItems = [] as IdNumber[],
    carriedItems = [] as IdNumber[],
    storedItems = [] as IdNumber[],
    careerPath = [] as IdNumber[],
    spells = [] as string[],
    prayers = [] as string[],
    mutations = [] as string[],
    shared = false,
    source = {},
    modifiers = new CharacterModifiers(),
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.notes = notes;
    this.career = career;
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

  isEqualTo(otherCharacter: Character): boolean {
    return (
      this.id === otherCharacter.id &&
      this.canEdit === otherCharacter.canEdit &&
      this.name === otherCharacter.name &&
      this.description === otherCharacter.description &&
      this.notes === otherCharacter.notes &&
      this.career === otherCharacter.career &&
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
      attributesAreEqual(this.attributeRolls, otherCharacter.attributeRolls) &&
      attributesAreEqual(this.attributeAdvances, otherCharacter.attributeAdvances) &&
      arraysAreEqualIgnoreOrder(this.skills, otherCharacter.skills, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.talents, otherCharacter.talents, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.equippedItems, otherCharacter.equippedItems, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.carriedItems, otherCharacter.carriedItems, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.storedItems, otherCharacter.storedItems, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.careerPath, otherCharacter.careerPath, compareIdNumber) &&
      arraysAreEqualIgnoreOrder(this.spells, otherCharacter.spells) &&
      arraysAreEqualIgnoreOrder(this.prayers, otherCharacter.prayers) &&
      arraysAreEqualIgnoreOrder(this.mutations, otherCharacter.mutations) &&
      this.shared === otherCharacter.shared &&
      objectsAreEqual(this.source, otherCharacter.source)
    );
  }

  copy(): Character {
    return new Character({
      id: this.id,
      canEdit: this.canEdit,
      name: this.name,
      description: this.description,
      notes: this.notes,
      career: this.career,
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
      attributeRolls: JSON.parse(JSON.stringify(this.attributeRolls)),
      attributeAdvances: JSON.parse(JSON.stringify(this.attributeAdvances)),
      skills: JSON.parse(JSON.stringify(this.skills)),
      talents: JSON.parse(JSON.stringify(this.talents)),
      equippedItems: JSON.parse(JSON.stringify(this.equippedItems)),
      carriedItems: JSON.parse(JSON.stringify(this.carriedItems)),
      storedItems: JSON.parse(JSON.stringify(this.storedItems)),
      careerPath: JSON.parse(JSON.stringify(this.careerPath)),
      spells: JSON.parse(JSON.stringify(this.spells)),
      prayers: JSON.parse(JSON.stringify(this.prayers)),
      mutations: JSON.parse(JSON.stringify(this.mutations)),
      shared: this.shared,
      source: copySource(this.source),
      modifiers: this.modifiers.copy(),
    });
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
}

export function apiResponseToModel(characterApi: ApiResponse<CharacterApiData>): Character {
  return new Character({
    id: characterApi.id,
    canEdit: characterApi.canEdit,
    name: characterApi.object.name,
    description: characterApi.object.description,
    notes: characterApi.object.notes,
    career: characterApi.object.career,
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
    career: character.career,
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

export class CharacterApi {
  getElement: (id: string) => Promise<Character>;
  listElements: (id: string) => Promise<Character[]>;
  createElement: (wh: Character) => Promise<ApiResponse<CharacterApiData>>;
  updateElement: (wh: Character) => Promise<ApiResponse<CharacterApiData>>;
  deleteElement: (id: string) => Promise<void>;

  constructor(axiosInstance: AxiosInstance) {
    this.getElement = getElementFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.listElements = listElementsFunc(API_BASE_PATH, axiosInstance, apiResponseToModel);
    this.createElement = createElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.updateElement = updateElementFunc(API_BASE_PATH, axiosInstance, modelToApi);
    this.deleteElement = deleteElementFunc(API_BASE_PATH, axiosInstance);
  }
}
