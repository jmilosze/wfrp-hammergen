<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { Ref, ref } from "vue";
import { UnauthorizedError, useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";

const props = defineProps<{
  id: string;
}>();

const authStore = useAuthStore();

const prayer = ref(new Prayer());
const prayerOriginal = ref(new Prayer());

const prayerApi = new PrayerApi(authRequest);

if (props.id !== "create") {
  await loadPrayer();
}

async function loadPrayer() {
  try {
    prayer.value = await authStore.callAndLogoutIfUnauthorized(prayerApi.getElement)(props.id);
    prayerOriginal.value = prayer.value.copy();
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <Header :title="id === 'create' ? 'Create prayer' : 'Edit prayer'" />
</template>

<style scoped></style>
