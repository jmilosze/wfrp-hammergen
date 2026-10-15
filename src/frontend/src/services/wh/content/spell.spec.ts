import { describe, expect, test } from "vitest";
import {
  apiResponseToModel,
  colourLores,
  expandLabel,
  getSimplifiedLabels,
  modelToApi,
  printSpellLabel,
  Spell,
  SpellApiData,
  SpellLabel,
  SpellType,
} from "./spell.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { testIsEqualTo } from "@/testing.ts";

const spellApiData: SpellApiData = {
  name: "spell",
  cn: 1,
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  classification: { type: SpellType.SpellTypeLore, labels: [SpellLabel.SpellLabelRuin, SpellLabel.SpellLabelStealth] },
  source: { 1: "page 2", 3: "page 5-10" },
};

const spellApiResponse: ApiResponse<SpellApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": spellApiData },
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
  expect(apiResponseToModel(spellApiResponse, "4e")).toMatchObject(spell);
});

test("modelToApi returns expected api spell data", () => {
  expect(modelToApi(spell)).toMatchObject(spellApiData);
});

testIsEqualTo("spell", spell);

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

describe("expandLabel", () => {
  test("returns the lores of a lore group", () => {
    expect(expandLabel(SpellLabel.SpellLabelLoreColour)).toEqual(colourLores);
  });

  test("returns a single label itself", () => {
    expect(expandLabel(SpellLabel.SpellLabelRitual)).toEqual(new Set([SpellLabel.SpellLabelRitual]));
  });
});
