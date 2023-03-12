<template>
  <div class="nav-helpers"></div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { authRequest } from "../services/auth";
import { mapStores } from "pinia";

export default {
  name: "NavHelpers",
  computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    callAndLogoutIfUnauthorized(apiCall, redirectTo = "login") {
      return async function () {
        try {
          return await apiCall.apply(this, arguments);
        } catch (e) {
          if (e.response?.status === 401) {
            await this.authStore.logout();
            if (this.$router.currentRoute.name !== redirectTo) {
              await this.$router.push({ name: redirectTo });
            }
          } else {
            throw e;
          }
        }
      };
    },
    async logoutIfAuthExpired() {
      if (this.authStore.loggedIn) {
        await this.callAndLogoutIfUnauthorized(authRequest.get, "home")("/api/user");
      }
    },
    async logout() {
      await this.authStore.logout();
      if (this.$router.currentRoute.name !== "home") {
        await this.$router.push({ name: "home" });
      }
    },
    async login(username, password) {
      await this.authStore.login(username, password);
      if (this.$router.currentRoute.name !== "home") {
        await this.$router.push({ name: "home" });
      }
    },
  },
};
</script>

<style scoped></style>
