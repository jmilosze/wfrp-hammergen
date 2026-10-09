import { afterEach, beforeEach, describe, expect, test } from "vitest";
import {
  checkMaintenance,
  MAINTENANCE_MESSAGE,
  resetMaintenanceState,
  setupMaintenanceInterceptor,
  STATUS_PATH,
  useMaintenance,
} from "./maintenance.ts";

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

function respondWith(instance: AxiosInstance, status: number, data: unknown): void {
  instance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const response: AxiosResponse = { status, statusText: "", headers: {}, config, data };
    if (status >= 400) {
      throw new AxiosError("error", AxiosError.ERR_BAD_RESPONSE, config, null, response);
    }
    return response;
  };
}

describe("Maintenance mode", () => {
  let instance: AxiosInstance;

  beforeEach(() => {
    instance = axios.create();
    resetMaintenanceState();
  });

  afterEach(() => {
    resetMaintenanceState();
  });

  test("maintenance 503 switches the app to maintenance and still rejects the request", async () => {
    setupMaintenanceInterceptor(instance);
    respondWith(instance, 503, { message: MAINTENANCE_MESSAGE, details: "" });

    await expect(instance.get("/api/wh/talent")).rejects.toBeInstanceOf(AxiosError);
    expect(useMaintenance().maintenance.value).toBe(true);
  });

  test("other 503 (e.g. request timeout) does not switch to maintenance", async () => {
    setupMaintenanceInterceptor(instance);
    respondWith(instance, 503, { message: "internal server timeout", details: "" });

    await expect(instance.get("/api/wh/talent")).rejects.toBeInstanceOf(AxiosError);
    expect(useMaintenance().maintenance.value).toBe(false);
  });

  test("other errors do not switch to maintenance", async () => {
    setupMaintenanceInterceptor(instance);
    respondWith(instance, 500, { message: "internal server error", details: "" });

    await expect(instance.get("/api/wh/talent")).rejects.toBeInstanceOf(AxiosError);
    expect(useMaintenance().maintenance.value).toBe(false);
  });

  test("checkMaintenance reads the status endpoint", async () => {
    let requestedUrl = "";
    instance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      requestedUrl = config.url ?? "";
      return { status: 200, statusText: "OK", headers: {}, config, data: { data: { maintenance: true } } };
    };

    await checkMaintenance(instance);
    expect(requestedUrl).toBe(STATUS_PATH);
    expect(useMaintenance().maintenance.value).toBe(true);

    respondWith(instance, 200, { data: { maintenance: false } });
    await checkMaintenance(instance);
    expect(useMaintenance().maintenance.value).toBe(false);
  });
});
