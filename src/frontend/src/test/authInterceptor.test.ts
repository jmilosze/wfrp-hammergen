import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { authRequest } from "../services/auth.ts";
import { resetAuthState, setupAuthInterceptor, UnauthorizedError, useAuth } from "../composables/auth.ts";
import { createMemoryHistory, createRouter } from "vue-router";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { createApp } from "vue";

describe("Auth interceptor and state reset", () => {
  const storage: Record<string, string> = {};
  let interceptorId: number;
  let originalAdapter: typeof authRequest.defaults.adapter;

  beforeEach(async () => {
    for (const key of Object.keys(storage)) {
      delete storage[key];
    }
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, val: string) => {
        storage[key] = val;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        for (const key of Object.keys(storage)) {
          delete storage[key];
        }
      },
    };

    originalAdapter = authRequest.defaults.adapter;
  });

  afterEach(() => {
    if (interceptorId !== undefined) {
      authRequest.interceptors.response.eject(interceptorId);
    }
    authRequest.defaults.adapter = originalAdapter;
    resetAuthState();
  });

  function createTestApp() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", name: "home", component: { template: "<div>home</div>" } },
        { path: "/login", name: "login", component: { template: "<div>login</div>" } },
        { path: "/characters", name: "characters", component: { template: "<div>characters</div>" } },
      ],
    });
    const app = createApp({ template: "<div></div>" });
    app.use(router);
    return { app, router };
  }

  test("resetAuthState clears localStorage and reactive auth state", () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");
    localStorage.setItem("userId", "id123");
    localStorage.setItem("admin", "true");

    const { app } = createTestApp();
    const auth = app.runWithContext(() => useAuth());
    expect(auth.loggedIn.value).toBe(true);
    expect(auth.isAdmin.value).toBe(true);

    resetAuthState();

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("username")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
    expect(localStorage.getItem("admin")).toBeNull();
    expect(auth.loggedIn.value).toBe(false);
    expect(auth.isAdmin.value).toBe(false);
  });

  test("401 response resets auth state, redirects to login, and rejects with UnauthorizedError", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");

    const { app, router } = createTestApp();
    await router.push({ name: "characters" });
    interceptorId = setupAuthInterceptor(router);

    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const response: AxiosResponse = {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { message: "Session expired" },
      };
      throw new AxiosError("Unauthorized", AxiosError.ERR_BAD_RESPONSE, config, null, response);
    };

    const auth = app.runWithContext(() => useAuth());
    await expect(authRequest.get("/api/protected")).rejects.toThrow(UnauthorizedError);

    expect(auth.loggedIn.value).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(router.currentRoute.value.name).toBe("login");
  });

  test("401 response with skipAuthRedirect does not redirect to login", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");

    const { app, router } = createTestApp();
    await router.push({ name: "characters" });
    interceptorId = setupAuthInterceptor(router);

    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const response: AxiosResponse = {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: { message: "Session expired" },
      };
      throw new AxiosError("Unauthorized", AxiosError.ERR_BAD_RESPONSE, config, null, response);
    };

    const auth = app.runWithContext(() => useAuth());
    await expect(authRequest.get("/api/user", { skipAuthRedirect: true })).rejects.toThrow(UnauthorizedError);

    expect(auth.loggedIn.value).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
    // Route stays on characters, NOT redirected to login
    expect(router.currentRoute.value.name).toBe("characters");
  });

  test("401 response when already on login does not push navigation", async () => {
    const { router } = createTestApp();
    await router.push({ name: "login" });
    interceptorId = setupAuthInterceptor(router);

    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const response: AxiosResponse = {
        status: 401,
        statusText: "Unauthorized",
        headers: {},
        config,
        data: {},
      };
      throw new AxiosError("Unauthorized", AxiosError.ERR_BAD_RESPONSE, config, null, response);
    };

    await expect(authRequest.get("/api/test")).rejects.toThrow(UnauthorizedError);
    expect(router.currentRoute.value.name).toBe("login");
  });

  test("non-401 error is passed through and does not reset auth state", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");

    const { app, router } = createTestApp();
    await router.push({ name: "home" });
    interceptorId = setupAuthInterceptor(router);

    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      const response: AxiosResponse = {
        status: 500,
        statusText: "Server Error",
        headers: {},
        config,
        data: { message: "Internal server error" },
      };
      throw new AxiosError("Server Error", AxiosError.ERR_BAD_RESPONSE, config, null, response);
    };

    const auth = app.runWithContext(() => useAuth());
    await expect(authRequest.get("/api/server-error")).rejects.toThrow("Server Error");

    expect(auth.loggedIn.value).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("token123");
    expect(router.currentRoute.value.name).toBe("home");
  });
});
