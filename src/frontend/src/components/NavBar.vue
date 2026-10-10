<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import NavLink from "./NavLink.vue";
import EditionSwitch from "./EditionSwitch.vue";
import { useAuth } from "../composables/auth.ts";
import { useEdition } from "../composables/edition.ts";
import { COMPENDIUM_SECTIONS } from "../navigation.ts";

// The links (main bar and the secondary bar under it) are shown on large screens; smaller screens get the menu
// button, which opens the sidebar.
const emit = defineEmits<{ openMenu: [] }>();

const TOP_LINK =
  "block px-3 py-2 select-none whitespace-nowrap text-primary-300 transition-colors duration-150 hover:text-primary-100";
const SECONDARY_LINK =
  "block px-3 py-0.5 rounded select-none whitespace-nowrap text-neutral-600 hover:bg-neutral-300 hover:text-neutral-900";
const MENU_LINK =
  "block px-3 py-1.5 rounded select-none whitespace-nowrap transition-colors duration-150 hover:bg-primary-200";

const auth = useAuth();
const { edition } = useEdition();

const showCompendiumMenu = ref(false);
const compendiumMenu = useTemplateRef("compendiumMenu");
onClickOutside(compendiumMenu, () => (showCompendiumMenu.value = false));
onKeyStroke("Escape", () => (showCompendiumMenu.value = false));
</script>

<template>
  <header class="sticky top-0 z-20">
    <nav class="bg-neutral-700 text-primary-300">
      <div class="max-w-7xl mx-auto h-14 px-4 flex items-center gap-1">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 font-hammergen text-3xl mr-6 drop-shadow-md transition-colors duration-150 hover:text-primary-100"
        >
          <Icon icon="game-icons:warhammer" class="size-8" />
          Hammergen
        </RouterLink>
        <div class="hidden lg:flex items-center gap-1">
          <EditionSwitch v-model="edition" dark class="text-xs mr-3" />
          <NavLink routeName="characters" icon="lucide:user-round" :class="TOP_LINK">Characters</NavLink>
          <div ref="compendiumMenu" class="relative">
            <button
              type="button"
              class="flex items-center gap-1 px-3 py-2 select-none transition-colors duration-150 hover:text-primary-100"
              :class="{ 'text-primary-100': showCompendiumMenu }"
              :aria-expanded="showCompendiumMenu"
              @click="showCompendiumMenu = !showCompendiumMenu"
            >
              <Icon icon="lucide:book-open" class="size-[1em] mr-0.5" />
              Compendium
              <Icon
                icon="lucide:chevron-down"
                class="size-4 transition-transform"
                :class="{ 'rotate-180': showCompendiumMenu }"
              />
            </button>
            <Transition
              enterActiveClass="transition duration-150 ease-out"
              enterFromClass="opacity-0 -translate-y-1"
              leaveActiveClass="transition duration-100 ease-in"
              leaveToClass="opacity-0 -translate-y-1"
            >
              <div
                v-if="showCompendiumMenu"
                class="absolute z-10 left-0 top-full mt-1 w-max p-3 grid grid-cols-2 gap-x-4 gap-y-3 bg-primary-300 text-neutral-900 border border-neutral-700 rounded shadow-lg"
              >
                <div v-for="section in COMPENDIUM_SECTIONS" :key="section.title">
                  <div
                    class="mx-3 mb-1 pb-1 border-b border-primary-600 text-[0.7rem] font-bold uppercase tracking-widest text-primary-800 whitespace-nowrap select-none"
                  >
                    {{ section.title }}
                  </div>
                  <NavLink
                    v-for="link in section.links"
                    :key="link.listRoute"
                    :routeName="link.listRoute"
                    :class="MENU_LINK"
                    @click="showCompendiumMenu = false"
                  >
                    {{ link.text }}
                  </NavLink>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="flex-auto" />
        <div class="hidden lg:flex items-center gap-1">
          <template v-if="auth.loggedIn.value">
            <NavLink routeName="manage" :class="TOP_LINK">Manage account</NavLink>
            <NavLink :class="TOP_LINK" @click="auth.logout">Logout</NavLink>
          </template>
          <template v-else>
            <NavLink routeName="register" :class="TOP_LINK">Register</NavLink>
            <NavLink routeName="login" :class="TOP_LINK">Login</NavLink>
          </template>
        </div>
        <button
          class="lg:hidden p-1 transition-colors duration-150 hover:text-primary-100"
          aria-label="Menu"
          @click="emit('openMenu')"
        >
          <Icon icon="lucide:menu" class="size-8" />
        </button>
      </div>
    </nav>
    <nav class="hidden lg:block bg-neutral-200 border-b border-neutral-300 text-sm">
      <div class="max-w-7xl mx-auto h-8 px-4 flex items-center justify-center gap-1">
        <NavLink href="https://dice.hammergen.net/" icon="lucide:dices" :class="SECONDARY_LINK">Roll dice!</NavLink>
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" icon="lucide:heart" :class="SECONDARY_LINK">
          Support Hammergen
        </NavLink>
        <NavLink routeName="about" icon="lucide:info" :class="SECONDARY_LINK">About</NavLink>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
