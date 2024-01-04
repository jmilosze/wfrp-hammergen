import { CharacterModifiers } from "./characterModifiers.ts";
import { Source } from "./source.ts";
import { WhProperty } from "./crudGenerator.ts";

enum TalentAttribute {
  None = 0,
  WS,
  BS,
  S,
  T,
  I,
  Ag,
  Dex,
  Int,
  WP,
  Fel,
  Various,
}

// const API_BASE_PATH = "/api/wh/talent";

export interface MutationApiData {
  name: string;
  description: string;
  tests: string;
  maxRank: number;
  attribute: number;
  isGroup: boolean;
  group: string[];
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;
}

export class Talent implements WhProperty {
  id: string;
  canEdit: boolean;
  name: string;
  description: string;
  tests: string;
  maxRank: number;
  maxRankAtt: number;
  isGroup: boolean;
  group: string[];
  modifiers: CharacterModifiers;
  shared: boolean;
  source: Source;

  constructor({
    id = "",
    canEdit = false,
    name = "",
    description = "",
    tests = "",
    maxRank = 0,
    maxRankAtt = TalentAttribute.None.valueOf(),
    isGroup = false,
    group = [],
    modifiers = new CharacterModifiers(),
    shared = false,
    source = {},
  } = {}) {
    this.id = id;
    this.canEdit = canEdit;
    this.name = name;
    this.description = description;
    this.tests = tests;
    this.maxRank = maxRank;
    this.maxRankAtt = maxRankAtt;
    this.isGroup = isGroup;
    this.group = JSON.parse(JSON.stringify(group));
    this.modifiers = modifiers;
    this.shared = shared;
    this.source = source;
  }
}
