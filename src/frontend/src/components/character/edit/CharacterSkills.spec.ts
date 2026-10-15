// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterSkills from "./CharacterSkills.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import { Skill } from "@/services/wh/content/skill.ts";
import { AttributeName, Attributes } from "@/services/wh/core/attributes.ts";
import { componentStubs } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const skillList = [
  new Skill({ id: "dodge", name: "Dodge", attribute: AttributeName.Ag }),
  new Skill({ id: "charm", name: "Charm", attribute: AttributeName.Fel }),
  new Skill({ id: "lore", name: "Lore", isGroup: true }),
];

const attributes: Attributes = { WS: 30, BS: 30, S: 30, T: 30, I: 30, Ag: 40, Dex: 30, Int: 30, WP: 30, Fel: 25 };

function mountSkills(skills: Record<string, number>) {
  return mount(CharacterSkills, {
    props: { skillList, skills, attributes, validationStatus: { valid: true, message: "" } },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

function rows(wrapper: ReturnType<typeof mountSkills>): string[][] {
  return wrapper.findAll("tbody tr").map((r) =>
    r
      .findAll("td")
      .slice(0, 4)
      .map((x) => x.text()),
  );
}

describe("CharacterSkills", () => {
  test("lists the taken skills by name with advances and skill value", () => {
    const wrapper = mountSkills({ dodge: 5, charm: 10 });

    expect(rows(wrapper)).toEqual([
      ["Charm", "Fel", "10", "35"],
      ["Dodge", "Ag", "5", "45"],
    ]);
  });

  test("follows the character's skills and characteristics", async () => {
    const wrapper = mountSkills({ dodge: 5 });

    await wrapper.setProps({ skills: { dodge: 15 }, attributes: { ...attributes, Ag: 50 } });

    expect(rows(wrapper)).toEqual([["Dodge", "Ag", "15", "65"]]);
  });

  test("asks to set a removed skill to 0", async () => {
    const wrapper = mountSkills({ dodge: 5 });

    await wrapper.find("button[aria-label='Remove Dodge']").trigger("click");

    expect(wrapper.emitted("updated")).toEqual([[{ id: "dodge", number: 0 }]]);
  });

  test("offers the skills that can be taken, not groups, with their advances", async () => {
    const wrapper = mountSkills({ dodge: 5 });

    await wrapper
      .findAll("button")
      .find((x) => x.text() === "Edit")
      ?.trigger("click");
    const picker = wrapper.findComponent(ChecklistPicker);

    expect(picker.props("items").map((x) => [x.name, x.number, x.note])).toEqual([
      ["Charm", 0, "Basic · Fel"],
      ["Dodge", 5, "Basic · Ag"],
    ]);
    picker.vm.$emit("setNumber", { id: "charm", number: 3 });
    expect(wrapper.emitted("updated")).toEqual([[{ id: "charm", number: 3 }]]);
  });
});
