// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import GuidedCharacteristics5e from "./GuidedCharacteristics5e.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// testCareer's level 1 characteristics are WS, BS and S.
const career = testCareer();
const rolls = { WS: 2, BS: 3, S: 4, T: 5, I: 6, Ag: 7, Dex: 8, Int: 9, WP: 10, Fel: 11 };

function rolled(): GuidedState5e {
  const state = newGuidedState5e();
  state.species = { chosen: SpeciesWithRegion.HumanReikland };
  state.career = { chosen: career.id };
  state.characteristics.firstRolls = { ...rolls };
  state.characteristics.method = "inOrder";
  return state;
}

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedCharacteristics5e, {
    props: {
      state,
      "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }),
      context: testGuidedContext5e({ careers: [career] }),
    },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

describe("GuidedCharacteristics5e", () => {
  test("A: points go on career characteristics, up to 6", async () => {
    const state = rolled();
    const wrapper = mountStep(state);
    for (let i = 0; i < 6; ++i) {
      await findButton(wrapper, "Add a point to WS").trigger("click");
    }
    expect(state.characteristics.points.WS).toBe(6);
    expect(findButton(wrapper, "Add a point to BS").attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("Career points left: 0 of 6");
  });

  test("B: two clicks swap two values, and the points start again", async () => {
    const state = rolled();
    state.characteristics.points.WS = 2;
    const wrapper = mountStep(state);
    await wrapper.findAll("input[type=radio]")[1].trigger("change");
    expect(state.characteristics.method).toBe("rearranged");
    expect(state.characteristics.points.WS).toBe(0);
    await findButton(wrapper, "Swap WS (2)").trigger("click");
    await findButton(wrapper, "Swap Fel (11)").trigger("click");
    expect(state.characteristics.assigned.WS).toBe(11);
    expect(state.characteristics.assigned.Fel).toBe(2);
  });

  test("rolling ten new values ends A and B", async () => {
    const state = rolled();
    const wrapper = mountStep(state);
    await findButton(wrapper, "Roll ten new values (ends A and B)").trigger("click");
    expect(state.characteristics.newRolls).not.toBeNull();
    expect(state.characteristics.method).toBe("rolledAgain");
    const radios = wrapper.findAll("input[type=radio]");
    expect(radios[0].attributes("disabled")).toBeDefined();
    expect(radios[1].attributes("disabled")).toBeDefined();
  });
});
