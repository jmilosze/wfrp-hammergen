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
    await findButton(wrapper, "Keep").trigger("click");
    expect(state.career).toEqual({ fromRoll: 0 });
    expect(wrapper.text()).toContain("+2 trappings from level 2 (for keeping the roll)");
  });

  test("rolling two more drops the kept roll and offers each of the three for one trapping", async () => {
    const state = human();
    state.careerRolls = [{ roll: 50, species: SpeciesWithRegion.HumanReikland, career: soldier.id }];
    state.career = { fromRoll: 0 };
    const wrapper = mountStep(state);
    await findButton(wrapper, "Roll two more").trigger("click");
    expect(state.careerRolls).toHaveLength(3);
    expect(state.career).toBeNull();
    expect(buttonNames(wrapper).filter((x) => x === "Keep")).toHaveLength(3);
  });

  test("offers careers with only a level 1, not ones without it", () => {
    const short = testCareer();
    short.id = "short";
    short.name = "Short";
    short.species = [Species.Human];
    short.level2.exists = false;
    short.level3.exists = false;
    short.level4.exists = false;
    const empty = testCareer();
    empty.id = "empty";
    empty.name = "Empty";
    empty.species = [Species.Human];
    empty.level1.exists = false;
    const wrapper = mount(GuidedCareer5e, {
      props: { state: human(), context: testGuidedContext5e({ careers: [soldier, short, empty], generationProps }) },
      global: { stubs: componentStubs },
    });
    const careers = wrapper
      .findAll("select")[1]
      .findAll("option")
      .map((x) => x.text());
    expect(careers).toContain("Short");
    expect(careers).not.toContain("Empty");
  });

  test("choosing a career gives no level 2 trappings", async () => {
    const state = human();
    const wrapper = mountStep(state);
    await wrapper.findAll("select")[1].setValue(soldier.id);
    expect(state.career).toEqual({ chosen: soldier.id });
    expect(wrapper.text()).toContain("Soldier");
    expect(wrapper.text()).not.toContain("from level 2");
  });
});
