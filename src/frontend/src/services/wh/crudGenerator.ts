import { AxiosInstance, AxiosResponse } from "axios";
import { Wh } from "./common.ts";

export function getElementFunc<WhApi extends Wh, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertApiToModelData: (whApi: WhApi) => WhModel,
) {
  return async (id: string) => {
    const serverResp = await axiosInstance.get(`${apiBasePath}/${id}`);
    return convertApiToModelData((serverResp as AxiosResponse<{ data: WhApi }, any>).data.data);
  };
}

export function listElementsFunc<WhApi extends Wh, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertApiToModelData: (whApi: WhApi) => WhModel,
) {
  return async () => {
    const serverResp = await axiosInstance.get(`${apiBasePath}`);

    return (serverResp as AxiosResponse<{ data: WhApi[] }, any>).data.data.map(convertApiToModelData);
  };
}

export function createElementFunc<WhApi extends Wh, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApi,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.post(`${apiBasePath}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: WhApi }, any>).data.data;
  };
}

export function updateElementFunc<WhApi extends Wh, WhModel extends Wh>(
  apiBasePath: string,
  axiosInstance: AxiosInstance,
  convertModelToApiData: (wh: WhModel) => WhApi,
) {
  return async (wh: WhModel) => {
    const serverResp = await axiosInstance.put(`${apiBasePath}/${wh.id}`, convertModelToApiData(wh));
    return (serverResp as AxiosResponse<{ data: WhApi }, any>).data.data;
  };
}

export function deleteElementFunc(apiBasePath: string, axiosInstance: AxiosInstance) {
  return async (id) => {
    await axiosInstance.delete(`${apiBasePath}/${id}`);
  };
}
