<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { Career, CareerApi, printSpeciesName, speciesList } from "../../../services/wh/career.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import MultipleCheckboxInput from "../../../components/MultipleCheckboxInput.vue";

const props = defineProps<{
  id: string;
}>();

const newCareer = new Career({
  name: "New career",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

const {
  wh,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newCareer, new CareerApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const speciesOpts = speciesList.map((x) => ({ text: printSpeciesName(x), value: x }));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create career' : wh.canEdit ? 'Edit career' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <MultipleCheckboxInput v-model="wh.species" title="Species" :options="speciesOpts" :disabled="!wh.canEdit" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
