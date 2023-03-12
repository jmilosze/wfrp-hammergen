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
    callAndLogoutIfUnauthorized(apiCall) {
      return async (path) => {
        try {
          return await apiCall(path);
        } catch (e) {
          if (e.response?.status === 401) {
            await this.authStore.logout();
            if (this.$router.currentRoute.name !== "login") {
              await this.$router.push({ name: "login" });
            }
          } else {
            throw e;
          }
        }
      };
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
