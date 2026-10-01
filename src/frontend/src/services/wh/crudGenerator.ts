import { AxiosInstance } from "axios";
import {
  ApiHeaders,
  ApiResponse,
  ContentApi,
  ContentRequest,
  Edition,
  EDITIONS,
  Variants,
  Visibility,
  WhApi,
} from "./common.ts";

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
    getElement: async (id: string, edition: Edition): Promise<TModel> => {
      const { data } = await axios.get<ServerEnvelope<TResponse>>(`${basePath}/${id}`, { params: { edition } });
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
