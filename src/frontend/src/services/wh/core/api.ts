import { AxiosInstance } from "axios";
import { Visibility } from "./entity.ts";
import { Edition, EDITIONS, Variants } from "./edition.ts";

export interface ApiHeaders {
  id: string;
  ownerId: string;
  visibility?: Visibility;
}

// Content document as returned by the API: one variant per edition.
export interface ApiResponse<WhApiData> extends ApiHeaders {
  editions: Partial<Record<Edition, WhApiData>>;
}

// Character as returned by the API; its fixed edition is part of the character data.
export interface CharacterApiResponse<CharacterData> extends ApiHeaders {
  object: CharacterData;
}

// Content document as sent to the API; variants not included are left unchanged on update.
export interface ContentRequest<WhApiData> {
  visibility: Visibility;
  editions: Partial<Record<Edition, WhApiData>>;
}

// API of a content type: lists one edition, reads and writes whole documents (all variants).
export interface ContentApi<T> {
  listElements: (edition: Edition) => Promise<T[]>;
  getDocument: (id: string) => Promise<Variants<T>>;
  createDocument: (visibility: Visibility, variants: Variants<T>) => Promise<ApiHeaders>;
  updateDocument: (id: string, visibility: Visibility, variants: Variants<T>) => Promise<ApiHeaders>;
  // Deletes the whole document, all variants.
  deleteElement: (id: string) => Promise<void>;
}

// API of characters: one character, one edition.
export interface WhApi<T, TResponse extends ApiHeaders> {
  getElement: (id: string) => Promise<T>;
  listElements: (edition: Edition) => Promise<T[]>;
  createElement: (wh: T) => Promise<TResponse>;
  updateElement: (wh: T) => Promise<TResponse>;
  deleteElement: (id: string, edition: Edition) => Promise<void>;
}

export interface ServerEnvelope<T> {
  data: T;
}

export function createWhApi<TModel extends { id: string }, TResponse extends ApiHeaders, TRequest>(
  basePath: string,
  axios: AxiosInstance,
  toModel: (api: TResponse) => TModel,
  toRequest: (model: TModel) => TRequest,
): WhApi<TModel, TResponse> {
  return {
    getElement: async (id: string): Promise<TModel> => {
      const { data } = await axios.get<ServerEnvelope<TResponse>>(`${basePath}/${id}`);
      return toModel(data.data);
    },
    listElements: async (edition: Edition): Promise<TModel[]> => {
      const { data } = await axios.get<ServerEnvelope<TResponse[]>>(basePath, { params: { edition } });
      return data.data.map(toModel);
    },
    createElement: async (wh: TModel): Promise<TResponse> => {
      const { data } = await axios.post<ServerEnvelope<TResponse>>(basePath, toRequest(wh));
      return data.data;
    },
    updateElement: async (wh: TModel): Promise<TResponse> => {
      const { data } = await axios.put<ServerEnvelope<TResponse>>(`${basePath}/${wh.id}`, toRequest(wh));
      return data.data;
    },
    deleteElement: async (id: string, edition: Edition): Promise<void> => {
      await axios.delete(`${basePath}/${id}`, { params: { edition } });
    },
  };
}

// defineContentApi builds the API of a content type from its converters.
export function defineContentApi<TModel, TApiData>(
  basePath: string,
  toModel: (api: ApiResponse<TApiData>, edition: Edition) => TModel,
  toApi: (model: TModel) => TApiData,
) {
  const toRequest = (visibility: Visibility, variants: Variants<TModel>): ContentRequest<TApiData> => {
    const editions: Variants<TApiData> = {};
    for (const edition of EDITIONS) {
      const model = variants[edition];
      if (model !== undefined) {
        editions[edition] = toApi(model);
      }
    }
    return { visibility, editions };
  };

  return (axios: AxiosInstance): ContentApi<TModel> => ({
    listElements: async (edition: Edition): Promise<TModel[]> => {
      const { data } = await axios.get<ServerEnvelope<ApiResponse<TApiData>[]>>(basePath, { params: { edition } });
      return data.data.map((api) => toModel(api, edition));
    },
    getDocument: async (id: string): Promise<Variants<TModel>> => {
      const { data } = await axios.get<ServerEnvelope<ApiResponse<TApiData>>>(`${basePath}/${id}`);
      const variants: Variants<TModel> = {};
      for (const edition of EDITIONS) {
        if (data.data.editions[edition] !== undefined) {
          variants[edition] = toModel(data.data, edition);
        }
      }
      return variants;
    },
    createDocument: async (visibility: Visibility, variants: Variants<TModel>): Promise<ApiHeaders> => {
      const { data } = await axios.post<ServerEnvelope<ApiHeaders>>(basePath, toRequest(visibility, variants));
      return data.data;
    },
    updateDocument: async (id: string, visibility: Visibility, variants: Variants<TModel>): Promise<ApiHeaders> => {
      const { data } = await axios.put<ServerEnvelope<ApiHeaders>>(
        `${basePath}/${id}`,
        toRequest(visibility, variants),
      );
      return data.data;
    },
    deleteElement: async (id: string): Promise<void> => {
      await axios.delete(`${basePath}/${id}`);
    },
  });
}
