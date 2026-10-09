import { describe, expect, test } from "vitest";
import { GroupPicker, resolveEntityGroups } from "./groups.ts";
import { getSelectRandomTest } from "../../../../../testing.ts";
import { Skill } from "../../../content/skill.ts";
import { Talent } from "../../../content/talent.ts";

describe("resolveEntityGroups", () => {
  test("indexes skills by group", () => {
    const dummySkills: Skill[] = [
      new Skill({ id: "melee_basic", name: "Melee (Basic)", group: new Set(["melee", "combat"]) }),
      new Skill({ id: "melee_brawling", name: "Melee (Brawling)", group: new Set(["melee"]) }),
      new Skill({ id: "dodge", name: "Dodge" }),
    ];

    const groups = resolveEntityGroups(dummySkills);
    expect(groups).toEqual({
      melee: ["melee_basic", "melee_brawling"],
      combat: ["melee_basic"],
    });
  });

  test("indexes talents by group", () => {
    const dummyTalents: Talent[] = [
      new Talent({ id: "t0", group: new Set(["g1", "g2"]) }),
      new Talent({ id: "t1", group: new Set(["g1"]) }),
      new Talent({ id: "t2" }),
    ];

    const groups = resolveEntityGroups(dummyTalents);
    expect(groups).toEqual({
      g1: ["t0", "t1"],
      g2: ["t0"],
    });
  });

  test("ignores entities without groups or with empty groups", () => {
    const groups = resolveEntityGroups([{ id: "e1" }, { id: "e2", group: new Set<string>() }, { id: "e3", group: [] }]);
    expect(groups).toEqual({});
  });

  test("returns empty object when entities array is empty", () => {
    const groups = resolveEntityGroups([]);
    expect(groups).toEqual({});
  });

  test("works with custom groupable objects", () => {
    const custom = [
      { id: "item1", group: ["catA", "catB"] },
      { id: "item2", group: ["catA"] },
    ];
    const groups = resolveEntityGroups(custom);
    expect(groups).toEqual({
      catA: ["item1", "item2"],
      catB: ["item1"],
    });
  });
});

describe("GroupPicker", () => {
  test("identifies groups", () => {
    const picker = new GroupPicker({ melee: ["melee_basic"] }, getSelectRandomTest(0));
    expect(picker.isGroup("melee")).toBe(true);
    expect(picker.isGroup("melee_basic")).toBe(false);
  });

  test("never returns the same member of a group twice", () => {
    const picker = new GroupPicker({ melee: ["melee_basic", "melee_brawling"] }, getSelectRandomTest(0));
    expect(picker.pick("melee", [])).toBe("melee_basic");
    expect(picker.pick("melee", [])).toBe("melee_brawling");
    expect(picker.pick("melee", [])).toBeNull();
  });

  test("skips excluded members and removes them from the pool", () => {
    const picker = new GroupPicker({ melee: ["melee_basic", "melee_brawling"] }, getSelectRandomTest(0));
    expect(picker.pick("melee", ["melee_basic"])).toBe("melee_brawling");
    expect(picker.pick("melee", [])).toBeNull();
  });

  test("does not modify the source group map", () => {
    const groupMap = { melee: ["melee_basic", "melee_brawling"] };
    const picker = new GroupPicker(groupMap, getSelectRandomTest(0));
    picker.pick("melee", []);
    expect(groupMap.melee).toEqual(["melee_basic", "melee_brawling"]);
  });
});
