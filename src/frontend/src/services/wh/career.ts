// import { Attributes, racialAttributes } from "./attributes.ts";
// import { copySource, Source } from "./source.ts";
// import { WhProperty } from "./common.ts";
//
// export const enum CareerClass {
//   Academic = 0,
//   Burghers,
//   Courtier,
//   Peasant,
//   Ranger,
//   Riverfolk,
//   Rougue,
//   Warrior,
//   Seafarer,
// }
//
// const enum StatusTier {
//   Brass = 0,
//   Silver,
//   Gold,
// }
//
// export type StatusStanding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
//
// export enum Species {
//   Human = 0,
//   Halfling,
//   Dwarf,
//   "High Elf",
//   "Wood Elf",
//   Glone,
//   Ogre,
// }
//
// export type CareerLevel = {
//   name: string;
//   status: StatusTier;
//   standing: StatusStanding;
//   attributes: Attributes;
//   skills: string[];
//   talents: string[];
//   items: string;
// };
//
// const API_BASE_PATH = "/api/wh/career";
//
// export interface CareerApiData {
//   name: string;
//   description: string;
//   species: Species[];
//   class: CareerClass;
//   level1: CareerLevel;
//   level2: CareerLevel;
//   level3: CareerLevel;
//   level4: CareerLevel;
//   shared: boolean;
//   source: Source;
// }
//
// const zeroCareerLevel: CareerLevel = {
//   name: "",
//   status: StatusTier.Brass,
//   standing: 0,
//   attributes: JSON.parse(JSON.stringify(racialAttributes.none)),
//   skills: [],
//   talents: [],
//   items: "",
// };
//
// export class Career implements WhProperty {
//   id: string;
//   canEdit: boolean;
//   name: string;
//   description: string;
//   species: Species[];
//   careerClass: CareerClass;
//   level1: CareerLevel;
//   level2: CareerLevel;
//   level3: CareerLevel;
//   level4: CareerLevel;
//   shared: boolean;
//   source: Source;
//
//   constructor({
//     id = "",
//     canEdit = false,
//     name = "",
//     description = "",
//     species = [Species.Human],
//     careerClass = CareerClass.Academic,
//     level1 = zeroCareerLevel,
//     level2 = zeroCareerLevel,
//     level3 = zeroCareerLevel,
//     level4 = zeroCareerLevel,
//     shared = false,
//     source = {},
//   } = {}) {
//     this.id = id;
//     this.canEdit = canEdit;
//     this.name = name;
//     this.description = description;
//     this.species = JSON.parse(JSON.stringify(species));
//     this.careerClass = careerClass;
//     this.level1 = JSON.parse(JSON.stringify(level1));
//     this.level2 = JSON.parse(JSON.stringify(level2));
//     this.level3 = JSON.parse(JSON.stringify(level3));
//     this.level4 = JSON.parse(JSON.stringify(level4));
//     this.shared = shared;
//     this.source = source;
//   }
//
//   copy(): Career {
//     return new Career({
//       id: this.id,
//       canEdit: this.canEdit,
//       name: this.name,
//       description: this.description,
//       species: this.species,
//       careerClass: this.careerClass,
//       level1: JSON.parse(JSON.stringify(this.level1)),
//       level2: JSON.parse(JSON.stringify(this.level2)),
//       level3: JSON.parse(JSON.stringify(this.level3)),
//       level4: JSON.parse(JSON.stringify(this.level4)),
//       shared: this.shared,
//       source: copySource(this.source),
//     });
//   }
// }
