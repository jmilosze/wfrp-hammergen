<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { computed, ref } from "vue";
import { useAuthStore } from "../../../stores/auth.ts";
import { authRequest } from "../../../services/auth.ts";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";

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
const validTarget = computed(() => prayer.value.validateTarget());
const validDuration = computed(() => prayer.value.validateDuration());
</script>

<template>
  <Header :title="id === 'create' ? 'Create prayer' : prayer.canEdit ? 'Edit prayer' : prayer.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="m-1 my-3 flex-1">
      <div>
        <div class="flex flex-col gap-4">
          <FormInput v-model="prayer.name" title="Name" :validationStatus="validName" :disabled="!prayer.canEdit" />
          <FormTextarea
            v-model="prayer.description"
            title="Description"
            :validationStatus="validDesc"
            :disabled="!prayer.canEdit"
          />
        </div>
      </div>
    </div>
    <div class="m-1 my-3 flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="prayer.range" title="Range" :validationStatus="validRange" :disabled="!prayer.canEdit" />
        <FormInput v-model="prayer.target" title="Target" :validationStatus="validTarget" :disabled="!prayer.canEdit" />
        <FormInput
          v-model="prayer.duration"
          title="Duration"
          :validationStatus="validDuration"
          :disabled="!prayer.canEdit"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
