// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterCareer from "./CharacterCareer.vue";
import ChecklistRow from "@/components/picker/ChecklistRow.vue";
import { Career, copyCareerLevel, zeroCareerLevel } from "@/services/wh/content/career.ts";
import { IdNumber } from "@/utils/idNumber.ts";
import { componentStubs, findButton } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

function career(id: string, name: string, levels: string[]): Career {
  const level = (i: number) => ({
    ...copyCareerLevel(zeroCareerLevel),
    exists: i < levels.length,
    name: levels[i] ?? "",
  });
  return new Career({ id, name, level1: level(0), level2: level(1), level3: level(2), level4: level(3) });
}

const careerList = [career("w", "Witch", ["Hexer", "Witch"]), career("a", "Apothecary", ["Apprentice"])];

function mountCareer(currentCareer: IdNumber | undefined, pastCareers: IdNumber[]) {
  return mount(CharacterCareer, {
    props: { careerList, currentCareer, pastCareers },
    global: { stubs: componentStubs },
    attachTo: document.body,
  });
}

function cell(wrapper: ReturnType<typeof mountCareer>, title: string): string {
  const label = wrapper.findAll("[data-sheet-label]").find((x) => x.text() === title);
  return label?.element.nextElementSibling?.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

// The popup's row of a career level and its Current and Past checkboxes.
async function openRow(wrapper: ReturnType<typeof mountCareer>, careerName: string, levelName: string) {
  await findButton(wrapper, "Edit").trigger("click");
  const row = wrapper
    .findAllComponents(ChecklistRow)
    .find((x) => x.props("item").name === careerName && x.props("item").note?.includes(levelName));
  if (row === undefined) {
    throw new Error(`No row ${careerName} ${levelName}`);
  }
  const choice = (label: string) =>
    row
      .findAll("label")
      .find((x) => x.text() === label)
      ?.find("input");
  return { current: choice("Current"), past: choice("Past") };
}

describe("CharacterCareer", () => {
  test("shows the current career and the past ones with their levels", () => {
    const wrapper = mountCareer({ id: "w", number: 2 }, [
      { id: "w", number: 1 },
      { id: "a", number: 1 },
    ]);

    expect(cell(wrapper, "Current")).toBe("Witch 2");
    expect(cell(wrapper, "Past")).toBe("Apothecary 1, Witch 1");
  });

  test("ticking Current on another level makes it the current career", async () => {
    const wrapper = mountCareer({ id: "w", number: 1 }, []);

    const { current } = await openRow(wrapper, "Witch", "Witch");
    await current?.trigger("change");

    expect(wrapper.emitted("currentSelected")).toEqual([[{ id: "w", number: 2, selected: true }]]);
  });

  test("unticking Current leaves no current career; Past toggles a past career", async () => {
    const wrapper = mountCareer({ id: "w", number: 1 }, []);

    const hexer = await openRow(wrapper, "Witch", "Hexer");
    await hexer.current?.trigger("change");
    expect(wrapper.emitted("currentSelected")).toEqual([[{ id: "w", number: 1, selected: false }]]);

    const apprentice = await openRow(wrapper, "Apothecary", "Apprentice");
    await apprentice.past?.trigger("change");
    expect(wrapper.emitted("pastSelected")).toEqual([[{ id: "a", number: 1, selected: true }]]);
  });

  test("a level can't be both current and past", async () => {
    const wrapper = mountCareer({ id: "w", number: 1 }, [{ id: "a", number: 1 }]);

    const hexer = await openRow(wrapper, "Witch", "Hexer");
    expect(hexer.past?.attributes("disabled")).toBeDefined();
    const apprentice = await openRow(wrapper, "Apothecary", "Apprentice");
    expect(apprentice.current?.attributes("disabled")).toBeDefined();
  });

  test("asks to tick the earlier levels of the current career when none is a past career", () => {
    const hint = "Tick the earlier levels of Witch";

    expect(mountCareer({ id: "w", number: 2 }, [{ id: "a", number: 1 }]).text()).toContain(hint);
    expect(mountCareer({ id: "w", number: 2 }, [{ id: "w", number: 1 }]).text()).not.toContain(hint);
    expect(mountCareer({ id: "w", number: 1 }, []).text()).not.toContain(hint);
  });
});
