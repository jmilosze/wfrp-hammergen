import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { isUserLoggedIn, loginUser, logoutUser, getUserInfo, setUserInfo } from "../services/auth";
import { isAxiosError } from "axios";

export const useAuthStore = defineStore("auth", () => {
  const loggedIn = ref(isUserLoggedIn());
  const router = useRouter();

  function callAndLogoutIfUnauthorized(apiCall: (...args: any[]) => Promise<any>, redirectToLogin = true) {
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
        } else {
          throw error;
        }
      }
    };
  }

  async function logout() {
    logoutUser();
    loggedIn.value = false;

    if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  async function login(username: string, password: string) {
    await loginUser(username, password);
    loggedIn.value = true;

    if (router.currentRoute.value.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  function getLoggedUserInfo() {
    return getUserInfo();
  }

  function setLoggedUserInfo(username: string) {
    return setUserInfo(username);
  }

  return { loggedIn, login, logout, callAndLogoutIfUnauthorized, getLoggedUserInfo, setLoggedUserInfo };
});
