import { createRouter, createWebHistory } from "vue-router";
import AboutHammergen from "./views/AboutHammergen.vue";
import HomePage from "./views/HomePage.vue";
import HowTo from "./views/HowTo.vue";
import UserForgotPassword from "./views/User/UserForgotPassword.vue";
import UserLinkedUsers from "./views/User/UserLinkedUsers.vue";
import UserLogin from "./views/User/UserLogin.vue";
import UserManage from "./views/User/UserManage.vue";
import UserRegister from "./views/User/UserRegister.vue";
import UserResetPassword from "./views/User/UserResetPassword.vue";
import ListPrayers from "./views/Warhammer/ListPrayers.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/",
      name: "placeholder",
      component: HomePage,
    },
    {
      path: "/about",
      name: "about",
      component: AboutHammergen,
    },
    {
      path: "/howto",
      name: "howto",
      component: HowTo,
    },
    {
      path: "/register",
      name: "register",
      component: UserRegister,
    },
    {
      path: "/login",
      name: "login",
      component: UserLogin,
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: UserForgotPassword,
    },
    {
      path: "/resetpassword/:token",
      name: "resetpassword",
      component: UserResetPassword,
      props: true,
    },
    {
      path: "/manage",
      name: "manage",
      component: UserManage,
    },
    {
      path: "/linkedusers",
      name: "linkedusers",
      component: UserLinkedUsers,
    },
    {
      path: "/prayers",
      name: "prayers",
      component: ListPrayers,
    },
  ],
});
