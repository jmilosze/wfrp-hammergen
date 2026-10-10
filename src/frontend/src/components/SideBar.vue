<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import NavLink from "./NavLink.vue";
import EditionSwitch from "./EditionSwitch.vue";
import { useAuth } from "../composables/auth.ts";
import { useEdition } from "../composables/edition.ts";
import { COMPENDIUM_SECTIONS } from "../navigation.ts";

const LOCAL_STORAGE_KEY_COMPENDIUM_OPEN = "sidebarCompendiumOpen";

const LINK = "block w-full py-1 px-2 rounded select-none text-end transition-colors duration-150 hover:bg-primary-200";

// Slide-in navigation for screens below lg; large screens use the links in NavBar.
const open = defineModel<boolean>({ required: true });

const auth = useAuth();
const { edition } = useEdition();

// Remembered between visits.
const compendiumOpen = useLocalStorage(LOCAL_STORAGE_KEY_COMPENDIUM_OPEN, false);
</script>

<template>
  <div
    class="lg:hidden fixed top-0 right-0 overflow-auto h-full w-64 z-30 bg-primary-300 border-l border-neutral-400 text-neutral-900 transition-transform duration-300"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
  >
    <!-- Equal flex-1 sides keep the title centred. -->
    <div class="mt-2 mb-2 flex items-center">
      <div class="flex-1" />
      <RouterLink :to="{ name: 'home' }" class="text-3xl font-hammergen px-2" @click="open = false">
        Hammergen
      </RouterLink>
      <div class="flex-1 flex justify-end">
        <button class="hover:bg-primary-200 transition-colors duration-150 p-1 rounded mr-2" @click="open = false">
          <Icon icon="lucide:x" class="size-6" />
        </button>
      </div>
    </div>
    <div class="px-3 mb-5 flex justify-center text-xs">
      <EditionSwitch v-model="edition" />
    </div>
    <div class="px-3 divide-y divide-neutral-700">
      <div class="text-xl pb-2">
        <NavLink routeName="characters" icon="lucide:user-round" :class="LINK" @click="open = false">
          Characters
        </NavLink>
      </div>
      <div class="py-2">
        <button
          type="button"
          class="w-full flex items-center justify-end gap-1 py-1 px-2 rounded select-none text-xl transition-colors duration-150 hover:bg-primary-200"
          :aria-expanded="compendiumOpen"
          @click="compendiumOpen = !compendiumOpen"
        >
          <Icon
            icon="lucide:chevron-down"
            class="size-5 transition-transform"
            :class="{ 'rotate-180': compendiumOpen }"
          />
          <Icon icon="lucide:book-open" class="size-[1em] ml-1 mr-0.5" />
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
                class="mx-2 mt-2 mb-1 pb-0.5 border-b border-primary-600 text-[0.7rem] font-bold uppercase tracking-widest text-primary-800 text-end select-none"
              >
                {{ section.title }}
              </div>
              <NavLink
                v-for="link in section.links"
                :key="link.listRoute"
                :routeName="link.listRoute"
                :class="LINK"
                @click="open = false"
              >
                {{ link.text }}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="auth.loggedIn.value" class="py-2">
        <NavLink routeName="manage" :class="LINK" @click="open = false">Manage account</NavLink>
        <NavLink :class="LINK" @click="auth.logout">Logout</NavLink>
      </div>
      <div v-else class="py-2">
        <NavLink routeName="register" :class="LINK" @click="open = false">Register</NavLink>
        <NavLink routeName="login" :class="LINK" @click="open = false">Login</NavLink>
      </div>
      <div class="pt-2">
        <NavLink href="https://dice.hammergen.net/" icon="lucide:dices" :class="LINK" @click="open = false">
          Roll dice!
        </NavLink>
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" icon="lucide:heart" :class="LINK" @click="open = false">
          Support Hammergen
        </NavLink>
        <NavLink routeName="about" icon="lucide:info" :class="LINK" @click="open = false">About</NavLink>
      </div>
    </div>
  </div>
  <!-- Shade behind the sidebar -->
  <Transition name="fade">
    <div
      v-show="open"
      class="lg:hidden fixed top-0 w-screen h-screen z-20 bg-neutral-500 opacity-70"
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
