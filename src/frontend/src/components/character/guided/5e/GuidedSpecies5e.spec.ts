// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import GuidedSpecies5e from "./GuidedSpecies5e.vue";
import { componentStubs, findButton } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedSpecies5e, {
    props: {
      state,
      "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }),
      context: testGuidedContext5e(),
    },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

describe("GuidedSpecies5e", () => {
  test("a kept first roll is the species and gives +1 Fortune", async () => {
    const state = newGuidedState5e();
    state.speciesRolls = [{ roll: 12, species: SpeciesWithRegion.HumanReikland }];
    const wrapper = mountStep(state);
    await findButton(wrapper, "Keep").trigger("click");
    expect(state.species).toEqual({ fromRoll: 0 });
    expect(wrapper.text()).toContain("Fortune 4 (+1 for keeping the first roll)");
  });

  test("rolling again adds a roll, and the bonus is gone", async () => {
    const state = newGuidedState5e();
    state.speciesRolls = [{ roll: 12, species: SpeciesWithRegion.HumanReikland }];
    state.species = { fromRoll: 0 };
    const wrapper = mountStep(state);
    await findButton(wrapper, "Roll again").trigger("click");
    expect(state.speciesRolls).toHaveLength(2);
    expect(wrapper.text()).toContain("Fortune 3");
    expect(wrapper.text()).not.toContain("+1");
  });

  test("choosing a species takes it without a bonus", async () => {
    const state = newGuidedState5e();
    const wrapper = mountStep(state);
    await wrapper.find("select").setValue(SpeciesWithRegion.DwarfDefault);
    expect(state.species).toEqual({ chosen: SpeciesWithRegion.DwarfDefault });
    expect(wrapper.text()).toContain("Fate 2 · Fortune 2");
  });
});
