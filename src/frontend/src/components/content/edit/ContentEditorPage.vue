<script setup lang="ts" generic="T extends WhProperty">
import { WhProperty } from "../../../services/wh/core/entity.ts";
import { WhEdit } from "../../../composables/whEdit.ts";
import LoadErrors from "../../ui/LoadErrors.vue";
import { LoadState } from "../../../composables/whList.ts";
import EditionSwitch from "../../edition/EditionSwitch.vue";
import PageHeader from "../../ui/PageHeader.vue";
import MissingEditionVariant from "./MissingEditionVariant.vue";
import VisibilityField from "../../editor/VisibilityField.vue";
import SourceTable from "./SourceTable.vue";
import EditorFooter from "../../editor/EditorFooter.vue";

// A content editor page (career, skill, spell…) around the editor's own fields (the slot): the load errors, the
// edition switch, the title, the notice when the edition has no variant, then the variant: the toolbar slot (e.g.
// "Group skill") with the visibility, the fields, the sources, and Save and Delete. id: the route's id ("create" for a
// new entry). propertyName: what is edited, e.g. "Quality/flaw". list: the list page's route, where Save and Delete
// return to. lists: other content the editor loads (e.g. the skills a career offers), whose load errors are shown too.
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
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = props.edit;
// The editor's own load error first, then the other lists'.
const loadStates: LoadState[] = [props.edit, ...(props.lists ?? [])];
</script>

<template>
  <LoadErrors :states="loadStates" />
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
      <VisibilityField v-model="wh.visibility" :propertyName="propertyName" :disabled="!canEdit" />
    </div>
    <slot />
    <SourceTable
      :key="edition"
      :edition="edition"
      :disabled="!canEdit"
      :sources="wh.source"
      class="my-4"
      @selected="(e) => wh.updateSource(e)"
    />
  </template>
  <EditorFooter
    v-show="hasVariant"
    :id="id"
    :propertyName="propertyName"
    :name="wh.name"
    :list="list"
    :canEdit="canEdit"
    :hasChanged="hasChanged"
    :submissionState="submissionState"
    :showSubmissionStatus="showSubmissionStatus"
    :submitForm="submitForm"
    :resetForm="resetForm"
    :deleteItem="deleteItem"
  />
</template>
