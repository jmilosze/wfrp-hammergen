import Vue from "vue";
import Router from "vue-router";
import UserRegister from "./components/User/Register.vue";
import UserLogin from "./components/User/Login.vue";
import UserManage from "./components/User/Manage.vue";
import HomePage from "./components/Home.vue";
import UpdatesPage from "./components/Updates.vue";
import UserForgotPassword from "./components/User/ForgotPassword.vue";
import UserNewPassword from "./components/User/ResetPassword.vue";
import CreateProperty from "./components/Warhammer/CreateProperty.vue";
import CreateSpell from "./components/Warhammer/CreateSpell.vue";
import CreateMutation from "./components/Warhammer/CreateMutation.vue";
import CreateItem from "./components/Warhammer/CreateItem.vue";
import CreateTalent from "./components/Warhammer/CreateTalent.vue";
import CreateSkill from "./components/Warhammer/CreateSkill.vue";
import CreateCareer from "./components/Warhammer/CreateCareer/CreateCareer.vue";
import CreateCharacter from "./components/Warhammer/CreateCharacter/CreateCharacter.vue";
import ViewCharacter from "./components/Warhammer/ViewCharacter.vue";
import ListCharacters from "./components/Warhammer/ListElements/ListCharacters.vue";
import ListItems from "./components/Warhammer/ListElements/ListItems.vue";
import ListSkills from "./components/Warhammer/ListElements/ListSkills.vue";
import ListTalents from "./components/Warhammer/ListElements/ListTalents.vue";
import ListItemProperties from "./components/Warhammer/ListElements/ListItemProperties2.vue";
import ListSpells from "./components/Warhammer/ListElements/ListSpells.vue";
import ListMutations from "./components/Warhammer/ListElements/ListMutations.vue";
import ListCareers from "./components/Warhammer/ListElements/ListCareers.vue";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/register", name: "register", component: UserRegister },
    { path: "/login", name: "login", component: UserLogin, props: true },
    { path: "/manage", name: "manage", component: UserManage },
    {
      path: "/forgotPassword",
      name: "forgotPassword",
      component: UserForgotPassword,
    },
    {
      path: "/resetPassword/:token",
      name: "newPasswordWithToken",
      component: UserNewPassword,
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

    { path: "/", name: "home", component: HomePage },
    { path: "/updates", name: "updates", component: UpdatesPage },

    { path: "*", redirect: "/" },
  ],
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
});
