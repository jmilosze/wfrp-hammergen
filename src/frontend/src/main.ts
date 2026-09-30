import App from "./App.vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { createApp } from "vue";
import router from "./router";
import { setupAuthInterceptor } from "./composables/auth.ts";
import { checkMaintenance, setupMaintenanceInterceptor } from "./composables/maintenance.ts";
import { anonRequest, authRequest } from "./services/auth.ts";
window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

const app = createApp(App);

app.use(router);
setupAuthInterceptor(router);
setupMaintenanceInterceptor(anonRequest);
setupMaintenanceInterceptor(authRequest);

VueReCaptcha.install(app, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
});

app.mount("#app");

checkMaintenance(anonRequest).catch((error) => {
  console.error("Failed to check maintenance status:", error);
});
