import Vue from "vue";
import Router from "vue-router";

import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Manage from "./components/User/Manage";
import Home from "./components/Home";
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";

import CreateProperty from "./components/Warhammer/CreateProperty";
import CreateSpell from "./components/Warhammer/CreateSpell";
import CreateMutation from "./components/Warhammer/CreateMutation";
import CreateItem from "./components/Warhammer/CreateItem";
import CreateTalent from "./components/Warhammer/CreateTalent";
import CreateSkill from "./components/Warhammer/CreateSkill";
import CreateCareer from "./components/Warhammer/CreateCareer/CreateCareer";
import CreateCharacter from "./components/Warhammer/CreateCharacter/CreateCharacter";
import ViewCharacter from "./components/Warhammer/ViewCharacter";
import ListCharacters from "./components/Warhammer/ListElements/ListCharacters";
import ListItems from "./components/Warhammer/ListElements/ListItems";
import ListSkills from "./components/Warhammer/ListElements/ListSkills";
import ListTalents from "./components/Warhammer/ListElements/ListTalents";
import ListItemProperties from "./components/Warhammer/ListElements/ListItemProperties";
import ListSpells from "./components/Warhammer/ListElements/ListSpells";
import ListMutations from "./components/Warhammer/ListElements/ListMutations";
import ListCareers from "./components/Warhammer/ListElements/ListCareers";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/register", name: "register", component: Register },
    { path: "/login", name: "login", component: Login, props: true },
    { path: "/manage", name: "manage", component: Manage },
    {
      path: "/forgotPassword",
      name: "forgotPassword",
      component: ForgotPassword,
    },
    {
      path: "/resetPassword/:token",
      name: "newPasswordWithToken",
      component: ResetPassword,
      props: true,
    },
    {
      path: "/list/character",
      name: "list_character",
      component: ListCharacters,
    },
    {
      path: "/list/item",
      name: "list_item",
      component: ListItems,
    },
    {
      path: "/list/skill",
      name: "list_skill",
      component: ListSkills,
    },
    {
      path: "/list/talent",
      name: "list_talent",
      component: ListTalents,
    },
    {
      path: "/list/property",
      name: "list_property",
      component: ListItemProperties,
    },
    {
      path: "/list/spell",
      name: "list_spell",
      component: ListSpells,
    },
    {
      path: "/list/mutation",
      name: "list_mutation",
      component: ListMutations,
    },
    {
      path: "/list/career",
      name: "list_career",
      component: ListCareers,
    },
    {
      path: "/property/:id",
      name: "property",
      component: CreateProperty,
      props: true,
    },
    {
      path: "/spell/:id",
      name: "spell",
      component: CreateSpell,
      props: true,
    },
    {
      path: "/mutation/:id",
      name: "mutation",
      component: CreateMutation,
      props: true,
    },
    { path: "/item/:id", name: "item", component: CreateItem, props: true },
    {
      path: "/talent/:id",
      name: "talent",
      component: CreateTalent,
      props: true,
    },
    { path: "/skill/:id", name: "skill", component: CreateSkill, props: true },
    {
      path: "/career/:id",
      name: "career",
      component: CreateCareer,
      props: true,
    },
    {
      path: "/character/:id",
      name: "character",
      component: CreateCharacter,
      props: true,
    },

    {
      path: "/view/character/:id",
      name: "viewCharacter",
      component: ViewCharacter,
      props: true,
    },

    { path: "/", name: "home", component: Home },

    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});
