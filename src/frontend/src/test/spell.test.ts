import { describe, expect, test } from "vitest";
import {
  apiResponseToModel,
  getSimplifiedLabels,
  modelToApi,
  printSpellLabel,
  Spell,
  SpellApiData,
  SpellLabel,
  SpellType,
} from "../services/wh/spell.ts";
import { ApiResponse, Visibility } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const spellApiData: SpellApiData = {
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  classification: { type: SpellType.SpellTypeLore, labels: [SpellLabel.SpellLabelRuin, SpellLabel.SpellLabelStealth] },
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
};

const spellApiResponse: ApiResponse<SpellApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  object: spellApiData,
};

const spell = new Spell({
  id: "id",
  ownerId: "owner",
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  classification: {
    type: SpellType.SpellTypeLore,
    labels: new Set([SpellLabel.SpellLabelRuin, SpellLabel.SpellLabelStealth]),
  },
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected spell", () => {
  expect(apiResponseToModel(spellApiResponse)).toMatchObject(spell);
});

test("modelToApi returns expected api spell data", () => {
  expect(modelToApi(spell)).toMatchObject(spellApiData);
});

testIsEqualCommonProperties("spell", spell);

test("isEqualTo returns true when other spell has the same labels", () => {
  const otherSpell = spell.copy();
  otherSpell.classification.labels = new Set([SpellLabel.SpellLabelStealth, SpellLabel.SpellLabelRuin]);
  expect(spell.isEqualTo(otherSpell)).toBe(true);
});

describe("isEqualTo returns false", () => {
  test("when other spell has spell type");
  {
    const otherSpell = spell.copy();
    otherSpell.classification.type = SpellType.SpellTypeArcane;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has labels that are a subset");
  {
    const otherSpell = spell.copy();
    otherSpell.classification.labels = new Set([SpellLabel.SpellLabelStealth]);
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has equal number of different labels");
  {
    const otherSpell = spell.copy();
    otherSpell.classification.labels = new Set([SpellLabel.SpellLabelBigWaaagh, SpellLabel.SpellLabelNecromancy]);
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of cn");
  {
    const otherSpell = spell.copy();
    otherSpell.cn = 3;
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  }

  test("when other spell has different value of range", () => {
    const otherSpell = spell.copy();
    otherSpell.range = "otherRange";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });

  test("when other spell has different value of target", () => {
    const otherSpell = spell.copy();
    otherSpell.target = "otherTarget";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });

  test("when other spell has different value of duration", () => {
    const otherSpell = spell.copy();
    otherSpell.duration = "otherDuration";
    expect(spell.isEqualTo(otherSpell)).toBe(false);
  });
});

describe("Dark Magic lore", () => {
  test("printSpellLabel prints Lore of Dark Magic", () => {
    expect(printSpellLabel(SpellLabel.SpellLabelDarkMagic)).toBe("Lore of Dark Magic");
  });

  test("getSimplifiedLabels simplifies to SpellLabelLoreDark when all dark lores are present", () => {
    const labels = new Set([
      SpellLabel.SpellLabelDaemonology,
      SpellLabel.SpellLabelNecromancy,
      SpellLabel.SpellLabelDarkMagic,
    ]);
    const simplified = getSimplifiedLabels(SpellType.SpellTypeLore, labels);
    expect(simplified).toEqual(new Set([SpellLabel.SpellLabelLoreDark]));
  });

  test("getSimplifiedLabels retains individual dark lores when not all are present", () => {
    const labels = new Set([SpellLabel.SpellLabelDarkMagic]);
    const simplified = getSimplifiedLabels(SpellType.SpellTypeLore, labels);
    expect(simplified).toEqual(new Set([SpellLabel.SpellLabelDarkMagic]));
  });
});

