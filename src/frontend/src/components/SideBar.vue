<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import NavLink from "./NavLink.vue";
import EditionSwitch from "./EditionSwitch.vue";
import { useAuth } from "../composables/auth.ts";
import { useEdition } from "../composables/edition.ts";
import { CHARACTER_ROUTES, COMPENDIUM_SECTIONS, isCompendiumRoute } from "../navigation.ts";

const LOCAL_STORAGE_KEY_COMPENDIUM_OPEN = "sidebarCompendiumOpen";

// Slide-in navigation for screens below lg; large screens use the links in NavBar.
const open = defineModel<boolean>({ required: true });

const auth = useAuth();
const { edition } = useEdition();
const route = useRoute();

// Remembered between visits.
const compendiumOpen = useLocalStorage(LOCAL_STORAGE_KEY_COMPENDIUM_OPEN, false);
// A collapsed Compendium is highlighted when the current page is inside it.
const compendiumSelected = computed(() => !compendiumOpen.value && isCompendiumRoute(route.name));
</script>

<template>
  <div
    class="lg:hidden fixed top-0 right-0 overflow-auto h-full w-64 z-30 bg-amber-300 border-l border-neutral-400 text-neutral-900 transition-transform duration-300"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Equal flex-1 sides keep the title centred. -->
    <div class="mt-2 mb-2 flex items-center">
      <div class="flex-1" />
      <RouterLink :to="{ name: 'home' }" class="text-3xl font-hammergen px-2" @click="open = false">
        Hammergen
      </RouterLink>
      <div class="flex-1 flex justify-end">
        <button class="hover:bg-neutral-700 hover:text-amber-300 p-1 rounded mr-2" @click="open = false">
          <Icon icon="lucide:x" class="size-6" />
        </button>
      </div>
    </div>
    <div class="px-3 mb-5 flex justify-center text-xs">
      <EditionSwitch v-model="edition" />
    </div>
    <div class="px-3 divide-y divide-neutral-700">
      <div class="text-xl pb-2">
        <NavLink routeName="characters" :activeRoutes="CHARACTER_ROUTES" variant="side" @click="open = false">
          Characters
        </NavLink>
      </div>
      <div class="py-2">
        <button
          type="button"
          class="w-full flex items-center justify-end gap-1 py-1 px-2 rounded select-none text-xl"
          :class="compendiumSelected ? 'bg-neutral-700 text-amber-300' : 'hover:bg-neutral-700 hover:text-amber-300'"
          :aria-expanded="compendiumOpen"
          @click="compendiumOpen = !compendiumOpen"
        >
          <Icon
            icon="lucide:chevron-down"
            class="size-5 transition-transform"
            :class="{ 'rotate-180': compendiumOpen }"
          />
          Compendium
        </button>
        <!-- Animates the height: the grid row goes from 0fr to 1fr. -->
        <div
          class="grid transition-[grid-template-rows] duration-300"
          :class="compendiumOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden" :inert="!compendiumOpen">
            <div v-for="section in COMPENDIUM_SECTIONS" :key="section.title" class="pb-1">
              <div
                class="mx-2 mt-2 mb-1 pb-0.5 border-b border-amber-600 text-[0.7rem] font-bold uppercase tracking-widest text-amber-800 text-end select-none"
              >
                {{ section.title }}
              </div>
              <NavLink
                v-for="link in section.links"
                :key="link.listRoute"
                :routeName="link.listRoute"
                :activeRoutes="[link.editRoute]"
                variant="side"
                @click="open = false"
              >
                {{ link.text }}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="auth.loggedIn.value" class="py-2">
        <NavLink routeName="manage" variant="side" @click="open = false">Manage account</NavLink>
        <NavLink variant="side" @click="auth.logout">Logout</NavLink>
      </div>
      <div v-else class="py-2">
        <NavLink routeName="register" variant="side" @click="open = false">Register</NavLink>
        <NavLink routeName="login" variant="side" @click="open = false">Login</NavLink>
      </div>
      <div class="pt-2">
        <NavLink href="https://dice.hammergen.net/" variant="side" @click="open = false">Roll dice!</NavLink>
        <NavLink routeName="about" variant="side" @click="open = false">About</NavLink>
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" variant="side" @click="open = false">Support Hammergen</NavLink>
      </div>
    </div>
  </div>
  <!-- Shade behind the sidebar -->
  <Transition name="fade">
    <div
      v-show="open"
      class="lg:hidden fixed top-0 w-screen h-screen z-20 bg-zinc-500 opacity-70"
      @click="open = false"
    />
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
