import { defineStore } from "pinia";
import { ref } from "vue";
import { loginUser, logoutUser, isUserLoggedIn } from "../services/auth";

export const useAuthStore = defineStore("auth", () => {
  const loggedIn = ref(isUserLoggedIn());

  async function login(username, password) {
    await loginUser(username, password);
    loggedIn.value = true;
  }

  async function logout() {
    await logoutUser();
    loggedIn.value = false;
  }

  return { loggedIn, login, logout };
});
