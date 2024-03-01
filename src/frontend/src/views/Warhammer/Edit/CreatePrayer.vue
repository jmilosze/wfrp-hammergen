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
const errors: Ref<string[]> = ref([]);

const prayerApi = new PrayerApi(authRequest);

await loadPrayer();

async function loadPrayer() {
  errors.value = [];
  try {
    prayer.value = await authStore.callAndLogoutIfUnauthorized(prayerApi.getElement)(props.id);
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      errors.value.push("Server Error.");
      console.log(error);
    }
  }
}
</script>

<template>
  <Header :title="id === 'create' ? 'Create prayer' : 'Edit prayer'" />
  <div v-if="id === 'create'">Create new prayer.</div>
  <div v-else>Modify/View prayer {{ prayer.name }}</div>
</template>

<style scoped></style>
