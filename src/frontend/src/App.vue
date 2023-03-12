<template>
  <div id="app">
    <header class="navigation">
      <NavBar />
    </header>
    <div class="content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <footer class="border-top footer">
      <b-container>
        <div class="text-center mt-2">
          <p>
            Contact:
            <a href="mailto:admin@hammergen.net">admin@hammergen.net</a>
          </p>
        </div>
      </b-container>
    </footer>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import NavHelpers from "./components/NavHelpers.vue";

export default {
  name: "app",
  components: { NavBar },
  mixins: [NavHelpers],
  created() {
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
