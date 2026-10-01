import { AttributeName } from "./attributes.ts";
import { copySource, Source, sourceIsValid } from "./source.ts";
import { ApiResponse, Edition, validLongDescFn, validShortDescFn, variant, Visibility, WhEntity } from "./common.ts";
import { defineContentApi, ServerEnvelope } from "./crudGenerator.ts";
import { AxiosInstance } from "axios";
import { ValidationStatus } from "../../utils/validation.ts";
import { updateSet } from "../../utils/set.ts";
import { cloneEntity } from "../../utils/clone.ts";
import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "./characterUtils.ts";

export const enum CareerClass {
  Academic = 0,
  Burghers,
  Courtier,
  Peasant,
  Ranger,
  Riverfolk,
  Rogue,
  Warrior,
  Seafarer,
}

export const careerClassList = [
  CareerClass.Academic,
  CareerClass.Burghers,
  CareerClass.Courtier,
  CareerClass.Peasant,
  CareerClass.Ranger,
  CareerClass.Riverfolk,
  CareerClass.Rogue,
  CareerClass.Warrior,
  CareerClass.Seafarer,
];

export function printClassName(careerClass: CareerClass) {
  switch (careerClass) {
    case CareerClass.Academic:
      return "Academic";
    case CareerClass.Burghers:
      return "Burghers";
    case CareerClass.Courtier:
      return "Courtier";
    case CareerClass.Peasant:
      return "Peasant";
    case CareerClass.Ranger:
      return "Ranger";
    case CareerClass.Riverfolk:
      return "Riverfolk";
    case CareerClass.Rogue:
      return "Rogue";
    case CareerClass.Warrior:
      return "Warrior";
    case CareerClass.Seafarer:
      return "Seafarer";
    default:
      return "";
  }
}

export const enum StatusTier {
  Brass = 0,
  Silver,
  Gold,
}

export const statusTierList: StatusTier[] = [StatusTier.Brass, StatusTier.Silver, StatusTier.Gold];

export function printStatusTier(statusTier: StatusTier): string {
  switch (statusTier) {
    case StatusTier.Brass:
      return "Brass";
    case StatusTier.Silver:
      return "Silver";
    case StatusTier.Gold:
      return "Gold";
    default:
      return "";
  }
}

