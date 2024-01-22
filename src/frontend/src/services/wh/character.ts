import { SpeciesWithRegion } from "./characterConstants.ts";
import { StatusStanding, StatusTier } from "./career.ts";
import { Attributes, getAttributes } from "./attributes.ts";
import { IdNumber, WhProperty } from "./common.ts";
import { Source } from "./source.ts";
import { CharacterModifiers } from "./characterModifiers.ts";

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
}
