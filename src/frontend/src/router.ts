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
    path: "/runes",
    name: "runes",
    component: () => import("./views/Warhammer/List/ListRunes.vue"),
  },
  {
    path: "/rune/:id",
    name: "rune",
    component: () => import("./views/Warhammer/Edit/CreateRune.vue"),
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
  {
    path: "/traits",
    name: "traits",
    component: () => import("./views/Warhammer/List/ListTraits.vue"),
  },
  {
    path: "/trait/:id",
    name: "trait",
    component: () => import("./views/Warhammer/Edit/CreateTrait.vue"),
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
