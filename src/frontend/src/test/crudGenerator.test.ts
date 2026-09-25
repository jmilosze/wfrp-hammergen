import { describe, expect, test, vi } from "vitest";
import { AxiosInstance } from "axios";
import { createWhApi, defineWhApi } from "../services/wh/crudGenerator.ts";
import { ApiResponse, Visibility } from "../services/wh/common.ts";

interface TestModel {
  id: string;
  name: string;
}

interface TestApiData {
  name: string;
}

const mockApiResponse: ApiResponse<TestApiData> = {
  id: "item-1",
  ownerId: "owner-1",
  visibility: Visibility.Shared,
  object: { name: "Test Item" },
};

function toModel(resp: ApiResponse<TestApiData>): TestModel {
  return { id: resp.id, name: resp.object.name };
}

function toApi(model: TestModel): TestApiData {
  return { name: model.name };
}

describe("crudGenerator", () => {
  const basePath = "/api/test";

  test("getElement fetches by ID and transforms response", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi<TestModel, TestApiData>(basePath, mockAxios, toModel, toApi);
    const result = await api.getElement("item-1");

    expect(mockAxios.get).toHaveBeenCalledWith("/api/test/item-1");
    expect(result).toEqual({ id: "item-1", name: "Test Item" });
  });

  test("listElements fetches list and maps elements to model", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: [mockApiResponse] } }),
    } as unknown as AxiosInstance;

    const api = createWhApi<TestModel, TestApiData>(basePath, mockAxios, toModel, toApi);
    const result = await api.listElements();

    expect(mockAxios.get).toHaveBeenCalledWith("/api/test");
    expect(result).toEqual([{ id: "item-1", name: "Test Item" }]);
  });

  test("createElement posts serialized model and returns api response", async () => {
    const mockAxios = {
      post: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi<TestModel, TestApiData>(basePath, mockAxios, toModel, toApi);
    const result = await api.createElement({ id: "item-1", name: "Test Item" });

    expect(mockAxios.post).toHaveBeenCalledWith("/api/test", { name: "Test Item" });
    expect(result).toEqual(mockApiResponse);
  });

  test("updateElement puts serialized model with ID and returns api response", async () => {
    const mockAxios = {
      put: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const api = createWhApi<TestModel, TestApiData>(basePath, mockAxios, toModel, toApi);
    const result = await api.updateElement({ id: "item-1", name: "Test Item" });

    expect(mockAxios.put).toHaveBeenCalledWith("/api/test/item-1", { name: "Test Item" });
    expect(result).toEqual(mockApiResponse);
  });

  test("deleteElement deletes by ID", async () => {
    const mockAxios = {
      delete: vi.fn().mockResolvedValue({ data: null }),
    } as unknown as AxiosInstance;

    const api = createWhApi<TestModel, TestApiData>(basePath, mockAxios, toModel, toApi);
    await api.deleteElement("item-1");

    expect(mockAxios.delete).toHaveBeenCalledWith("/api/test/item-1");
  });

  test("defineWhApi curries configuration and returns working client with injected axios", async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: { data: mockApiResponse } }),
    } as unknown as AxiosInstance;

    const apiFactory = defineWhApi<TestModel, TestApiData>(basePath, toModel, toApi);
    const client = apiFactory(mockAxios);

    const result = await client.getElement("item-1");
    expect(mockAxios.get).toHaveBeenCalledWith("/api/test/item-1");
    expect(result).toEqual({ id: "item-1", name: "Test Item" });
  });
});
