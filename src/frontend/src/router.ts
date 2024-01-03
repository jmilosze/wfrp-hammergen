import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/HomePage.vue";
import About from "./views/AboutHammergen.vue";
import Howto from "./views/HowTo.vue";
import Register from "./views/User/UserRegister.vue";
import Login from "./views/User/UserLogin.vue";
import ForgotPassword from "./views/User/UserForgotPassword.vue";
import ResetPassword from "./views/User/UserResetPassword.vue";
import Manage from "./views/User/UserManage.vue";
import LinkedUsers from "./views/User/UserLinkedUsers.vue";

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
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: ForgotPassword,
    },
    {
      path: "/resetpassword/:token",
      name: "resetpassword",
      component: ResetPassword,
      props: true,
    },
    {
      path: "/manage",
      name: "manage",
      component: Manage,
    },
    {
      path: "/linkedusers",
      name: "linkedusers",
      component: LinkedUsers,
    },
  ],
});
