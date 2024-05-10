import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";

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
      component: () => import("./views/AboutHammergen.vue"),
    },
    {
      path: "/howto",
      name: "howto",
      component: () => import("./views/HowTo.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/User/UserRegister.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/User/UserLogin.vue"),
    },
    {
      path: "/forgotpassword",
      name: "forgotpassword",
      component: () => import("./views/User/UserForgotPassword.vue"),
    },
    {
      path: "/resetpassword/:token",
      name: "resetpassword",
      component: () => import("./views/User/UserResetPassword.vue"),
      props: true,
    },
    {
      path: "/manage",
      name: "manage",
      component: () => import("./views/User/UserManage.vue"),
    },
    {
      path: "/linkedusers",
      name: "linkedusers",
      component: () => import("./views/User/UserLinkedUsers.vue"),
    },
    {
      path: "/prayers",
      name: "prayers",
      component: () => import("./views/Warhammer/List/ListPrayers.vue"),
    },
    {
      path: "/prayer/:id",
      name: "prayer",
      component: () => import("./views/Warhammer/Edit/CreatePrayer.vue"),
      props: true,
    },
    {
      path: "/spells",
      name: "spells",
      component: () => import("./views/Warhammer/List/ListSpells.vue"),
    },
    {
      path: "/spell/:id",
      name: "spell",
      component: () => import("./views/Warhammer/Edit/CreateSpell.vue"),
      props: true,
    },
    {
      path: "/talents",
      name: "talents",
      component: () => import("./views/Warhammer/List/ListTalents.vue"),
    },
    {
      path: "/talent/:id",
      name: "talent",
      component: () => import("./views/Warhammer/Edit/CreateTalent.vue"),
      props: true,
    },
    {
      path: "/mutations",
      name: "mutations",
      component: () => import("./views/Warhammer/List/ListMutations.vue"),
    },
    {
      path: "/mutation/:id",
      name: "mutation",
      component: () => import("./views/Warhammer/Edit/CreateMutation.vue"),
      props: true,
    },
    {
      path: "/properties",
      name: "properties",
      component: () => import("./views/Warhammer/List/ListProperties.vue"),
    },
    {
      path: "/property/:id",
      name: "property",
      component: () => import("./views/Warhammer/Edit/CreateProperty.vue"),
      props: true,
    },
    {
      path: "/skills",
      name: "skills",
      component: () => import("./views/Warhammer/List/ListSkills.vue"),
    },
    {
      path: "/skill/:id",
      name: "skill",
      component: () => import("./views/Warhammer/Edit/CreateSkill.vue"),
      props: true,
    },
    {
      path: "/careers",
      name: "careers",
      component: () => import("./views/Warhammer/List/ListCareers.vue"),
    },
    {
      path: "/career/:id",
      name: "career",
      component: () => import("./views/Warhammer/Edit/CreateCareer.vue"),
      props: true,
    },
    {
      path: "/items",
      name: "items",
      component: () => import("./views/Warhammer/List/ListItems.vue"),
    },
    {
      path: "/item/:id",
      name: "item",
      component: () => import("./views/Warhammer/Edit/CreateItem.vue"),
      props: true,
    },
    {
      path: "/characters",
      name: "characters",
      component: () => import("./views/Warhammer/List/ListCharacters.vue"),
    },
    {
      path: "/character/:id",
      name: "character",
      component: () => import("./views/Warhammer/Edit/CreateCharacter.vue"),
      props: true,
    },
    {
      path: "/view/character/:id",
      name: "viewCharacter",
      component: () => import("./views/Warhammer/ViewCharacter.vue"),
      props: true,
    },
  ],
});
