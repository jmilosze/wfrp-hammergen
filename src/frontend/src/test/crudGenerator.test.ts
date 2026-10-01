import { describe, expect, test, vi } from "vitest";
import { AxiosInstance } from "axios";
import { createWhApi, defineContentApi } from "../services/wh/crudGenerator.ts";
import { ApiResponse, Edition, variant, Visibility } from "../services/wh/common.ts";

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

  describe("defineContentApi", () => {
    const bothEditions: ApiResponse<TestApiData> = {
      id: "item-1",
      ownerId: "owner-1",
      visibility: Visibility.Shared,
      editions: { "4e": { name: "Item 4e" }, "5e": { name: "Item 5e" } },
    };
    const toContentModel = (resp: ApiResponse<TestApiData>, edition: Edition): TestModel => ({
      id: resp.id,
      name: variant(resp, edition).name,
      visibility: resp.visibility ?? Visibility.Private,
    });
    const model4e: TestModel = { id: "item-1", name: "Item 4e", visibility: Visibility.Shared };
    const model5e: TestModel = { id: "item-1", name: "Item 5e", visibility: Visibility.Shared };

    test("listElements lists one edition and maps its variant", async () => {
      const mockAxios = {
        get: vi
          .fn()
          .mockResolvedValue({ data: { data: [{ ...bothEditions, editions: { "5e": { name: "Item 5e" } } }] } }),
      } as unknown as AxiosInstance;

      const client = defineContentApi(basePath, toContentModel, toApi)(mockAxios);

      expect(await client.listElements("5e")).toEqual([model5e]);
      expect(mockAxios.get).toHaveBeenCalledWith("/api/test", { params: { edition: "5e" } });
    });

    test("getDocument reads all variants", async () => {
      const mockAxios = {
        get: vi.fn().mockResolvedValue({ data: { data: bothEditions } }),
      } as unknown as AxiosInstance;

      const client = defineContentApi(basePath, toContentModel, toApi)(mockAxios);

      expect(await client.getDocument("item-1")).toEqual({ "4e": model4e, "5e": model5e });
      expect(mockAxios.get).toHaveBeenCalledWith("/api/test/item-1");
    });

    test("getDocument skips missing variants", async () => {
      const mockAxios = {
        get: vi
          .fn()
          .mockResolvedValue({ data: { data: { ...bothEditions, editions: { "4e": { name: "Item 4e" } } } } }),
      } as unknown as AxiosInstance;

      const client = defineContentApi(basePath, toContentModel, toApi)(mockAxios);

      expect(await client.getDocument("item-1")).toEqual({ "4e": model4e });
    });

    test("createDocument and updateDocument send visibility and every variant", async () => {
      const mockAxios = {
        post: vi.fn().mockResolvedValue({ data: { data: { id: "item-1", ownerId: "owner-1" } } }),
        put: vi.fn().mockResolvedValue({ data: { data: { id: "item-1", ownerId: "owner-1" } } }),
      } as unknown as AxiosInstance;

      const client = defineContentApi(basePath, toContentModel, toApi)(mockAxios);
      const request = {
        visibility: Visibility.Public,
        editions: { "4e": { name: "Item 4e" }, "5e": { name: "Item 5e" } },
      };

      await client.createDocument(Visibility.Public, { "4e": model4e, "5e": model5e });
      expect(mockAxios.post).toHaveBeenCalledWith("/api/test", request);
      await client.updateDocument("item-1", Visibility.Public, { "4e": model4e, "5e": model5e });
      expect(mockAxios.put).toHaveBeenCalledWith("/api/test/item-1", request);
    });

    test("deleteElement deletes the whole document", async () => {
      const mockAxios = {
        delete: vi.fn().mockResolvedValue({ data: null }),
      } as unknown as AxiosInstance;

      const client = defineContentApi(basePath, toContentModel, toApi)(mockAxios);
      await client.deleteElement("item-1");

      expect(mockAxios.delete).toHaveBeenCalledWith("/api/test/item-1");
    });
  });

  test("variant throws when the edition is missing", () => {
    expect(() => variant(mockApiResponse, "5e")).toThrow("item-1 has no 5e variant");
  });
});
