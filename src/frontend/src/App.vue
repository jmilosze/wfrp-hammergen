<template>
  <div id="app">
    <header class="navigation">
      <NavBar />
    </header>
    <div class="content">
      <router-view :key="$route.fullPath"> </router-view>
    </div>
    <footer class="border-top footer">
      <b-container>
        <div class="text-center mt-2">
          <p>
            &copy; 2019 - 2021 Hammergen - Contact:
            <a href="mailto:admin@hammergen.net">admin@hammergen.net</a>
          </p>
        </div>
      </b-container>
    </footer>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import { authRequest } from "@/services/auth";
import { logoutIfUnauthorized } from "@/utils/navigation";

export default {
  name: "app",
  components: { NavBar },
  methods: {
    async logoutIfAuthExpired() {
      if (this.$store.state.auth.isLoggedIn) {
        try {
          await logoutIfUnauthorized(authRequest.get, "home")("/api/user");
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    },
  },
  created() {
    this.logoutIfAuthExpired();
    this.$recaptchaLoaded().then(() => {
      this.$recaptchaInstance.hideBadge();
    });
  },
};
</script>

<style>
html,
body {
  height: 100%;
}

html {
  font-size: 14px;
}

@media (min-width: 768px) {
  html {
    font-size: 16px;
  }
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.content {
  flex: 1 0 auto;
  padding: 20px;
}

.footer {
  flex-shrink: 0;
}

.navigation {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
