// @vitest-environment happy-dom
import { afterEach, describe, expect, test, vi } from "vitest";
import { enableAutoUnmount, mount } from "@vue/test-utils";
import CharacterAttributes from "./CharacterAttributes.vue";
import { AttributeName, Attributes } from "@/services/wh/core/attributes.ts";
import { componentStubs } from "@/testing.ts";

vi.mock("@iconify/vue", () => ({ Icon: { render: () => null } }));

enableAutoUnmount(afterEach);

const values = (base: number): Attributes => ({
  WS: base,
  BS: base + 1,
  S: base + 2,
  T: base + 3,
  I: base + 4,
  Ag: base + 5,
  Dex: base + 6,
  Int: base + 7,
  WP: base + 8,
  Fel: base + 9,
});

const valid = { valid: true, message: "" };

function mountAttributes(careerAttributes: Set<AttributeName>) {
  return mount(CharacterAttributes, {
    props: {
      title: "Characteristics",
      speciesAttributes: values(20),
      otherAttributes: values(0),
      attributeRolls: values(10),
      attributeAdvances: values(0),
      advanceStep: 5,
      rollsValidationStatus: valid,
      advancesValidationStatus: valid,
      careerAttributes: careerAttributes,
    },
    global: { stubs: componentStubs },
  });
}

// The wide table: every characteristic in one table, after the row names.
function wideTable(wrapper: ReturnType<typeof mountAttributes>) {
  return wrapper.findAll("table").at(-1);
}

describe("CharacterAttributes", () => {
  test("shows each characteristic's sources and sum", () => {
    const table = wideTable(mountAttributes(new Set()));

    expect(table?.findAll("th").map((x) => x.text())).toEqual([
      "Source",
      "WS",
      "BS",
      "S",
      "T",
      "I",
      "Ag",
      "Dex",
      "Int",
      "WP",
      "Fel",
    ]);
    const sumRow = table?.findAll("tr").at(-1);
    expect(sumRow?.findAll("td").map((x) => x.text())).toEqual([
      "Sum",
      "30",
      "34",
      "38",
      "42",
      "46",
      "50",
      "54",
      "58",
      "62",
      "66",
    ]);
  });

  test("typed advances change the character's advances", async () => {
    const wrapper = mountAttributes(new Set());
    const advancesRow = wideTable(wrapper)
      ?.findAll("tr")
      .find((x) => x.findAll("td").at(0)?.text() === "Adv");

    await advancesRow?.findAll("input")[1].setValue("5");

    expect(wrapper.props("attributeAdvances").BS).toBe(5);
  });

  test("marks the career characteristics", () => {
    const wrapper = mountAttributes(new Set([AttributeName.WS, AttributeName.Fel]));

    const career = wideTable(wrapper)
      ?.findAll("th")
      .filter((x) => x.attributes("title") === "Career characteristic")
      .map((x) => x.text());
    expect(career).toEqual(["WS", "Fel"]);
    expect(wrapper.text()).toContain("Highlighted: career characteristics you can advance.");
  });

  test("without career characteristics shows no legend", () => {
    expect(mountAttributes(new Set()).text()).not.toContain("Highlighted");
  });
});
