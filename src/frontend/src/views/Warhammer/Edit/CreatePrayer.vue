<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { computed, ref } from "vue";
import { useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";

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

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => prayer.value.validateName());
const validDesc = computed(() => prayer.value.validateDescription());
const validRange = computed(() => prayer.value.validateRange());
</script>

<template>
  <Header :title="id === 'create' ? 'Create prayer' : 'Edit prayer'" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4"
    :class="[isEqualOrGreater ? '' : 'flex-wrap']"
  >
    <div class="m-1 my-3 grow">
      <FormInput v-model="prayer.name" title="Name" :validationStatus="validName" />
    </div>
    <div class="m-1 my-3 grow">
      <FormInput v-model="prayer.range" title="Range" :validationStatus="validRange" />
    </div>
  </div>
</template>

<style scoped></style>
