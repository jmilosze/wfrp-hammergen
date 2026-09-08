import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { getUserInfo, isUserAdmin, logoutUser } from "../services/auth.ts";
import { canEdit } from "../composables/auth.ts";

describe("Auth admin detection", () => {
  const storage: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(storage)) {
      delete storage[key];
    }
    (globalThis as any).localStorage = {
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
  });

  afterEach(() => {
    logoutUser();
  });

  test("returns false when no token or admin flag exists", () => {
    expect(isUserAdmin()).toBe(false);
    expect(getUserInfo().admin).toBe(false);
  });

  test("returns true when admin flag in localStorage is true", () => {
    localStorage.setItem("admin", "true");
    expect(isUserAdmin()).toBe(true);
    expect(getUserInfo().admin).toBe(true);
  });

  test("returns false when admin flag in localStorage is false", () => {
    localStorage.setItem("admin", "false");
    expect(isUserAdmin()).toBe(false);
    expect(getUserInfo().admin).toBe(false);
  });

  test("extracts adm from JWT token if admin key missing in localStorage", () => {
    // header: {"alg":"HS256","typ":"JWT"}
    // payload: {"sub":"user123","adm":true}
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiYWRtIjp0cnVlfQ.signature";
    localStorage.setItem("accessToken", token);
    expect(isUserAdmin()).toBe(true);
    expect(getUserInfo().admin).toBe(true);
  });

  test("extracts adm: false from JWT token if admin key missing in localStorage", () => {
    // payload: {"sub":"user123","adm":false}
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiYWRtIjpmYWxzZX0.signature";
    localStorage.setItem("accessToken", token);
    expect(isUserAdmin()).toBe(false);
    expect(getUserInfo().admin).toBe(false);
  });
});

describe("canEdit permission check", () => {
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

