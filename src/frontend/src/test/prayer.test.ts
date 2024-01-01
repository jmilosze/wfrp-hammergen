import { test, describe, expect } from "vitest";
import { apiResponseToModel, modelToApi, WhPrayer, WhPrayerApiData } from "../services/wh/prayer.ts";
import { WhApiResponse, WhSource } from "../services/wh/common.ts";

const prayerApiData: WhPrayerApiData = {
  name: "prayer",
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const prayerApiResponse: WhApiResponse<WhPrayerApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: prayerApiData,
};

const prayer = new WhPrayer();
prayer.id = "id";
prayer.canEdit = true;
prayer.name = "prayer";
prayer.range = "range";
prayer.target = "target";
prayer.duration = "duration";
prayer.description = "desc";
prayer.shared = true;
prayer.source = { 1: "page 2", 3: "page 5-10" };

test("apiResponseToModel returns expected prayer", () => {
  expect(apiResponseToModel(prayerApiResponse)).toMatchObject(prayer);
});

test("modelToApi returns expected api prayer data", () => {
  expect(modelToApi(prayer)).toMatchObject(prayerApiData);
});

describe("isEqualTo returns true", () => {
  const otherPrayer = prayer.copy();
  test("when prayers are the same", () => {
    expect(prayer.isEqualTo(otherPrayer)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other prayer has different value of id");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.id = "otherId";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of name");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.name = "otherName";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of range");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.range = "otherRange";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of target");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.target = "otherTarget";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of duration");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.duration = "otherDuration";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of description");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.description = "otherDescription";
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of canEdit");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.canEdit = false;
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test("when other prayer has different value of shared");
  {
    const otherPrayer = prayer.copy();
    otherPrayer.shared = false;
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  }

  test.each<{ diff: string; source: WhSource }>([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other prayer has $diff", (t) => {
    const otherPrayer = prayer.copy();
    otherPrayer.source = t.source;
    expect(prayer.isEqualTo(otherPrayer)).toBe(false);
  });
});
