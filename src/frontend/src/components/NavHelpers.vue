<script>
import { useAuthStore } from "../stores/auth";
import { mapStores } from "pinia";

export default {
  name: "NavHelpers",
  computed: {
    ...mapStores(useAuthStore),
  },
  methods: {
    callAndLogoutIfUnauthorized(apiCall) {
      return this.authStore.callAndLogoutIfUnauthorized(apiCall);
    },
    async logout() {
      return this.authStore.logout();
    },
    async login(username, password) {
      return this.authStore.login(username, password);
    },
  },
};
</script>
