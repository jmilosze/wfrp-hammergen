<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AnnouncementBar from "./layout/AnnouncementBar.vue";
import { ANNOUNCEMENT } from "./layout/announcement.ts";
import NavBar from "./layout/NavBar.vue";
import SideBar from "./layout/SideBar.vue";
import SpinnerAnimation from "./components/ui/SpinnerAnimation.vue";
import { UserApi } from "./services/user.ts";
import { authRequest } from "./services/auth.ts";
import { useMediaQuery, useScrollLock } from "@vueuse/core";
import { useRoute } from "vue-router";
import { usePrint } from "./composables/print.ts";
import { useAuth } from "./composables/auth.ts";
import { useMaintenance } from "./composables/maintenance.ts";
import MaintenancePage from "./views/MaintenancePage.vue";
import SessionLoginDialog from "./components/account/SessionLoginDialog.vue";

const showSideBar = ref(false);
const userApi = new UserApi(authRequest);

const isLg = useMediaQuery("(min-width: 1024px)");
const auth = useAuth();
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
  () => showSideBar.value || maintenance.value,
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
    <AnnouncementBar v-if="!printing && ANNOUNCEMENT !== null" :text="ANNOUNCEMENT" class="print:hidden" />
    <NavBar v-if="!printing" class="print:hidden" @openMenu="showSideBar = true" />
    <!-- Content -->
    <!-- The page container is named, so parts of a page in containers of their own can still follow the page width. -->
    <main class="@container/page flex-auto mx-auto p-8 print:p-0 max-w-7xl w-full">
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
    <footer v-if="!printing" class="flex-none bg-brand w-full print:hidden">
      <div class="text-center text-sm my-2 text-parchment">
        Contact:
        <a class="transition-colors duration-100 hover:text-parchment-light" href="mailto:admin@hammergen.net">
          admin@hammergen.net
        </a>
      </div>
    </footer>
  </div>
  <SideBar v-if="!printing" v-model="showSideBar" />
  <SessionLoginDialog />
</template>
