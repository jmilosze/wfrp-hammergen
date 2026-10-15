<script setup lang="ts" generic="T extends WhProperty">
import { Ref } from "vue";
import { WhProperty } from "../services/wh/core/entity.ts";
import { WhEdit } from "../composables/whEdit.ts";
import AlertBlock from "./AlertBlock.vue";
import EditionSwitch from "./EditionSwitch.vue";
import PageHeader from "./PageHeader.vue";
import MissingEditionVariant from "./MissingEditionVariant.vue";
import PublicPropertyBox from "./PublicPropertyBox.vue";
import SourceTable from "./SourceTable.vue";
import EditControls from "./EditControls.vue";
import DeleteBlock from "./DeleteBlock.vue";

// A content editor page (career, skill, spell…) around the editor's own fields (the slot): the load errors, the
// edition switch, the title, the notice when the edition has no variant, then the variant: the toolbar slot (e.g.
// "Group skill") with the visibility, the fields, the sources, and Save and Delete. id: the route's id ("create" for a
// new entry). propertyName: what is edited, e.g. "Quality/flaw". list: the list page's route, where Save and Delete
// return to. lists: other content the editor loads (e.g. the skills a career offers), whose load errors are shown too.
type LoadState = { apiError: Ref<string>; showApiError: Ref<boolean> };

const props = defineProps<{
  edit: WhEdit<T>;
  id: string;
  propertyName: string;
  list: string;
  lists?: LoadState[];
}>();

// The editor never changes, so its state is taken apart once.
const {
  wh,
  edition,
  hasVariant,
  addVariant,
  canEdit,
  initSources,
  apiError,
  showApiError,
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = props.edit;

function hideError(state: LoadState) {
  state.showApiError.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
    <template v-for="(state, i) in lists" :key="i">
      <AlertBlock v-if="state.apiError.value && state.showApiError.value" alertType="red" @close="hideError(state)">
        {{ state.apiError.value }}
      </AlertBlock>
    </template>
  </div>
  <div class="flex justify-center my-2">
    <EditionSwitch v-model="edition" longNames />
  </div>
  <PageHeader
    :title="
      id === 'create'
        ? `Create ${propertyName.toLowerCase()}`
        : canEdit
          ? `Edit ${propertyName.toLowerCase()}`
          : wh.name
    "
  />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    :propertyName="propertyName"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <slot name="toolbar" />
      <PublicPropertyBox v-model="wh.visibility" :propertyName="propertyName" :disabled="!canEdit" />
    </div>
    <slot />
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
        :propertyName="propertyName"
        :saving="submissionState.status === 'inProgress'"
        :list="list"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        :propertyName="propertyName"
        :name="wh.name"
        :list="list"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>
