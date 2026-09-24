import App from "./App.vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { createApp } from "vue";
import router from "./router";
import { setupAuthInterceptor } from "./composables/auth.ts";
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

const app = createApp(App);

app.use(router);
setupAuthInterceptor(router);

VueReCaptcha.install(app, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
});

app.mount("#app");
