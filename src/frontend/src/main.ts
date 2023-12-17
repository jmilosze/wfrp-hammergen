import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { VueReCaptcha } from "vue-recaptcha-v3";

const app = createApp(App).use(router);

VueReCaptcha.install(app, {
  siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  loaderOptions: {
    autoHideBadge: true,
  },
});

app.mount("#app");
