import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouterHistory,
  type RouteLocationNormalized,
} from "vue-router";
import { isUserLoggedIn } from "./services/auth.ts";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
  }
}
import HomePage from "./views/HomePage.vue";

export function isCreationRoute(to: RouteLocationNormalized): boolean {
  return to.params.id === "create";
}

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./views/About/AboutHammergen.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/User/UserRegister.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/User/UserLogin.vue"),
    meta: { requiresGuest: true },
  },
  {
    path: "/forgotpassword",
    name: "forgotpassword",
    component: () => import("./views/User/UserForgotPassword.vue"),
    meta: { requiresGuest: true },
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
    component: () => import("./views/User/UserManageAccount.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/prayers",
    name: "prayers",
    component: () => import("./views/Content/List/ListPrayers.vue"),
  },
  {
    path: "/prayer/:id",
    name: "prayer",
    component: () => import("./views/Content/Edit/EditPrayer.vue"),
    props: true,
  },
  {
    path: "/spells",
    name: "spells",
    component: () => import("./views/Content/List/ListSpells.vue"),
  },
  {
    path: "/spell/:id",
    name: "spell",
    component: () => import("./views/Content/Edit/EditSpell.vue"),
    props: true,
  },
  {
    path: "/talents",
    name: "talents",
    component: () => import("./views/Content/List/ListTalents.vue"),
  },
  {
    path: "/talent/:id",
    name: "talent",
    component: () => import("./views/Content/Edit/EditTalent.vue"),
    props: true,
  },
  {
    path: "/mutations",
    name: "mutations",
    component: () => import("./views/Content/List/ListMutations.vue"),
  },
  {
    path: "/mutation/:id",
    name: "mutation",
    component: () => import("./views/Content/Edit/EditMutation.vue"),
    props: true,
  },
  {
    path: "/properties",
    name: "properties",
    component: () => import("./views/Content/List/ListProperties.vue"),
  },
  {
    path: "/property/:id",
    name: "property",
    component: () => import("./views/Content/Edit/EditProperty.vue"),
    props: true,
  },
  {
    path: "/runes",
    name: "runes",
    component: () => import("./views/Content/List/ListRunes.vue"),
  },
  {
    path: "/rune/:id",
    name: "rune",
    component: () => import("./views/Content/Edit/EditRune.vue"),
    props: true,
  },
  {
    path: "/skills",
    name: "skills",
    component: () => import("./views/Content/List/ListSkills.vue"),
  },
  {
    path: "/skill/:id",
    name: "skill",
    component: () => import("./views/Content/Edit/EditSkill.vue"),
    props: true,
  },
  {
    path: "/careers",
    name: "careers",
    component: () => import("./views/Content/List/ListCareers.vue"),
  },
  {
    path: "/career/:id",
    name: "career",
    component: () => import("./views/Content/Edit/EditCareer.vue"),
    props: true,
  },
  {
    path: "/items",
    name: "items",
    component: () => import("./views/Content/List/ListItems.vue"),
  },
  {
    path: "/item/:id",
    name: "item",
    component: () => import("./views/Content/Edit/EditItem.vue"),
    props: true,
  },
  {
    path: "/characters",
    name: "characters",
    component: () => import("./views/Character/ListCharacters.vue"),
  },
  {
    path: "/character/:id",
    name: "character",
    component: () => import("./views/Character/EditCharacter.vue"),
    props: true,
  },
  {
    path: "/view/character/:id",
    name: "viewCharacter",
    component: () => import("./views/Character/ViewCharacter.vue"),
    props: true,
  },
  {
    path: "/traits",
    name: "traits",
    component: () => import("./views/Content/List/ListTraits.vue"),
  },
  {
    path: "/trait/:id",
    name: "trait",
    component: () => import("./views/Content/Edit/EditTrait.vue"),
    props: true,
  },
];

export function createHammergenRouter(
  history: RouterHistory = typeof window !== "undefined" ? createWebHistory() : createMemoryHistory(),
) {
  const router = createRouter({
    history,
    routes,
  });

  router.beforeEach((to) => {
    const loggedIn = isUserLoggedIn();

    if ((to.meta.requiresAuth || isCreationRoute(to)) && !loggedIn) {
      return {
        name: "login",
        query: { redirect: to.fullPath },
      };
    }

    if (to.meta.requiresGuest && loggedIn) {
      return { name: "home" };
    }
  });

  return router;
}

export default createHammergenRouter();
