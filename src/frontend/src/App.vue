<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import SpinnerAnimation from "./components/SpinnerAnimation.vue";
import { UserApi } from "./services/user.ts";
import { authRequest } from "./services/auth.ts";
import { useMediaQuery, useScrollLock } from "@vueuse/core";
import { useModal } from "./composables/modal.ts";
import { useRoute } from "vue-router";
import { usePrint } from "./composables/print.ts";
import { useAuth } from "./composables/auth.ts";
import { useMaintenance } from "./composables/maintenance.ts";
import MaintenancePage from "./views/MaintenancePage.vue";

const showSideBar = ref(false);
const userApi = new UserApi(authRequest);

const isLg = useMediaQuery("(min-width: 1024px)");
const auth = useAuth();
const modal = useModal();
const route = useRoute();
const { printing } = usePrint();
const { maintenance } = useMaintenance();

const isScrollLocked = useScrollLock(document.body);

watch(isLg, (isDesktop) => {
  if (isDesktop) {
    showSideBar.value = false;
  }
});

watch(
  () => showSideBar.value || modal.show.value || maintenance.value,
  (shouldLock) => {
    isScrollLocked.value = shouldLock;
  },
);

onMounted(async () => {
  if (auth.loggedIn.value) {
    try {
      await userApi.get({ skipAuthRedirect: true });
    } catch {
      // Ignored: interceptor resets auth state silently when skipAuthRedirect is true
    }
  }
});
</script>

<template>
  <!-- Maintenance screen covers the whole app -->
  <MaintenancePage v-if="maintenance" />
  <div class="min-h-screen flex flex-col">
    <NavBar v-if="!printing" @openMenu="showSideBar = true" />
    <!-- Content -->
    <main class="@container flex-auto mx-auto p-8 max-w-7xl w-full">
      <RouterView v-slot="{ Component }" :key="route.path">
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
    </main>
    <!-- Footer -->
    <footer v-if="!printing" class="flex-none bg-neutral-700 w-full">
      <div class="text-center text-sm my-2 text-amber-300">
        Contact:
        <a class="hover:text-amber-100" href="mailto:admin@hammergen.net">admin@hammergen.net</a>
      </div>
    </footer>
  </div>
  <SideBar v-if="!printing" v-model="showSideBar" />
  <!-- Modal with shade -->
  <Transition name="fade">
    <div
      v-show="modal.show.value"
      class="fixed top-0 w-full h-full z-40 bg-zinc-500 opacity-70"
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
