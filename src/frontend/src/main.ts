import App from "./App.vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { createApp } from "vue";
import router from "./router";
import VueGtag from "vue-gtag";

const app = createApp(App);

app.use(router);

app.use(VueGtag, {
  bootstrap: false,
  config: {
    id: import.meta.env.VITE_ANALYTICS_ID,
  },
});

VueReCaptcha.install(app, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
});

app.mount("#app");
