// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import GuidedSkills5e from "./GuidedSkills5e.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// Human species skills: sp1–sp8 and the Stealth group; testCareer's level 1 skills: s1–s10.
const career = testCareer();
const context = testGuidedContext5e({ careers: [career] });

function ready(): GuidedState5e {
  const state = newGuidedState5e();
  state.species = { chosen: SpeciesWithRegion.HumanReikland };
  state.career = { chosen: career.id };
  return state;
}

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedSkills5e, {
    props: { state, "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }), context },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

describe("GuidedSkills5e", () => {
  test("picks species skills up to five; a group needs a specialisation", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    const boxes = wrapper.findAll("input[type=checkbox]");
    for (let i = 0; i < 4; ++i) {
      await boxes[i].setValue(true);
    }
    await boxes[8].setValue(true);
    expect(state.skills.species).toEqual({ sp1: "sp1", sp2: "sp2", sp3: "sp3", sp4: "sp4", stealth: "" });
    expect(boxes[5].attributes("disabled")).toBeDefined();
    await wrapper.find("select").setValue("stealthUrban");
    expect(state.skills.species.stealth).toBe("stealthUrban");
  });

  test("career Advances stop at +15 and at eight", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    for (let i = 0; i < 4; ++i) {
      await findButton(wrapper, "Add an Advance to s1").trigger("click");
    }
    expect(state.skills.advances.s1).toBe(3);
    for (let i = 0; i < 3; ++i) {
      await findButton(wrapper, "Add an Advance to s2").trigger("click");
    }
    await findButton(wrapper, "Add an Advance to s3").trigger("click");
    await findButton(wrapper, "Add an Advance to s3").trigger("click");
    expect(state.skills.advances).toEqual({ s1: 3, s2: 3, s3: 2 });
    expect(findButton(wrapper, "Add an Advance to s4").attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("Advances left: 0 of 8");
  });
});
