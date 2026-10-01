import { describe, expect, test } from "vitest";
import { Talent } from "../services/wh/talent.ts";
import { Trait } from "../services/wh/trait.ts";
import { Career, Species } from "../services/wh/career.ts";
import { ArmourGroup, Item, ItemType, MeleeGroup } from "../services/wh/item.ts";
import { Skill } from "../services/wh/skill.ts";
import { AttributeName } from "../services/wh/attributes.ts";
import { CharacterModifiers, ModifierEffect } from "../services/wh/characterModifiers.ts";

describe("forEdition", () => {
  test("keeps sources offered for the edition, otherwise uses Custom", () => {
    const skill = new Skill({ name: "Charm", source: { 0: "custom notes", 1: "p. 121" } });
    expect(skill.forEdition("5e").source).toEqual({ 0: "custom notes" });
    expect(new Skill({ source: { 1: "p. 121" } }).forEdition("5e").source).toEqual({ 0: "" });
    expect(new Skill({ source: { 44: "p. 98" } }).forEdition("4e").source).toEqual({ 0: "" });
  });

  test("returns a copy and leaves the original unchanged", () => {
    const talent = new Talent({ name: "Luck", tests: "Fate", attribute: AttributeName.Fel });
    const variant = talent.forEdition("5e");
    expect(variant).not.toBe(talent);
    expect(variant.name).toBe("Luck");
    expect(talent.tests).toBe("Fate");
    expect(talent.attribute).toBe(AttributeName.Fel);
  });

  test("5e talent has no tests, no characteristic bonuses and a max rank of at least 1", () => {
    const talent = new Talent({
      tests: "Fate",
      maxRank: 0,
      attribute: AttributeName.Fel,
      attribute2: AttributeName.Int,
      modifiers: new CharacterModifiers({ effects: [ModifierEffect.Hardy] }),
    });
    const variant = talent.forEdition("5e");
    expect(variant.tests).toBe("");
    expect(variant.attribute).toBe(AttributeName.None);
    expect(variant.attribute2).toBe(AttributeName.None);
    expect(variant.maxRank).toBe(1);
    expect([...variant.modifiers.effects]).toEqual([ModifierEffect.Hardy]);
  });

  test("4e drops 5e-only effects", () => {
    const trait = new Trait({
      modifiers: new CharacterModifiers({ effects: [ModifierEffect.Hardy, ModifierEffect.Sturdy] }),
    });
    expect([...trait.forEdition("4e").modifiers.effects]).toEqual([ModifierEffect.Hardy]);
  });

  test("5e career keeps only 5e species", () => {
    const career = new Career({ species: [Species.Human, Species.Gnome, Species.Dwarf, Species.Ogre] });
    expect(career.forEdition("5e").species).toEqual([Species.Human, Species.Dwarf]);
  });

  test("item groups the edition doesn't have are reset", () => {
    const item = new Item({ type: ItemType.Melee });
    item.melee.group = MeleeGroup.Parry;
    item.armour.group = ArmourGroup.Brigandine;
    const variant = item.forEdition("5e");
    expect(variant.melee.group).toBe(MeleeGroup.Basic);
    expect(variant.armour.group).toBe(ArmourGroup.Leather);

    item.melee.group = MeleeGroup.Fencing;
    expect(item.forEdition("5e").melee.group).toBe(MeleeGroup.Fencing);
  });
});
