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
import ListPrayers from "./views/Warhammer/List/ListPrayers.vue";
import CreatePrayer from "./views/Warhammer/Edit/CreatePrayer.vue";
import ListSpells from "./views/Warhammer/List/ListSpells.vue";
import CreateSpell from "./views/Warhammer/Edit/CreateSpell.vue";
import CreateTalent from "./views/Warhammer/Edit/CreateTalent.vue";
import ListTalents from "./views/Warhammer/List/ListTalents.vue";
import CreateMutation from "./views/Warhammer/Edit/CreateMutation.vue";
import ListMutations from "./views/Warhammer/List/ListMutations.vue";
import CreateProperty from "./views/Warhammer/Edit/CreateProperty.vue";
import ListProperties from "./views/Warhammer/List/ListProperties.vue";

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
    {
      path: "/prayer/:id",
      name: "prayer",
      component: CreatePrayer,
      props: true,
    },
    {
      path: "/spells",
      name: "spells",
      component: ListSpells,
    },
    {
      path: "/spell/:id",
      name: "spell",
      component: CreateSpell,
      props: true,
    },
    {
      path: "/talents",
      name: "talents",
      component: ListTalents,
    },
    {
      path: "/talent/:id",
      name: "talent",
      component: CreateTalent,
      props: true,
    },
    {
      path: "/mutations",
      name: "mutations",
      component: ListMutations,
    },
    {
      path: "/mutation/:id",
      name: "mutation",
      component: CreateMutation,
      props: true,
    },
    {
      path: "/properties",
      name: "properties",
      component: ListProperties,
    },
    {
      path: "/property/:id",
      name: "property",
      component: CreateProperty,
      props: true,
    },
  ],
});
