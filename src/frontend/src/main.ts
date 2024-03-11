import App from "./App.vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { createApp } from "vue";
import router from "./router";

const app = createApp(App);

app.use(router);

VueReCaptcha.install(app, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
});

app.mount("#app");