export type StatusStanding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const statusStandingList: StatusStanding[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function printStatusStanding(statusStanding: StatusStanding): string {
  return statusStanding.toString();
}

export enum Species {
  Human = 0,
  Halfling,
  Dwarf,
  HighElf,
  WoodElf,
  Gnome,
  Ogre,
}

export const speciesList = [
  Species.Human,
  Species.Halfling,
  Species.Dwarf,
  Species.HighElf,
  Species.WoodElf,
  Species.Gnome,
  Species.Ogre,
];

// Species a career can be open to in each edition; 5e has five species.
export const careerSpeciesByEdition: Record<Edition, Species[]> = {
  "4e": speciesList,
  "5e": [Species.Human, Species.Halfling, Species.Dwarf, Species.HighElf, Species.WoodElf],
};

export function printSpeciesName(species: Species) {
  switch (species) {
    case Species.Human:
      return "Human";
    case Species.Halfling:
      return "Halfling";
    case Species.Dwarf:
      return "Dwarf";
    case Species.HighElf:
      return "High Elf";
    case Species.WoodElf:
      return "Wood Elf";
    case Species.Gnome:
      return "Gnome";
    case Species.Ogre:
      return "Ogre";
    default:
      return "";
  }
}

export function speciesWithRegionToSpecies(speciesWithRegion: SpeciesWithRegion): Species {
  if (HUMAN_LIST.includes(speciesWithRegion)) {
    return Species.Human;
  } else if (HALFLING_LIST.includes(speciesWithRegion)) {
    return Species.Halfling;
  } else if (DWARF_LIST.includes(speciesWithRegion)) {
    return Species.Dwarf;
  } else if (HIGH_ELF_LIST.includes(speciesWithRegion)) {
    return Species.HighElf;
  } else if (WOOD_ELF_LIST.includes(speciesWithRegion)) {
    return Species.WoodElf;
  } else if (GNOME_LIST.includes(speciesWithRegion)) {
    return Species.Gnome;
  } else if (OGRE_LIST.includes(speciesWithRegion)) {
    return Species.Ogre;
  } else {
    return Species.Human;
  }
}

export type CareerLevel = {
  exists: boolean;
  name: string;
  status: StatusTier;
  standing: StatusStanding;
  attributes: AttributeName[];
  skills: Set<string>;
  talents: Set<string>;
  items: string;
};

export type CareerLevelApiData = {
  exists: boolean;
  name: string;
  status: StatusTier;
  standing: StatusStanding;
  attributes: AttributeName[];
  skills: string[];
  talents: string[];
  items: string;
};

const API_BASE_PATH = "/api/wh/career";

export interface CareerApiData {
  name: string;
  description: string;
  species: Species[];
  class: CareerClass;
  level1: CareerLevelApiData;
  level2: CareerLevelApiData;
  level3: CareerLevelApiData;
  level4: CareerLevelApiData;
  level5: CareerLevelApiData;
  source: Source;
  // Skill used to earn income; optional, many careers have none.
  incomeSkill?: string;
}

export const zeroCareerLevel: CareerLevel = {
  exists: false,
  name: "",
  status: StatusTier.Brass,
  standing: 0,
  attributes: [],
  skills: new Set<string>(),
  talents: new Set<string>(),
  items: "",
};

export function isLevel(x: number): x is 1 | 2 | 3 | 4 | 5 {
  return x === 1 || x === 2 || x === 3 || x === 4 || x === 5;
}

export class Career extends WhEntity {
  species: Species[];
  careerClass: CareerClass;
  level1: CareerLevel;
  level2: CareerLevel;
  level3: CareerLevel;
  level4: CareerLevel;
  level5: CareerLevel;
  incomeSkill: string;

  constructor({
    id = "",
    ownerId = "",
    name = "",
    description = "",
    species = [Species.Human],
    careerClass = CareerClass.Academic,
    level1 = copyCareerLevel(zeroCareerLevel),
    level2 = copyCareerLevel(zeroCareerLevel),
    level3 = copyCareerLevel(zeroCareerLevel),
    level4 = copyCareerLevel(zeroCareerLevel),
    level5 = copyCareerLevel(zeroCareerLevel),
    incomeSkill = "",
    visibility = Visibility.Private,
    source = {},
  } = {}) {
    super({ id, ownerId, visibility, name, description, source });
    this.species = species;
    this.careerClass = careerClass;
    this.level1 = level1;
    this.level2 = level2;
    this.level3 = level3;
    this.level4 = level4;
    this.level5 = level5;
    this.incomeSkill = incomeSkill;
  }

  validateName(): ValidationStatus {
    return validShortDescFn(this.name);
  }

  validateDescription(): ValidationStatus {
    return validLongDescFn(this.description);
  }

  validateLevel1Name(): ValidationStatus {
    return validShortDescFn(this.level1.name);
  }

  validateLevel2Name(): ValidationStatus {
    return validShortDescFn(this.level2.name);
  }

  validateLevel3Name(): ValidationStatus {
    return validShortDescFn(this.level3.name);
  }

  validateLevel4Name(): ValidationStatus {
    return validShortDescFn(this.level4.name);
  }

  validateLevel5Name(): ValidationStatus {
    return validShortDescFn(this.level5.name);
  }

  validateLevel1Items(): ValidationStatus {
    return validLongDescFn(this.level1.items);
  }

  validateLevel2Items(): ValidationStatus {
    return validLongDescFn(this.level2.items);
  }

  validateLevel3Items(): ValidationStatus {
    return validLongDescFn(this.level3.items);
  }

  validateLevel4Items(): ValidationStatus {
    return validLongDescFn(this.level4.items);
  }

  validateLevel5Items(): ValidationStatus {
    return validLongDescFn(this.level5.items);
  }

  forEdition(edition: Edition): this {
    const variant = super.forEdition(edition);
    variant.species = variant.species.filter((s) => careerSpeciesByEdition[edition].includes(s));
    return variant;
  }

  isValid(): boolean {
    return (
      this.validateName().valid &&
      this.validateDescription().valid &&
      sourceIsValid(this.source) &&
      this.validateLevel1Name().valid &&
      this.validateLevel2Name().valid &&
      this.validateLevel3Name().valid &&
      this.validateLevel4Name().valid &&
      this.validateLevel5Name().valid &&
      this.validateLevel1Items().valid &&
      this.validateLevel2Items().valid &&
      this.validateLevel3Items().valid &&
      this.validateLevel4Items().valid &&
      this.validateLevel5Items().valid
    );
  }

  getLevel(level: 1 | 2 | 3 | 4 | 5): CareerLevel {
    switch (level) {
      case 1:
        return this.level1;
      case 2:
        return this.level2;
      case 3:
        return this.level3;
      case 4:
        return this.level4;
      case 5:
        return this.level5;
      default:
        return zeroCareerLevel;
    }
  }

  updateLevelSkills(level: 1 | 2 | 3 | 4 | 5, id: string, selected: boolean): void {
    const careerLevel = this.getLevel(level);
    updateSet(careerLevel.skills, id, selected);
  }

  updateLevelTalents(level: 1 | 2 | 3 | 4 | 5, id: string, selected: boolean): void {
    const careerLevel = this.getLevel(level);
    updateSet(careerLevel.talents, id, selected);
  }

  allowedForSpeciesWithRegion(speciesWithRegion: SpeciesWithRegion): boolean {
    const species = speciesWithRegionToSpecies(speciesWithRegion);
    return this.species.includes(species);
  }

  getSkillsByLevel(): PerGenerationLevel<string[]> {
    return getCareerSkillsByLevel(this);
  }

  getTalentsByLevel(): PerGenerationLevel<string[]> {
    return getCareerTalentsByLevel(this);
  }

  getAttributesByLevel(): PerGenerationLevel<AttributeName[]> {
    return getCareerAttributesByLevel(this);
  }
}

// Career levels that character generation can produce (level 5 is never generated).
export type GenerationLevel = 1 | 2 | 3 | 4;

// One entry per generation level; index 0 holds level 1.
export type PerGenerationLevel<T> = [T, T, T, T];

export function getCareerSkillsByLevel(career: Career): PerGenerationLevel<string[]> {
  return [[...career.level1.skills], [...career.level2.skills], [...career.level3.skills], [...career.level4.skills]];
}

export function getCareerTalentsByLevel(career: Career): PerGenerationLevel<string[]> {
  return [
    [...career.level1.talents],
    [...career.level2.talents],
    [...career.level3.talents],
    [...career.level4.talents],
  ];
}

export function getCareerAttributesByLevel(career: Career): PerGenerationLevel<AttributeName[]> {
  return [career.level1.attributes, career.level2.attributes, career.level3.attributes, career.level4.attributes];
}

export function copyCareerLevel(careerLevel: CareerLevel): CareerLevel {
  return cloneEntity(careerLevel);
}

export function apiResponseToModel(careerApi: ApiResponse<CareerApiData>, edition: Edition): Career {
  const data = variant(careerApi, edition);
  return new Career({
    id: careerApi.id,
    ownerId: careerApi.ownerId,
    visibility: careerApi.visibility,
    name: data.name,
    description: data.description,
    careerClass: data.class,
    species: [...data.species],
    level1: careerLevelApiDataToCareerLevel(data.level1),
    level2: careerLevelApiDataToCareerLevel(data.level2),
    level3: careerLevelApiDataToCareerLevel(data.level3),
    level4: careerLevelApiDataToCareerLevel(data.level4),
    level5: careerLevelApiDataToCareerLevel(data.level5),
    incomeSkill: data.incomeSkill ?? "",
    source: copySource(data.source),
  });
}

function careerLevelApiDataToCareerLevel(apiData: CareerLevelApiData): CareerLevel {
  return {
    exists: apiData.exists,
    name: apiData.name,
    status: apiData.status,
    standing: apiData.standing,
    attributes: [...apiData.attributes],
    skills: new Set(apiData.skills),
    talents: new Set(apiData.talents),
    items: apiData.items,
  };
}

export function modelToApi(career: Career): CareerApiData {
  return {
    name: career.name,
    description: career.description,
    class: career.careerClass,
    species: [...career.species],
    level1: careerLevelToCareerLevelApiData(career.level1),
    level2: careerLevelToCareerLevelApiData(career.level2),
    level3: careerLevelToCareerLevelApiData(career.level3),
    level4: careerLevelToCareerLevelApiData(career.level4),
    level5: careerLevelToCareerLevelApiData(career.level5),
    incomeSkill: career.incomeSkill,
    source: copySource(career.source),
  };
}

function careerLevelToCareerLevelApiData(careerLevel: CareerLevel): CareerLevelApiData {
  return {
    exists: careerLevel.exists,
    name: careerLevel.name,
    status: careerLevel.status,
    standing: careerLevel.standing,
    attributes: [...careerLevel.attributes],
    skills: [...careerLevel.skills],
    talents: [...careerLevel.talents],
    items: careerLevel.items,
  };
}

export const careerApi = defineContentApi<Career, CareerApiData>(API_BASE_PATH, apiResponseToModel, modelToApi);

export interface CareerMatch {
  id: string;
  name: string;
  careerClass: CareerClass;
  levels: number[];
}

export function findCareerMatches(
  career: Career,
  searchIds: Set<string>,
  type: "skill" | "talent",
): CareerMatch | null {
  const levels: number[] = [];

  const checkLevel = (level: CareerLevel, levelNumber: number) => {
    if (!level.exists) {
      return;
    }
    const targetSet = type === "skill" ? level.skills : level.talents;
    for (const id of searchIds) {
      if (targetSet.has(id)) {
        levels.push(levelNumber);
        break;
      }
    }
  };

  checkLevel(career.level1, 1);
  checkLevel(career.level2, 2);
  checkLevel(career.level3, 3);
  checkLevel(career.level4, 4);
  checkLevel(career.level5, 5);

  if (levels.length === 0) {
    return null;
  }

  return {
    id: career.id,
    name: career.name,
    careerClass: career.careerClass,
    levels,
  };
}

export async function getCareersForSkill(
  axios: Pick<AxiosInstance, "get">,
  skillIds: string[],
  edition: Edition,
): Promise<Career[]> {
  const { data } = await axios.get<ServerEnvelope<ApiResponse<CareerApiData>[]>>(API_BASE_PATH, {
    params: { skillId: skillIds, edition },
  });
  return data.data.map((api) => apiResponseToModel(api, edition));
}

export async function getCareersForTalent(
  axios: Pick<AxiosInstance, "get">,
  talentIds: string[],
  edition: Edition,
): Promise<Career[]> {
  const { data } = await axios.get<ServerEnvelope<ApiResponse<CareerApiData>[]>>(API_BASE_PATH, {
    params: { talentId: talentIds, edition },
  });
  return data.data.map((api) => apiResponseToModel(api, edition));
}
