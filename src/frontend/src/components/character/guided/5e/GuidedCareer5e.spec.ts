// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import GuidedCareer5e from "./GuidedCareer5e.vue";
import { buttonNames, componentStubs, findButton } from "@/testing.ts";
import { Species, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GuidedState5e, newGuidedState5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { genProps5e, testGuidedContext5e } from "@/services/wh/character/generation/5e/fixtures5e.ts";
import { testCareer } from "@/services/wh/character/generation/fixtures.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const soldier = testCareer();
soldier.name = "Soldier";
soldier.species = [Species.Human];
const generationProps = {
  ...genProps5e,
  careerTable: { [SpeciesWithRegion.HumanReikland]: [{ id: soldier.id, minRoll: 1, maxRoll: 101 }] },
};

function mountStep(state: GuidedState5e) {
  const wrapper = mount(GuidedCareer5e, {
    props: {
      state,
      "onUpdate:state": (value: GuidedState5e) => wrapper.setProps({ state: value }),
      context: testGuidedContext5e({ careers: [soldier], generationProps }),
    },
    global: { stubs: componentStubs },
  });
  return wrapper;
}

function human(): GuidedState5e {
  const state = newGuidedState5e();
  state.species = { chosen: SpeciesWithRegion.HumanReikland };
  return state;
}

describe("GuidedCareer5e", () => {
  test("the first roll can be kept for two level 2 trappings", async () => {
    const state = human();
    const wrapper = mountStep(state);
    await findButton(wrapper, "Roll").trigger("click");
    expect(state.careerRolls).toHaveLength(1);
    await findButton(wrapper, "Keep (2 trappings from level 2)").trigger("click");
    expect(state.career).toEqual({ fromRoll: 0 });
    expect(wrapper.text()).toContain("You also get two trappings from level 2");
  });

  test("rolling two more drops the kept roll and offers each of the three for one trapping", async () => {
    const state = human();
    state.careerRolls = [{ roll: 50, species: SpeciesWithRegion.HumanReikland, career: soldier.id }];
    state.career = { fromRoll: 0 };
    const wrapper = mountStep(state);
    await findButton(wrapper, "Roll two more").trigger("click");
    expect(state.careerRolls).toHaveLength(3);
    expect(state.career).toBeNull();
    expect(buttonNames(wrapper).filter((x) => x === "Keep (1 trapping from level 2)")).toHaveLength(3);
  });

  test("choosing a career gives no level 2 trappings", async () => {
    const state = human();
    const wrapper = mountStep(state);
    await wrapper.findAll("select")[1].setValue(soldier.id);
    expect(state.career).toEqual({ chosen: soldier.id });
    expect(wrapper.text()).toContain("Soldier");
    expect(wrapper.text()).not.toContain("You also get");
  });
});
