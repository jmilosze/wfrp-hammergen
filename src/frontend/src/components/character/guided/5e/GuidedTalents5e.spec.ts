// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import GuidedTalents5e from "./GuidedTalents5e.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// Human species talents: Doomed and two Random Talents (rand1, rand2); testCareer's level 1 talents: t1a, t1b.
const career = testCareer();
const context = testGuidedContext5e({ careers: [career] });

function ready(): GuidedState5e {
  const state = newGuidedState5e();
  state.species = { chosen: SpeciesWithRegion.HumanReikland };
  state.career = { chosen: career.id };
  state.characteristics.firstRolls = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };
  state.characteristics.method = "inOrder";
  return state;
}

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedTalents5e, {
    props: { state, "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }), context },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

describe("GuidedTalents5e", () => {
  test("rolls each Random Talent, never the same twice", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    expect(wrapper.text()).toContain("doomed");
    await wrapper
      .findAll("button")
      .filter((x) => x.text() === "Roll a Random Talent")[0]
      .trigger("click");
    await findButton(wrapper, "Roll a Random Talent").trigger("click");
    expect([...state.talents.randomRolls].sort()).toEqual(["rand1", "rand2"]);
  });

  test("takes a career talent", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    const radios = wrapper.findAll("input[name=career-talent]");
    expect(radios).toHaveLength(2);
    await radios[1].trigger("change");
    expect(state.talents.career).toBe("t1b");
  });
});
