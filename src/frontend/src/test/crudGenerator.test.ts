import { describe, expect, test, vi } from "vitest";
import { AxiosInstance } from "axios";
import { createWhApi, defineWhApi } from "../services/wh/crudGenerator.ts";
import { ApiResponse, variant, Visibility } from "../services/wh/common.ts";

interface TestModel {
  id: string;
  name: string;
  visibility: Visibility;
}

interface TestApiData {
  name: string;
}

const mockApiResponse: ApiResponse<TestApiData> = {
  id: "item-1",
  ownerId: "owner-1",
  visibility: Visibility.Shared,
  editions: { "4e": { name: "Test Item" } },
};

function toModel(resp: ApiResponse<TestApiData>): TestModel {
  return { id: resp.id, name: variant(resp, "4e").name, visibility: resp.visibility ?? Visibility.Private };
}

function toApi(model: TestModel): TestApiData {
  return { name: model.name };
}

const testModel: TestModel = { id: "item-1", name: "Test Item", visibility: Visibility.Shared };

describe("crudGenerator", () => {
  const basePath = "/api/test";

  test("getElement fetches by ID with edition and transforms response", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi(basePath, mockAxios, toModel, toApi);
    const result = await api.getElement("item-1", "4e");

    expect(mockAxios.get).toHaveBeenCalledWith("/api/test/item-1", { params: { edition: "4e" } });
    expect(result).toEqual(testModel);
  });

  test("listElements fetches list with edition and maps elements to model", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: [mockApiResponse] } }),
    } as unknown as AxiosInstance;

    const api = createWhApi(basePath, mockAxios, toModel, toApi);
    const result = await api.listElements("5e");

    expect(mockAxios.get).toHaveBeenCalledWith("/api/test", { params: { edition: "5e" } });
    expect(result).toEqual([testModel]);
  });

  test("createElement posts the request built from the model and returns api response", async () => {
    const mockAxios = {
      post: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi(basePath, mockAxios, toModel, toApi);
    const result = await api.createElement(testModel);

    expect(mockAxios.post).toHaveBeenCalledWith("/api/test", { name: "Test Item" });
    expect(result).toEqual(mockApiResponse);
  });

  test("updateElement puts the request built from the model with ID and returns api response", async () => {
    const mockAxios = {
      put: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi(basePath, mockAxios, toModel, toApi);
    const result = await api.updateElement(testModel);

    expect(mockAxios.put).toHaveBeenCalledWith("/api/test/item-1", { name: "Test Item" });
    expect(result).toEqual(mockApiResponse);
  });

  test("deleteElement deletes by ID with edition", async () => {
    const mockAxios = {
      delete: vi.fn().mockResolvedValue({ data: null }),
    } as unknown as AxiosInstance;

    const api = createWhApi(basePath, mockAxios, toModel, toApi);
    await api.deleteElement("item-1", "4e");

    expect(mockAxios.delete).toHaveBeenCalledWith("/api/test/item-1", { params: { edition: "4e" } });
  });

  test("defineWhApi sends the model as the UI edition variant with visibility on top", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
      post: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
      put: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const client = defineWhApi<TestModel, TestApiData>(basePath, toModel, toApi)(mockAxios);

    expect(await client.getElement("item-1", "4e")).toEqual(testModel);
    expect(mockAxios.get).toHaveBeenCalledWith("/api/test/item-1", { params: { edition: "4e" } });

    const request = { visibility: Visibility.Shared, editions: { "4e": { name: "Test Item" } } };
    await client.createElement(testModel);
    expect(mockAxios.post).toHaveBeenCalledWith("/api/test", request);
    await client.updateElement(testModel);
    expect(mockAxios.put).toHaveBeenCalledWith("/api/test/item-1", request);
  });

  test("variant throws when the edition is missing", () => {
    expect(() => variant(mockApiResponse, "5e")).toThrow("item-1 has no 5e variant");
  });
});
