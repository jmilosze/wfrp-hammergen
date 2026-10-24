// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterStartPanel from "./CharacterStartPanel.vue";
import { buttonNames, componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

function mountPanel(props: { guidedAvailable?: boolean; guidedSummary?: string }) {
  return mount(CharacterStartPanel, {
    props: { generationSummary: "Human · Soldier · Level 1", ...props },
    global: { stubs: componentStubs },
  });
}

describe("CharacterStartPanel", () => {
  test("Guided is not offered where the editor has no guided creation", () => {
    const wrapper = mountPanel({});
    expect(findButton(wrapper, "Guided (soon)").attributes("disabled")).toBeDefined();
  });

  test("Guided opens guided creation where the editor has it", async () => {
    const wrapper = mountPanel({ guidedAvailable: true });
    await findButton(wrapper, "Guided…").trigger("click");
    expect(wrapper.emitted("guided")).toHaveLength(1);
  });

  test("after guided creation, shows what was created and a way back", async () => {
    const wrapper = mountPanel({ guidedAvailable: true, guidedSummary: "Dwarf · Miner" });
    expect(wrapper.text()).toContain("Character created with guided creation");
    expect(wrapper.text()).toContain("Dwarf · Miner");
    expect(buttonNames(wrapper)).toContain("Generate…");
    await findButton(wrapper, "Back to guided creation").trigger("click");
    expect(wrapper.emitted("guided")).toHaveLength(1);
  });
});
