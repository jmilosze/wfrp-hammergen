import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Howto from "./views/Howto.vue";
import Register from "./views/user/Register.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/",
      name: "placeholder",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/howto",
      name: "howto",
      component: Howto,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
  ],
});
