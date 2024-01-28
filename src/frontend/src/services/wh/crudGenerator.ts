import { AxiosInstance, AxiosResponse } from "axios";
import { ApiResponse, WhProperty } from "./common.ts";

export function getElementFunc<WhApiData, WhModel extends WhProperty>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  apiResponseToModel: (whApiResp: ApiResponse<WhApiData>) => WhModel,
  apiSuffix: string = "",
) {
  return async (id: string) => {
    const serverResp = await axiosInstance.get(`${apiBasePath}/${id}${apiSuffix}`);
    return apiResponseToModel((serverResp as AxiosResponse<{ data: ApiResponse<WhApiData> }, any>).data.data);
  };
}

export function listElementsFunc<WhApiData, WhModel extends WhProperty>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  apiResponseToModel: (whApiResp: ApiResponse<WhApiData>) => WhModel,
) {
  return async () => {
    const serverResp = await axiosInstance.get(`${apiBasePath}`);

    return (serverResp as AxiosResponse<{ data: ApiResponse<WhApiData>[] }, any>).data.data.map(apiResponseToModel);
  };
}

export function createElementFunc<WhApiData, WhModel extends WhProperty>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApiData,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.post(`${apiBasePath}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: ApiResponse<WhApiData> }, any>).data.data;
  };
}

export function updateElementFunc<WhApiData, WhModel extends WhProperty>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApiData,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.put(`${apiBasePath}/${wh.id}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: ApiResponse<WhApiData> }, any>).data.data;
  };
}

export function deleteElementFunc(apiBasePath: string, axiosInstance: AxiosInstance) {
  return async (id: string) => {
    await axiosInstance.delete(`${apiBasePath}/${id}`);
  };
}
