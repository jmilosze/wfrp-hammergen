<script setup lang="ts">
import { Visibility } from "../../../services/wh/common.ts";
import Header from "../../../components/PageHeader.vue";
import { Prayer, prayerApi } from "../../../services/wh/prayer.ts";
import { computed } from "vue";
import { authRequest } from "../../../services/auth.ts";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { defaultSource } from "../../../services/wh/source.ts";

const props = defineProps<{
  id: string;
}>();

const newPrayer = new Prayer({
  name: "New prayer",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const {
  wh,
  canEdit,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newPrayer, prayerApi(authRequest));

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validRange = computed(() => wh.value.validateRange());
const validTarget = computed(() => wh.value.validateTarget());
const validDuration = computed(() => wh.value.validateDuration());
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create prayer' : canEdit ? 'Edit prayer' : wh.name" />
  <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!canEdit"
        />
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.range" title="Range" :validationStatus="validRange" :disabled="!canEdit" />
        <FormInput v-model="wh.target" title="Target" :validationStatus="validTarget" :disabled="!canEdit" />
        <FormInput v-model="wh.duration" title="Duration" :validationStatus="validDuration" :disabled="!canEdit" />
      </div>
    </div>
  </div>

  <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
    <div class="flex-1">
      <SourceTable :disabled="!canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="flex-1">
      <PublicPropertyBox v-model="wh.visibility" propertyName="Prayer" :disabled="!canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit my-2"
      @close="showSubmissionStatus = false"
    />

    <EditControls
      :saving="submissionState.status === 'inProgress'"
      list="prayers"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!canEdit"
    />

    <DeleteBlock
      v-if="id !== 'create' && canEdit"
      propertyName="Prayer"
      :name="wh.name"
      list="prayers"
      :deleteItem="deleteItem"
    />
  </div>
</template>

<style scoped></style>
