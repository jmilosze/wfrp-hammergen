import { describe, expect, test } from "vitest";
import { Spell, SpellLabel, SpellType } from "@/services/wh/content/spell.ts";
import { filterSections, matchesFilters } from "./contentFilter.ts";
import { spellFilters } from "./spellFilters.ts";

function spell(id: string, type: SpellType, labels: SpellLabel[]): Spell {
  return new Spell({ id, classification: { type, labels: new Set(labels) } });
}

const fireball = spell("fireball", SpellType.SpellTypeLore, [SpellLabel.SpellLabelFire]);
const blessing = spell("blessing", SpellType.SpellTypeLore, [SpellLabel.SpellLabelLight]);
const ritual = spell("ritual", SpellType.SpellTypeLore, []);
const dart = spell("dart", SpellType.SpellTypePetty, []);
const lore = SpellType.SpellTypeLore.toString();
const petty = SpellType.SpellTypePetty.toString();

function matching(ticked: Record<string, string[]>): Spell[] {
  return [fireball, blessing, ritual, dart].filter((x) => matchesFilters(spellFilters, x, ticked));
}

describe("spellFilters", () => {
  test("offers labels only under a ticked type, with No label", () => {
    const list = [fireball, dart];
    expect(filterSections(spellFilters, list, {})[1].options).toEqual([]);

    const labels = filterSections(spellFilters, list, { type: [lore] })[1].options;
    expect(labels.every((x) => x.heading === "Lore spell")).toBe(true);
    expect(labels.at(-1)).toEqual({ text: "No label", value: `${lore}:no`, heading: "Lore spell" });
  });

  test("matches spells of a ticked type with any ticked label of that type", () => {
    expect(matching({ type: [lore], label: [`${lore}:${SpellLabel.SpellLabelFire}`, `${lore}:no`] })).toEqual([
      fireball,
      ritual,
    ]);
  });

  test("lets labels narrow down only their own type", () => {
    expect(matching({ type: [lore, petty], label: [`${lore}:${SpellLabel.SpellLabelFire}`] })).toEqual([
      fireball,
      dart,
    ]);
  });
});
