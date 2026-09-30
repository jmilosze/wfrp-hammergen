import { AxiosInstance } from "axios";
import { ApiHeaders, ApiResponse, ContentRequest, Edition, UI_EDITION, Visibility, WhApi } from "./common.ts";

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

// defineWhApi builds the API of a content type; the model is sent as the UI edition's variant.
export function defineWhApi<TModel extends { id: string; visibility: Visibility }, TApiData>(
  basePath: string,
  toModel: (api: ApiResponse<TApiData>) => TModel,
  toApi: (model: TModel) => TApiData,
) {
  const toRequest = (model: TModel): ContentRequest<TApiData> => ({
    visibility: model.visibility,
    editions: { [UI_EDITION]: toApi(model) },
  });
  return (axios: AxiosInstance): WhApi<TModel, ApiResponse<TApiData>> =>
    createWhApi(basePath, axios, toModel, toRequest);
}
