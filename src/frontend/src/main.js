import Vue from "vue";
import App from "./App.vue";

import { BootstrapVue } from "bootstrap-vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import VueGtag from "vue-gtag";
import VueKofi from "vue-kofi";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { router } from "./router";
import { store } from "./store";

import "./vee-validate";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(VueReCaptcha, { siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY });
Vue.use(
  VueGtag,
  {
    config: {
      id: process.env.VUE_APP_ANALYTICS_ID,
      params: {
        send_page_view: false,
      },
    },
  },
  router
);
Vue.use(VueKofi);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
