import { printSpecies, SpeciesWithRegion } from "./characterUtils.ts";
import { CareerApiData, printStatusTier, StatusStanding, StatusTier } from "./career.ts";
import { Attributes } from "./attributes.ts";
import { ApiResponse } from "./common.ts";
import { SkillApiData } from "./skill.ts";
import { TalentApiData } from "./talent.ts";
import { ItemApiData } from "./item.ts";
import { SpellApiData } from "./spell.ts";
import { PrayerApiData } from "./prayer.ts";
import { MutationApiData } from "./mutation.ts";

export interface CharacterFullApiData {
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
  career: { number: number; wh: ApiResponse<CareerApiData> };
  skills: { number: number; wh: ApiResponse<SkillApiData> }[];
  talents: { number: number; wh: ApiResponse<TalentApiData> }[];
  equippedItems: { number: number; wh: ApiResponse<ItemApiData> }[];
  carriedItems: { number: number; wh: ApiResponse<ItemApiData> }[];
  storedItems: { number: number; wh: ApiResponse<ItemApiData> }[];
  spells: ApiResponse<SpellApiData>[];
  prayers: ApiResponse<PrayerApiData>[];
  mutations: ApiResponse<MutationApiData>[];
  careerPath: { number: number; wh: ApiResponse<CareerApiData> }[];
  shared: boolean;
}

export interface CharacterFullTalent {
  name: string;
  rank: number;
}

export interface CharacterFullSkill {
  name: string;
  attributeName: string;
  attributeValue: number;
  advances: number;
  skill: number;
}

export interface CharacterFullSpell {
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
  cn: number;
}

export interface CharacterFullPrayer {
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
}

export interface CharacterFullMutation {
  name: string;
  type: string;
  description: string;
}

export interface CharacterFullItem {
  name: string;
  enc: number;
  qualitiesFlawsRunes: string;
  number: number;
  description: string;

  group?: string;
  rng?: string | number;
  dmg?: number;
  locations?: string[];
  ap?: number;
  spells?: CharacterFullSpell[];
}

export interface CharacterFull {
  id: string;
  canEdit: boolean;
  shared: boolean;
  name: string;
  description: string;
  notes: string;
  species: string;
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
  status: string;
  standing: StatusStanding;

  careerName: string;
  careerLevelName: string;
  className: string;
  pastCareers: string[];

  baseAttributes: Attributes;
  otherAttributes: Attributes;
  attributeAdvances: Attributes;
  attributes: Attributes;

  movement: number;
  walk: number;
  run: number;
  wounds: number;

  talents: CharacterFullTalent[];
  basicSkills: CharacterFullSkill[];
  advancedSkills: CharacterFullSkill[];

  equippedArmor: CharacterFullItem[];
  equippedWeapon: CharacterFullItem[];
  equippedOther: CharacterFullItem[];
  carried: CharacterFullItem[];
  stored: CharacterFullItem[];

  spells: CharacterFullSpell[];
  prayers: CharacterFullPrayer[];
  mutations: CharacterFullMutation[];

  encWeapon: number;
  encArmor: number;
  encOther: number;
  encCarried: number;
}

function getCareerName(fullCharacterApi: ApiResponse<CharacterFullApiData>) {
  return`${fullCharacterApi.object.career.wh.object.name} ${fullCharacterApi.object.career.number}`
}

function getCareerLevel(fullCharacterApi: ApiResponse<CharacterFullApiData>) {
  return`${fullCharacterApi.object.career.wh.object.name} ${fullCharacterApi.object.career.number}`
}

export function apiResponseToFullCharacter(fullCharacterApi: ApiResponse<CharacterFullApiData>): CharacterFull {
  return {
    id: fullCharacterApi.id,
    canEdit: fullCharacterApi.canEdit,
    shared: fullCharacterApi.object.shared,
    name: fullCharacterApi.object.name,
    description: fullCharacterApi.object.description,
    notes: fullCharacterApi.object.description,
    species: printSpecies(fullCharacterApi.object.species),
    fate: fullCharacterApi.object.fate,
    fortune: fullCharacterApi.object.fortune,
    resilience: fullCharacterApi.object.resilience,
    resolve: fullCharacterApi.object.resolve,
    brass: fullCharacterApi.object.brass,
    silver: fullCharacterApi.object.silver,
    gold: fullCharacterApi.object.gold,
    spentExp: fullCharacterApi.object.spentExp,
    currentExp: fullCharacterApi.object.currentExp,
    sin: fullCharacterApi.object.sin,
    corruption: fullCharacterApi.object.corruption,
    status: printStatusTier(fullCharacterApi.object.status),
    standing: fullCharacterApi.object.standing,

    careerName: getCareerName(fullCharacterApi),
    careerLevelName:
  };
}
