import { AxiosInstance } from "axios";
import { ApiResponse, WhApi } from "./common.ts";

export interface ServerEnvelope<T> {
  data: T;
}

export function createWhApi<TModel extends { id: string }, TApiData>(
  basePath: string,
  axios: AxiosInstance,
  toModel: (api: ApiResponse<TApiData>) => TModel,
  toApi: (model: TModel) => TApiData,
): WhApi<TModel, TApiData> {
  return {
    getElement: async (id: string): Promise<TModel> => {
      const { data } = await axios.get<ServerEnvelope<ApiResponse<TApiData>>>(`${basePath}/${id}`);
      return toModel(data.data);
    },
    listElements: async (): Promise<TModel[]> => {
      const { data } = await axios.get<ServerEnvelope<ApiResponse<TApiData>[]>>(basePath);
      return data.data.map(toModel);
    },
    createElement: async (wh: TModel): Promise<ApiResponse<TApiData>> => {
      const { data } = await axios.post<ServerEnvelope<ApiResponse<TApiData>>>(basePath, toApi(wh));
      return data.data;
    },
    updateElement: async (wh: TModel): Promise<ApiResponse<TApiData>> => {
      const { data } = await axios.put<ServerEnvelope<ApiResponse<TApiData>>>(`${basePath}/${wh.id}`, toApi(wh));
      return data.data;
    },
    deleteElement: async (id: string): Promise<void> => {
      await axios.delete(`${basePath}/${id}`);
    },
  };
}

export function defineWhApi<TModel extends { id: string }, TApiData>(
  basePath: string,
  toModel: (api: ApiResponse<TApiData>) => TModel,
  toApi: (model: TModel) => TApiData,
) {
  return (axios: AxiosInstance): WhApi<TModel, TApiData> => createWhApi(basePath, axios, toModel, toApi);
}
