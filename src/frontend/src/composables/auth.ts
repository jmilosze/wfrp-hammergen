import { authRequest, getUserInfo, isUserAdmin, isUserLoggedIn, loginUser, logoutUser, setUserInfo } from "../services/auth.ts";
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

export function setupAuthInterceptor(router: Router): number {
  let redirecting = false;

  return authRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (isAxiosError(error) && error.response?.status === 401) {
        resetAuthState();

        const skipRedirect = error.config?.skipAuthRedirect === true;
        if (!skipRedirect && !redirecting && router.currentRoute.value.name !== "login") {
          redirecting = true;
          try {
            await router.push({ name: "login" });
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

    if (router.currentRoute.value.name !== "home") {
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
