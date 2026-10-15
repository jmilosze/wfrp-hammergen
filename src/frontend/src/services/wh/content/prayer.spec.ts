import { expect, test } from "vitest";
import { Prayer, PrayerApiData, apiResponseToModel, modelToApi } from "./prayer.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { testIsEqualTo } from "@/testing.ts";

const prayerApiData: PrayerApiData = {
  name: "prayer",
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  source: { 1: "page 2", 3: "page 5-10" },
};

const prayerApiResponse: ApiResponse<PrayerApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": prayerApiData },
};

const prayer = new Prayer({
  id: "id",
  ownerId: "owner",
  name: "prayer",
  range: "range",
  target: "target",
  duration: "duration",
  description: "desc",
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected prayer", () => {
  expect(apiResponseToModel(prayerApiResponse, "4e")).toMatchObject(prayer);
});

test("modelToApi returns expected api prayer data", () => {
  expect(modelToApi(prayer)).toMatchObject(prayerApiData);
});

testIsEqualTo("prayer", prayer);
