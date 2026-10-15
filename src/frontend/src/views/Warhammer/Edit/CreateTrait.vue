<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { Trait, traitApi } from "../../../services/wh/content/trait.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { computed } from "vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import CheckboxInput from "../../../components/CheckboxInput.vue";
import HintModal from "../../../components/HintModal.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
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

  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create creature trait' : canEdit ? 'Edit creature trait' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Creature trait"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <div class="flex items-center gap-2">
        <CheckboxInput v-model="wh.hasValue" title="Takes a value?" :disabled="!canEdit" />
        <HintModal modalHeader="Takes a value">
          <p class="my-1">
            Some creature traits come with a value written in brackets after the name, such as a number in Ward (8) or a
            target in Hatred (Elves).
          </p>
          <p class="my-1">
            Tick this for such a trait. When it is added to a character, the character editor then asks for its value.
          </p>
        </HintModal>
      </div>
      <PublicPropertyBox v-model="wh.visibility" propertyName="Creature trait" :disabled="!canEdit" />
    </div>
    <SheetTable class="my-4">
      <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
    </SheetTable>
    <SectionCard title="Description" class="my-4">
      <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
    </SectionCard>
    <CharacterModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit" class="my-4" />
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
        propertyName="Creature trait"
        :saving="submissionState.status === 'inProgress'"
        list="traits"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Creature trait"
        :name="wh.name"
        list="traits"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
