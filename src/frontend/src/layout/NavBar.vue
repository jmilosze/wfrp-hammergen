<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { onClickOutside, onKeyStroke, useLocalStorage } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import NavLink from "./NavLink.vue";
import EditionSwitch from "@/components/edition/EditionSwitch.vue";
import { useAuth } from "@/composables/auth.ts";
import { useEdition } from "@/composables/edition.ts";
import { COMPENDIUM_SECTIONS } from "./navigation.ts";

// The links (main bar and the secondary bar under it) are shown on large screens; smaller screens get the menu
// button, which opens the sidebar. The Compendium dropdown can be pinned as a bar of its own between the two.
const emit = defineEmits<{ openMenu: [] }>();

const TOP_LINK =
  "block px-3 py-2 select-none whitespace-nowrap text-parchment transition-colors duration-100 hover:text-parchment-light";
const SECONDARY_LINK =
  "block px-3 py-0.5 rounded select-none whitespace-nowrap text-neutral-600 transition-colors duration-100 hover:bg-neutral-300 hover:text-neutral-900";
const PINNED_LINK =
  "block px-2.5 py-0.5 rounded select-none whitespace-nowrap text-neutral-800 transition-colors duration-100 hover:bg-parchment-dark [&.router-link-active]:text-brand [&.router-link-active]:bg-parchment";
const MENU_LINK =
  "block px-3 py-1.5 rounded select-none whitespace-nowrap transition-colors duration-100 hover:bg-neutral-200";

const LOCAL_STORAGE_KEY_COMPENDIUM_PINNED = "navbarCompendiumPinned";

const auth = useAuth();
const { edition } = useEdition();

const showCompendiumMenu = ref(false);
const compendiumMenu = useTemplateRef("compendiumMenu");
onClickOutside(compendiumMenu, () => (showCompendiumMenu.value = false));
onKeyStroke("Escape", () => (showCompendiumMenu.value = false));

// Remembered between visits.
const compendiumPinned = useLocalStorage(LOCAL_STORAGE_KEY_COMPENDIUM_PINNED, false);

function togglePinned() {
  compendiumPinned.value = !compendiumPinned.value;
  showCompendiumMenu.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-20">
    <nav class="bg-brand text-parchment">
      <div class="max-w-7xl mx-auto h-14 px-4 flex items-center gap-1">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex items-center gap-2 font-hammergen text-3xl mr-6 drop-shadow-md transition-colors duration-100 hover:text-parchment-light"
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
              class="flex items-center gap-1 px-3 py-2 select-none transition-colors duration-100 hover:text-parchment-light"
              :class="{ 'text-parchment-light': showCompendiumMenu }"
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
                class="absolute z-10 left-0 top-full mt-1 w-max p-3 grid grid-cols-2 gap-x-4 gap-y-3 bg-neutral-100 text-neutral-900 border border-neutral-400 rounded shadow-lg"
              >
                <div v-for="section in COMPENDIUM_SECTIONS" :key="section.title">
                  <div
                    class="mx-3 mb-1 pb-1 border-b border-brand-rule text-[0.7rem] font-bold uppercase tracking-widest text-brand whitespace-nowrap select-none"
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
                <div class="col-span-2 pt-2 border-t border-neutral-300 flex justify-end">
                  <button
                    type="button"
                    class="flex items-center gap-1.5 px-3 py-1 rounded select-none text-sm text-neutral-600 transition-colors duration-100 hover:bg-neutral-200 hover:text-neutral-900"
                    @click="togglePinned"
                  >
                    <Icon :icon="compendiumPinned ? 'lucide:pin-off' : 'lucide:pin'" class="size-4" />
                    {{ compendiumPinned ? "Unpin bar" : "Pin as bar" }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="flex-auto" />
        <div class="hidden lg:flex items-center gap-1">
          <template v-if="auth.loggedIn.value">
            <NavLink routeName="manage" :class="TOP_LINK">Manage account</NavLink>
            <NavLink :class="TOP_LINK" @click="auth.logout">Log out</NavLink>
          </template>
          <template v-else>
            <NavLink routeName="register" :class="TOP_LINK">Register</NavLink>
            <NavLink routeName="login" :class="TOP_LINK">Log in</NavLink>
          </template>
        </div>
        <button
          class="lg:hidden p-1 transition-colors duration-100 hover:text-parchment-light"
          aria-label="Menu"
          @click="emit('openMenu')"
        >
          <Icon icon="lucide:menu" class="size-8" />
        </button>
      </div>
    </nav>
    <nav
      v-if="compendiumPinned"
      aria-label="Compendium"
      class="hidden lg:block bg-parchment-light border-b border-parchment-dark text-sm"
    >
      <!-- Equal flex-1 sides keep the links centred. -->
      <div class="max-w-7xl mx-auto h-8 px-4 flex items-center">
        <div class="flex-1" />
        <template v-for="(section, i) in COMPENDIUM_SECTIONS" :key="section.title">
          <div v-if="i > 0" class="w-px h-4 mx-2 bg-parchment-dark" />
          <NavLink v-for="link in section.links" :key="link.listRoute" :routeName="link.listRoute" :class="PINNED_LINK">
            {{ link.text }}
          </NavLink>
        </template>
        <div class="flex-1 flex justify-end">
          <button
            type="button"
            class="p-1 rounded text-neutral-600 transition-colors duration-100 hover:bg-parchment-dark hover:text-neutral-900"
            aria-label="Unpin the Compendium bar"
            title="Unpin"
            @click="compendiumPinned = false"
          >
            <Icon icon="lucide:pin-off" class="size-4" />
          </button>
        </div>
      </div>
    </nav>
    <nav class="hidden lg:block bg-neutral-200 border-b border-neutral-300 text-sm">
      <div class="max-w-7xl mx-auto h-8 px-4 flex items-center justify-center gap-1">
        <NavLink href="https://dice.hammergen.net/" :class="SECONDARY_LINK">Roll dice!</NavLink>
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" :class="SECONDARY_LINK"> Support Hammergen </NavLink>
        <NavLink routeName="about" :class="SECONDARY_LINK">About</NavLink>
      </div>
    </nav>
  </header>
</template>
