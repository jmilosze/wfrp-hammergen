<script setup lang="ts">
import { ref, watch } from "vue";
import { useScreen } from "./composables/screen.ts";
import NavLink from "./components/NavLink.vue";
import { useAuthStore } from "./stores/auth.ts";

const showSideBar = ref(false);

const { screenSizeMd } = useScreen();
const authStore = useAuthStore();

watch(screenSizeMd, () => {
  if (screenSizeMd) {
    showSideBar.value = false;
  }
});
</script>

<template>
  <!-- Top NavBar -->
  <div class="fixed md:pl-64 h-16 w-full flex justify-center bg-neutral-700 z-10">
    <div class="flex-auto max-w-7xl px-4 flex items-center">
      <div class="flex-auto flex items-center justify-between">
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" variant="top" class="mx-5">Support Hammergen</NavLink>
        <button class="text-amber-300 md:hidden" @click="showSideBar = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            ></path>
          </svg>
        </button>
        <div v-if="authStore.loggedIn" class="hidden md:flex justify-center">
          <NavLink class="mx-5" variant="top" @click="authStore.logout">Logout</NavLink>
        </div>
        <div v-else class="hidden md:flex justify-center">
          <NavLink routeName="register" variant="top" class="mx-5">Register</NavLink>
          <NavLink routeName="login" variant="top" class="ml-5">Login</NavLink>
        </div>
      </div>
    </div>
  </div>
  <!-- SideBar -->
  <div
    class="fixed overflow-auto h-full w-64 z-30 bg-amber-300 transition-transform ease-in-out duration-150 border-r border-neutral-400 text-neutral-900"
    :class="!screenSizeMd && !showSideBar ? '-translate-x-64' : ''"
  >
    <div class="pl-1 md:p-0 mt-2 mb-8 flex items-center justify-between md:justify-center md:ml-0">
      <NavLink routeName="home" variant="side" class="text-3xl font-hammergen">Hammergen</NavLink>
      <button
        v-if="!screenSizeMd && showSideBar"
        @click="showSideBar = false"
        class="hover:bg-neutral-700 hover:text-amber-300 p-1 rounded mr-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 0-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z"
          ></path>
        </svg>
      </button>
    </div>
    <div class="pl-3 pr-3 divide-y divide-neutral-700">
      <div class="text-xl pb-2">
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Characters</NavLink>
      </div>
      <div class="py-2">
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Careers</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Mutations</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Prayers</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Qualities and Runes</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Skills</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Spells</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Talents</NavLink>
        <NavLink routeName="placeholder" variant="side" @click="showSideBar = false">Trappings</NavLink>
      </div>
      <div v-if="authStore.loggedIn" class="py-2">
        <NavLink variant="side" @click="authStore.logout">Logout</NavLink>
      </div>
      <div v-else class="py-2">
        <NavLink routeName="register" variant="side" @click="showSideBar = false">Register</NavLink>
        <NavLink routeName="login" variant="side" @click="showSideBar = false">Login</NavLink>
      </div>
      <div class="pt-2">
        <NavLink routeName="howto" variant="side" @click="showSideBar = false">How to use Hammergen</NavLink>
        <NavLink routeName="about" variant="side" @click="showSideBar = false">About</NavLink>
      </div>
    </div>
  </div>
  <!-- Content and footer-->
  <div class="md:pl-64 pt-16 h-screen">
    <div class="h-full flex flex-col justify-between items-center">
      <div class="flex-auto p-9 max-w-7xl w-full"><RouterView /></div>
      <div class="flex-none bg-neutral-700 w-full">
        <div class="text-center text-sm my-2 text-amber-300">
          Contact:
          <a class="hover:text-amber-100" href="mailto:admin@hammergen.net">admin@hammergen.net</a>
        </div>
      </div>
    </div>
  </div>
  <!-- Out of focus -->
  <div
    class="top-0 w-screen h-screen z-20 bg-zinc-500 transition-opacity ease-in-out duration-150"
    :class="!screenSizeMd && showSideBar ? ['fixed', 'opacity-40'] : ['hidden', 'opacity-0']"
    @click="showSideBar = false"
  ></div>
</template>

<style></style>
