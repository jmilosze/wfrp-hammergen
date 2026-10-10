<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useRoute } from "vue-router";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import NavLink from "./NavLink.vue";
import EditionSwitch from "./EditionSwitch.vue";
import { useAuth } from "../composables/auth.ts";
import { useEdition } from "../composables/edition.ts";
import { CHARACTER_ROUTES, COMPENDIUM_SECTIONS, isCompendiumRoute } from "../navigation.ts";

// The links (main bar and the secondary bar under it) are shown on large screens; smaller screens get the menu
// button, which opens the sidebar.
const emit = defineEmits<{ openMenu: [] }>();

const auth = useAuth();
const route = useRoute();
const { edition } = useEdition();

const inCompendium = computed(() => isCompendiumRoute(route.name));

const showCompendiumMenu = ref(false);
const compendiumMenu = useTemplateRef("compendiumMenu");
onClickOutside(compendiumMenu, () => (showCompendiumMenu.value = false));
onKeyStroke("Escape", () => (showCompendiumMenu.value = false));
</script>

<template>
  <header class="sticky top-0 z-20">
    <nav class="bg-neutral-700 text-amber-300">
      <div class="max-w-7xl mx-auto h-14 px-4 flex items-center gap-1">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 font-hammergen text-3xl mr-6 drop-shadow-md hover:text-amber-100"
        >
          <Icon icon="game-icons:warhammer" class="size-8" />
          Hammergen
        </RouterLink>
        <div class="hidden lg:flex items-center gap-1">
          <EditionSwitch v-model="edition" dark class="text-xs mr-3" />
          <NavLink routeName="characters" :activeRoutes="CHARACTER_ROUTES" variant="top">Characters</NavLink>
          <div ref="compendiumMenu" class="relative">
            <button
              type="button"
              class="flex items-center gap-1 px-3 py-2 rounded select-none hover:bg-neutral-800"
              :class="inCompendium || showCompendiumMenu ? 'bg-neutral-800 text-amber-100' : ''"
              :aria-expanded="showCompendiumMenu"
              @click="showCompendiumMenu = !showCompendiumMenu"
            >
              Compendium
              <Icon
                icon="lucide:chevron-down"
                class="size-4 transition-transform"
                :class="{ 'rotate-180': showCompendiumMenu }"
              />
            </button>
            <div
              v-if="showCompendiumMenu"
              class="absolute left-0 top-full mt-1 w-max p-3 grid grid-cols-2 gap-x-4 gap-y-3 bg-amber-300 text-neutral-900 border border-neutral-700 rounded shadow-lg"
            >
              <div v-for="section in COMPENDIUM_SECTIONS" :key="section.title">
                <div
                  class="mx-3 mb-1 pb-1 border-b border-amber-600 text-[0.7rem] font-bold uppercase tracking-widest text-amber-800 whitespace-nowrap select-none"
                >
                  {{ section.title }}
                </div>
                <NavLink
                  v-for="link in section.links"
                  :key="link.listRoute"
                  :routeName="link.listRoute"
                  :activeRoutes="[link.editRoute]"
                  variant="menu"
                  @click="showCompendiumMenu = false"
                >
                  {{ link.text }}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-auto" />
        <div class="hidden lg:flex items-center gap-1">
          <template v-if="auth.loggedIn.value">
            <NavLink routeName="manage" variant="top">Manage account</NavLink>
            <NavLink variant="top" @click="auth.logout">Logout</NavLink>
          </template>
          <template v-else>
            <NavLink routeName="register" variant="top">Register</NavLink>
            <NavLink routeName="login" variant="top">Login</NavLink>
          </template>
        </div>
        <button class="lg:hidden p-1 rounded hover:bg-neutral-800" aria-label="Menu" @click="emit('openMenu')">
          <Icon icon="lucide:menu" class="size-8" />
        </button>
      </div>
    </nav>
    <nav class="hidden lg:block bg-neutral-200 border-b border-neutral-300 text-sm">
      <div class="max-w-7xl mx-auto h-8 px-4 flex items-center justify-end gap-1">
        <NavLink href="https://dice.hammergen.net/" variant="secondary">Roll dice!</NavLink>
        <NavLink routeName="about" variant="secondary">About</NavLink>
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" variant="secondary">Support Hammergen</NavLink>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
