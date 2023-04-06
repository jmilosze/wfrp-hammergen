import { defineStore } from "pinia";
import { useRouter } from "vue-router/composables";
import { ref } from "vue";
import { loginUser, logoutUser, isUserLoggedIn } from "../services/auth";

export const useAuthStore = defineStore("auth", () => {
  const loggedIn = ref(isUserLoggedIn());
  const router = useRouter();

  function callAndLogoutIfUnauthorized(apiCall) {
    return async (...args) => {
      try {
        return await apiCall(...args);
      } catch (e) {
        if (e.response?.status === 401) {
          await logoutUser();
          loggedIn.value = false;

          if (router.currentRoute.name !== "login") {
            await router.push({ name: "login" });
          }
        } else {
          throw e;
        }
      }
    };
  }

  async function logout() {
    await logoutUser();
    loggedIn.value = false;

    if (router.currentRoute.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  async function login(username, password) {
    await loginUser(username, password);
    loggedIn.value = true;

    if (router.currentRoute.name !== "home") {
      await router.push({ name: "home" });
    }
  }

  return { loggedIn, login, logout, callAndLogoutIfUnauthorized };
});
