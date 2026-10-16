import {
  authRequest,
  getUserInfo,
  isUserAdmin,
  isUserLoggedIn,
  loginUser,
  logoutUser,
  setUserInfo,
} from "@/services/auth.ts";
import { isAxiosError } from "axios";
import { ref } from "vue";
import { type Router, useRouter } from "vue-router";

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.name = "Unauthorized";
  }
}

const loggedIn = ref(isUserLoggedIn());
const isAdmin = ref(isUserAdmin());

export function resetAuthState(): void {
  logoutUser();
  loggedIn.value = false;
  isAdmin.value = false;
}

export function getSafeRedirectTarget(redirect: unknown): string | null {
  if (
    typeof redirect === "string" &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.startsWith("/\\")
  ) {
    return redirect;
  }
  return null;
}

// The login dialog for an expired session (SessionLoginDialog): open while reloginUsername is set. Requests that got a
// 401 wait for it and are sent again after the login, so a page keeps what was typed into it (e.g. unsaved edits).
const reloginUsername = ref<string | null>(null);
let reloginWaiting: ((loggedIn: boolean) => void)[] = [];

function waitForRelogin(username: string): Promise<boolean> {
  reloginUsername.value = username;
  return new Promise((resolve) => reloginWaiting.push(resolve));
}

function finishRelogin(loggedIn: boolean): void {
  reloginUsername.value = null;
  const waiting = reloginWaiting;
  reloginWaiting = [];
  for (const resolve of waiting) {
    resolve(loggedIn);
  }
}

export function useRelogin() {
  async function login(username: string, password: string): Promise<void> {
    await loginUser(username, password);
    loggedIn.value = true;
    isAdmin.value = isUserAdmin();
    finishRelogin(true);
  }

  function cancel(): void {
    finishRelogin(false);
  }

  return { username: reloginUsername, login, cancel };
}

export function setupAuthInterceptor(router: Router): number {
  let redirecting = false;

  return authRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        // skipAuthRedirect: the request only checks the session, so an expired one is dropped without asking.
        const username = getUserInfo().username;
        if (error.config && error.config.skipAuthRedirect !== true && username !== "") {
          if (await waitForRelogin(username)) {
            return authRequest.request(error.config);
          }
        }

        resetAuthState();

        const skipRedirect = error.config?.skipAuthRedirect === true;
        if (!skipRedirect && !redirecting && router.currentRoute.value.name !== "login") {
          redirecting = true;
          try {
            await router.push({
              name: "login",
              query: { redirect: router.currentRoute.value.fullPath },
            });
          } finally {
            redirecting = false;
          }
        }

        return Promise.reject(new UnauthorizedError());
      }
      return Promise.reject(error);
    },
  );
}

export function useAuth() {
  loggedIn.value = isUserLoggedIn();
  isAdmin.value = isUserAdmin();

  const router = useRouter();

  async function logout(): Promise<void> {
    resetAuthState();

    if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  async function login(username: string, password: string): Promise<void> {
    await loginUser(username, password);
    loggedIn.value = true;
    isAdmin.value = isUserAdmin();

    const redirect = router.currentRoute.value.query.redirect;
    const safeTarget = getSafeRedirectTarget(redirect);

    if (safeTarget !== null) {
      await router.push(safeTarget);
    } else if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  function getLoggedUserInfo(): { username: string; userId: string; admin: boolean } {
    return getUserInfo();
  }

  function setLoggedUserInfo(username: string): void {
    return setUserInfo(username);
  }

  return { loggedIn, isAdmin, login, logout, getLoggedUserInfo, setLoggedUserInfo, canEdit };
}

export function canEdit(ownerId?: string): boolean {
  const userId = getUserInfo().userId;
  return !!userId && ownerId === userId;
}
