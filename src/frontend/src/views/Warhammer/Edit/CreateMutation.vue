<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Mutation, mutationApi, mutationTypeList, printMutationType } from "../../../services/wh/content/mutation.ts";
import { computed, ref } from "vue";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";

const props = defineProps<{
  id: string;
}>();

const newMutation = new Mutation({
  name: "New mutation",
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
} = useWhEdit(newMutation, mutationApi(authRequest));

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const typeOptions = ref(mutationTypeList.map((x) => ({ text: printMutationType(x), value: x })));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create mutation' : canEdit ? 'Edit mutation' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Mutation"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <PublicPropertyBox v-model="wh.visibility" propertyName="Mutation" :disabled="!canEdit" />
    </div>
    <SheetTable :columns="2" class="my-4">
      <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
      <SheetSelect v-model="wh.type" title="Type" :options="typeOptions" :disabled="!canEdit" />
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
        propertyName="Mutation"
        :saving="submissionState.status === 'inProgress'"
        list="mutations"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Mutation"
        :name="wh.name"
        list="mutations"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
