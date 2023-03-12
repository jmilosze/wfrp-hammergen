import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueGtag from "vue-gtag";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { router } from "./router";
import { createPinia, PiniaVuePlugin } from "pinia";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY });
Vue.use(
  VueGtag,
  {
    config: {
      id: import.meta.env.VITE_ANALYTICS_ID,
      params: {
        send_page_view: false,
      },
    },
  },
  router
);
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
