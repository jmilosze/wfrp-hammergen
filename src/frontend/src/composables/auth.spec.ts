import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { canEdit, resetAuthState, setupAuthInterceptor, UnauthorizedError, useAuth, useRelogin } from "./auth.ts";
import { anonRequest, authRequest } from "@/services/auth.ts";
import { flushPromises } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { createApp } from "vue";

// An empty in-memory localStorage for each test.
function stubLocalStorage() {
  const storage: Record<string, string> = {};
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
}

describe("canEdit permission check", () => {
  beforeEach(() => {
    stubLocalStorage();
  });

  test("returns false when user is not logged in", () => {
    expect(canEdit("user123")).toBe(false);
    expect(canEdit(undefined)).toBe(false);
  });

  test("returns true when user is the owner", () => {
    localStorage.setItem("userId", "user123");
    expect(canEdit("user123")).toBe(true);
  });

  test("returns false when user is not the owner", () => {
    localStorage.setItem("userId", "user456");
    expect(canEdit("otherUser")).toBe(false);
  });

  test("returns false when admin is not the owner", () => {
    localStorage.setItem("userId", "admin123");
    localStorage.setItem("admin", "true");
    expect(canEdit("otherUser")).toBe(false);
  });
});

describe("Auth interceptor and state reset", () => {
  let interceptorId: number;
  let originalAdapter: typeof authRequest.defaults.adapter;
  let originalAnonAdapter: typeof anonRequest.defaults.adapter;

  beforeEach(async () => {
    stubLocalStorage();

    originalAdapter = authRequest.defaults.adapter;
    originalAnonAdapter = anonRequest.defaults.adapter;
  });

  afterEach(() => {
    if (interceptorId !== undefined) {
      authRequest.interceptors.response.eject(interceptorId);
    }
    authRequest.defaults.adapter = originalAdapter;
    anonRequest.defaults.adapter = originalAnonAdapter;
    resetAuthState();
  });

  function unauthorized(config: InternalAxiosRequestConfig): AxiosError {
    const response: AxiosResponse = { status: 401, statusText: "Unauthorized", headers: {}, config, data: {} };
    return new AxiosError("Unauthorized", AxiosError.ERR_BAD_RESPONSE, config, null, response);
  }

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

  test("401 response of a logged-in user waits for the login dialog; logging out redirects to login", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");

    const { app, router } = createTestApp();
    await router.push({ name: "characters" });
    interceptorId = setupAuthInterceptor(router);

    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      throw unauthorized(config);
    };

    const auth = app.runWithContext(() => useAuth());
    const relogin = useRelogin();
    const request = authRequest.get("/api/protected");
    await flushPromises();

    expect(relogin.username.value).toBe("testuser");
    expect(auth.loggedIn.value).toBe(true);
    expect(router.currentRoute.value.name).toBe("characters");

    relogin.cancel();
    await expect(request).rejects.toThrow(UnauthorizedError);

    expect(relogin.username.value).toBeNull();
    expect(auth.loggedIn.value).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(router.currentRoute.value.name).toBe("login");
    expect(router.currentRoute.value.query.redirect).toBe("/characters");
  });

  test("401 responses are sent again with the new token after logging in through the dialog", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("username", "testuser");

    const { router } = createTestApp();
    await router.push({ name: "characters" });
    interceptorId = setupAuthInterceptor(router);

    const newToken = `header.${btoa(JSON.stringify({ sub: "id123", adm: false }))}.signature`;
    anonRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => ({
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: { accessToken: newToken },
    });
    authRequest.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
      if (config.headers.Authorization !== `Bearer ${newToken}`) {
        throw unauthorized(config);
      }
      return { status: 200, statusText: "OK", headers: {}, config, data: { url: config.url } };
    };

    const relogin = useRelogin();
    const first = authRequest.get("/api/first");
    const second = authRequest.get("/api/second");
    await flushPromises();

    expect(relogin.username.value).toBe("testuser");
    await relogin.login("testuser", "password");

    expect((await first).data.url).toBe("/api/first");
    expect((await second).data.url).toBe("/api/second");
    expect(relogin.username.value).toBeNull();
    expect(localStorage.getItem("accessToken")).toBe(newToken);
    expect(localStorage.getItem("userId")).toBe("id123");
    expect(router.currentRoute.value.name).toBe("characters");
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
