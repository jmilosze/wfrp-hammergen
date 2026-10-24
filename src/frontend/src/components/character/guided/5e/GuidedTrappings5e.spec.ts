// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import GuidedTrappings5e from "./GuidedTrappings5e.vue";
import { componentStubs } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";
import { testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

// Class 0: Clothing, Hood or Mask, 1d10 Matches. testCareer is Brass 3; level 2 gives 20 gold (one money item).
const career = testCareer();
career.level2.money = [{ coin: "gold", number: "20" }];
const context = testGuidedContext5e({ careers: [career] });

function ready(): GuidedState5e {
  const state = newGuidedState5e();
  state.species = { chosen: SpeciesWithRegion.HumanReikland };
  state.careerRolls = [{ roll: 50, species: SpeciesWithRegion.HumanReikland, career: career.id }];
  state.career = { fromRoll: 0 };
  return state;
}

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedTrappings5e, {
    props: { state, "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }), context },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

describe("GuidedTrappings5e", () => {
  test("rolls the wealth and what shows, and a choice is the player's", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    await flushPromises();
    expect(state.trappings.rolledCoins).toHaveProperty(`${career.id}:wealth`);
    expect(state.trappings.rolledClass).toHaveProperty("0:0:0");
    await wrapper.findAll("input[name=class-1]")[1].trigger("change");
    await flushPromises();
    expect(state.trappings.rolledClass["0:1:1"]).toEqual([{ id: "mask", number: 1, value: "" }]);
  });

  test("the first career roll kept gives level 2 picks, money included, as many as level 2 has", async () => {
    const state = ready();
    const wrapper = mountStep(state);
    // Two for keeping the first roll, but level 2 has only one item.
    expect(wrapper.text()).toContain("one trapping");
    const boxes = wrapper.findAll("input[type=checkbox]");
    expect(boxes).toHaveLength(1);
    await boxes[0].setValue(true);
    await flushPromises();
    expect(state.trappings.bonus).toEqual([`${career.id}:money:0`]);
    expect(state.trappings.rolledCoins[`${career.id}:money:0`]).toEqual([0, 0, 20]);
    expect(wrapper.text()).toContain("Picked: 1 of 1");
  });
});
