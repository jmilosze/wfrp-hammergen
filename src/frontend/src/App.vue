<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import NavLink from "./components/NavLink.vue";
import SpinnerAnimation from "./components/SpinnerAnimation.vue";
import { UserApi } from "./services/user.ts";
import { authRequest } from "./services/auth.ts";
import { useScreenSize } from "./composables/viewSize.ts";
import { ViewSize } from "./utils/viewSize.ts";
import { useModal } from "./composables/modal.ts";
import { useRouter } from "vue-router";
import { usePrint } from "./composables/print.ts";
import { useAuth } from "./composables/auth.ts";

const showSideBar = ref(false);
const userApi = new UserApi(authRequest);

const { isEqualOrGreater } = useScreenSize(ViewSize.lg);
const auth = useAuth();
const modal = useModal();
const router = useRouter();
const { printing } = usePrint();

const reRenderContentCounter = ref(0);
const reRenderContent = computed(() => {
  return router.currentRoute.value.path + "_counter_" + reRenderContentCounter.value.toString();
});

watch(isEqualOrGreater, () => {
  if (isEqualOrGreater) {
    showSideBar.value = false;
  }
});

watch(showSideBar, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

watch(modal.show, (showModal) => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

onMounted(async () => {
  if (auth.loggedIn.value) {
    await auth.callAndLogoutIfUnauthorized(userApi.get, false)();
  }
});

function onListWhClick() {
  showSideBar.value = false;
  reRenderContentCounter.value += 1;
}
</script>

<template>
  <!-- Top NavBar -->
  <div v-if="!printing" class="fixed lg:pl-64 h-16 w-full flex justify-center bg-neutral-700 z-10">
    <div class="flex-auto max-w-7xl px-4 flex items-center">
      <div class="flex-auto flex items-center justify-between">
        <NavLink href="https://ko-fi.com/Q5Q12E0KB" variant="top" class="mx-5"> Support Hammergen </NavLink>
        <button class="text-amber-300 lg:hidden" @click="showSideBar = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path
              fill-rule="evenodd"
              d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <div v-if="auth.loggedIn.value" class="hidden lg:flex items-center">
          <NavLink routeName="manage" variant="top" class="mx-5 whitespace-nowrap">Manage Account</NavLink>
          <NavLink class="ml-5" variant="top" @click="auth.logout">Logout</NavLink>
        </div>
        <div v-else class="hidden lg:flex justify-center">
          <NavLink routeName="register" variant="top" class="mx-5">Register</NavLink>
          <NavLink routeName="login" variant="top" class="ml-5">Login</NavLink>
        </div>
      </div>
    </div>
  </div>
  <!-- SideBar -->
  <div
    v-if="!printing"
    class="fixed overflow-auto h-full w-64 z-30 bg-amber-300 transition-transform border-neutral-400 text-neutral-900"
    :class="[
      !isEqualOrGreater ? 'right-0 transform transition-transform duration-300' : 'left-0',
      !isEqualOrGreater && !showSideBar ? 'translate-x-full' : '',
      isEqualOrGreater ? 'border-r' : 'border-l',
    ]"
  >
    <div class="pl-1 lg:p-0 mt-2 mb-8 flex items-center justify-between lg:justify-center lg:ml-0">
      <NavLink routeName="home" variant="side" class="text-3xl font-hammergen">Hammergen</NavLink>
      <button
        v-if="!isEqualOrGreater && showSideBar"
        class="hover:bg-neutral-700 hover:text-amber-300 p-1 rounded mr-2"
        @click="showSideBar = false"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path
            d="M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 0-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z"
          />
        </svg>
      </button>
    </div>
    <div class="pl-3 pr-3 divide-y divide-neutral-700">
      <div class="text-xl pb-2">
        <NavLink
          routeName="characters"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
        >
          Characters
        </NavLink>
      </div>
      <div class="py-2">
        <NavLink
          routeName="careers"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Careers</NavLink
        >
        <NavLink
          routeName="traits"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
        >
          Creature traits
        </NavLink>
        <NavLink
          routeName="mutations"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Mutations</NavLink
        >
        <NavLink
          routeName="prayers"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Prayers</NavLink
        >
        <NavLink
          routeName="properties"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Qualities and flaws</NavLink
        >
        <NavLink
          routeName="runes"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
        >
          Runes
        </NavLink>
        <NavLink
          routeName="skills"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Skills</NavLink
        >
        <NavLink
          routeName="spells"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Spells</NavLink
        >
        <NavLink
          routeName="talents"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Talents</NavLink
        >
        <NavLink
          routeName="items"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Trappings</NavLink
        >
      </div>
      <div v-if="auth.loggedIn.value" class="py-2">
        <NavLink
          routeName="manage"
          variant="side"
          @click="showSideBar = false"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Manage account</NavLink
        >
        <NavLink variant="side" @click="auth.logout" :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Logout</NavLink
        >
      </div>
      <div v-else class="py-2">
        <NavLink
          routeName="register"
          variant="side"
          @click="showSideBar = false"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Register</NavLink
        >
        <NavLink
          routeName="login"
          variant="side"
          @click="showSideBar = false"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Login</NavLink
        >
      </div>
      <div class="pt-2">
        <NavLink
          href="https://dice.hammergen.net/"
          variant="side"
          @click="onListWhClick()"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >Roll dice!</NavLink
        >
        <NavLink
          routeName="about"
          variant="side"
          @click="showSideBar = false"
          :class="isEqualOrGreater ? 'text-start' : 'text-end'"
          >About</NavLink
        >
      </div>
    </div>
  </div>
  <!-- Content and footer-->
  <div class="lg:pl-64 pt-16 h-screen">
    <div class="h-full flex flex-col justify-between items-center">
      <!-- Content -->
      <div class="flex-auto p-8 max-w-7xl w-full">
        <RouterView v-slot="{ Component }" :key="reRenderContent">
          <template v-if="Component">
            <Suspense>
              <!-- main content -->
              <component :is="Component" />
              <!-- loading state -->
              <template #fallback>
                <div class="flex justify-center">
                  <SpinnerAnimation class="w-14" />
                </div>
              </template>
            </Suspense>
          </template>
        </RouterView>
      </div>
      <!-- Footer -->
      <div v-if="!printing" class="flex-none bg-neutral-700 w-full">
        <div class="text-center text-sm my-2 text-amber-300">
          Contact:
          <a class="hover:text-amber-100" href="mailto:admin@hammergen.net">admin@hammergen.net</a>
        </div>
      </div>
    </div>
  </div>
  <!-- Shade for side bar -->
  <Transition name="fade">
    <div
      v-show="showSideBar && !isEqualOrGreater"
      class="fixed top-0 w-screen h-screen z-20 bg-zinc-500 opacity-50 duration-500"
      @click="showSideBar = false"
    />
  </Transition>
  <!-- Modal with shade -->
  <Transition name="fade">
    <div
      v-show="modal.show.value"
      class="fixed top-0 w-full h-full z-40 bg-zinc-500 opacity-60"
      @click="modal.hideModal()"
    />
  </Transition>
  <Transition name="fade">
    <div v-show="modal.show.value" class="fixed top-0 w-full h-full z-50">
      <div
        id="modal"
        class="relative overflow-auto h-full flex items-center justify-center"
        @click="modal.hideModal()"
      />
    </div>
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
