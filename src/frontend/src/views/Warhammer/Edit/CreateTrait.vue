<script setup lang="ts">
import { defaultSource } from "../../../services/wh/source.ts";
import { Trait, TraitApi } from "../../../services/wh/trait.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";
import EditControls from "../../../components/EditControls.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";

const props = defineProps<{
  id: string;
}>();

const newTrait = new Trait({
  name: "New trait",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

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
} = useWhEdit(newTrait, new TraitApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref<HTMLDivElement | null>(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>

  <Header :title="id === 'create' ? 'Create creature trait' : wh.canEdit ? 'Edit creature trait' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" class="flex-1" />
    <FormTextarea
      v-model="wh.description"
      title="Description"
      :validationStatus="validDesc"
      :disabled="!wh.canEdit"
      class="flex-1"
    />
  </div>
  <div class="my-4">
    <CharacterModifiersBlock v-model="wh.modifiers" :disabled="!wh.canEdit" />
  </div>
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable :disabled="!wh.canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Creature trait" :disabled="!wh.canEdit" />
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
      list="traits"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    />
  </div>
</template>

<style scoped></style>
