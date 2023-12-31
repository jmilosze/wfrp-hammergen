import { AxiosInstance, AxiosResponse } from "axios";
import { Wh, WhApiResponse } from "./common.ts";

export function getElementFunc<WhApi, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  apiResponseToModel: (whApiResp: WhApiResponse<WhApi>) => WhModel,
) {
  return async (id: string) => {
    const serverResp = await axiosInstance.get(`${apiBasePath}/${id}`);
    return apiResponseToModel((serverResp as AxiosResponse<{ data: WhApiResponse<WhApi> }, any>).data.data);
  };
}

export function listElementsFunc<WhApi, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  apiResponseToModel: (whApiResp: WhApiResponse<WhApi>) => WhModel,
) {
  return async () => {
    const serverResp = await axiosInstance.get(`${apiBasePath}`);

    return (serverResp as AxiosResponse<{ data: WhApiResponse<WhApi>[] }, any>).data.data.map(apiResponseToModel);
  };
}

export function createElementFunc<WhApi, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApi,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.post(`${apiBasePath}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: WhApiResponse<WhApi> }, any>).data.data;
  };
}

export function updateElementFunc<WhApi, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApi,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.put(`${apiBasePath}/${wh.id}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: WhApiResponse<WhApi> }, any>).data.data;
  };
}

export function deleteElementFunc(apiBasePath: string, axiosInstance: AxiosInstance) {
  return async (id: string) => {
    await axiosInstance.delete(`${apiBasePath}/${id}`);
  };
}
