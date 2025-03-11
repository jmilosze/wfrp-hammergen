import { getUserInfo, isUserLoggedIn, loginUser, logoutUser, setUserInfo } from "../services/auth.ts";
import { isAxiosError } from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.name = "Unauthorized";
  }
}

const loggedIn = ref(isUserLoggedIn());

export function useAuth() {
  const router = useRouter();
  function callAndLogoutIfUnauthorized<T>(
    apiCall: (...args: any[]) => Promise<T>,
    redirectToLogin = true,
  ): (...args: any[]) => Promise<T> {
    return async (...args: any[]) => {
      try {
        return await apiCall(...args);
      } catch (error: any) {
        if (isAxiosError(error) && error.response && error.response?.status === 401) {
          logoutUser();
          loggedIn.value = false;

          if (redirectToLogin && router.currentRoute.value.name !== "login") {
            await router.push({ name: "login" });
          }
          throw new UnauthorizedError();
        } else {
          throw error;
        }
      }
    };
  }

  async function logout(): Promise<void> {
    logoutUser();
    loggedIn.value = false;

    if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  async function login(username: string, password: string): Promise<void> {
    await loginUser(username, password);
    loggedIn.value = true;

    if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  function getLoggedUserInfo(): { username: string; userId: string } {
    return getUserInfo();
  }

  function setLoggedUserInfo(username: string): void {
    return setUserInfo(username);
  }

  return { loggedIn, login, logout, callAndLogoutIfUnauthorized, getLoggedUserInfo, setLoggedUserInfo };
}
