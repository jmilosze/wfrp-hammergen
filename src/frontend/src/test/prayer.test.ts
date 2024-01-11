import { describe, expect, test } from "vitest";
import { Prayer, PrayerApiData, apiResponseToModel, modelToApi } from "../services/wh/prayer.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const prayerApiData: PrayerApiData = {
  name: "prayer",
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const prayerApiResponse: ApiResponse<PrayerApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: prayerApiData,
};

const prayer = new Prayer({
  id: "id",
  canEdit: true,
  name: "prayer",
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected prayer", () => {
  expect(apiResponseToModel(prayerApiResponse)).toMatchObject(prayer);
});

test("modelToApi returns expected api prayer data", () => {
  expect(modelToApi(prayer)).toMatchObject(prayerApiData);
});

testIsEqualCommonProperties("prayer", prayer);

describe("isEqualTo returns false", () => {
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
});
