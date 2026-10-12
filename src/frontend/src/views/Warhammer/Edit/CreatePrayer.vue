<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import Header from "../../../components/PageHeader.vue";
import { Prayer, prayerApi } from "../../../services/wh/content/prayer.ts";
import { computed } from "vue";
import { authRequest } from "../../../services/auth.ts";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { defaultSource } from "../../../services/wh/core/source.ts";

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
  edition,
  hasVariant,
  addVariant,
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
  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create prayer' : canEdit ? 'Edit prayer' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Prayer"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <PublicPropertyBox v-model="wh.visibility" propertyName="Prayer" :disabled="!canEdit" />
    </div>
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <SheetTable class="flex-1 self-start w-full">
        <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
        <SheetField v-model="wh.range" title="Range" :validationStatus="validRange" :disabled="!canEdit" />
        <SheetField v-model="wh.target" title="Target" :validationStatus="validTarget" :disabled="!canEdit" />
        <SheetField v-model="wh.duration" title="Duration" :validationStatus="validDuration" :disabled="!canEdit" />
      </SheetTable>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="sm" />
      </SectionCard>
    </div>

    <SourceTable
      :edition="edition"
      :disabled="!canEdit"
      :initSources="initSources"
      class="my-4"
      @selected="(e) => wh.updateSource(e)"
    />
  </template>
  <div v-show="hasVariant" class="mt-4">
    <div class="flex flex-col md:flex-row gap-4">
      <EditControls
        :submissionState="submissionState"
        :showSubmissionStatus="showSubmissionStatus"
        propertyName="Prayer"
        :saving="submissionState.status === 'inProgress'"
        list="prayers"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Prayer"
        :name="wh.name"
        list="prayers"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
