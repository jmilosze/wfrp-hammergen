<script setup lang="ts">
import { Visibility } from "../../../services/wh/common.ts";
import { defaultSource } from "../../../services/wh/source.ts";
import { Trait, traitApi } from "../../../services/wh/trait.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed } from "vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import DoubleRadioButton from "../../../components/DoubleRadioButton.vue";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";

const props = defineProps<{
  id: string;
}>();

const newTrait = new Trait({
  name: "New trait",
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
} = useWhEdit(newTrait, traitApi(authRequest));

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>

  <Header :title="id === 'create' ? 'Create creature trait' : canEdit ? 'Edit creature trait' : wh.name" />
  <EditorEditionSelector
    v-model="edition"
    :hasVariant="hasVariant"
    :canEdit="canEdit"
    propertyName="Creature trait"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="flex-1">
        <div class="flex flex-col gap-4">
          <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <DoubleRadioButton
            v-model="wh.hasValue"
            title="Takes a value? E.g. Ward (8) or Hatred (Elves)"
            trueText="Yes"
            falseText="No"
            :disabled="!canEdit"
          />
        </div>
      </div>
      <FormTextarea
        v-model="wh.description"
        title="Description"
        :validationStatus="validDesc"
        :disabled="!canEdit"
        class="flex-1"
      />
    </div>
    <div class="my-4">
      <CharacterModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit" />
    </div>
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="my-3 flex-1">
        <SourceTable
          :edition="edition"
          :disabled="!canEdit"
          :initSources="initSources"
          @selected="(e) => wh.updateSource(e)"
        />
      </div>
      <div class="my-3 flex-1">
        <PublicPropertyBox v-model="wh.visibility" propertyName="Creature trait" :disabled="!canEdit" />
      </div>
    </div>
  </template>
  <div v-show="hasVariant" class="mt-4">
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
      :readOnly="!canEdit"
    />

    <DeleteBlock
      v-if="id !== 'create' && canEdit"
      propertyName="Creature trait"
      :name="wh.name"
      list="traits"
      :deleteItem="deleteItem"
    />
  </div>
</template>

<style scoped></style>
