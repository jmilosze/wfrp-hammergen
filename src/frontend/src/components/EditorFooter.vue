<script setup lang="ts">
import EditControls from "./EditControls.vue";
import DeleteBlock from "./DeleteBlock.vue";
import { SubmissionState } from "../utils/submission.ts";

// The end of an editor page: Save (with Back) and, for an existing entry the user can edit, Delete. id: the route's id
// ("create" for a new entry). list: the list page's route, where Save and Delete return to.
defineProps<{
  id: string;
  propertyName: string;
  name: string;
  list: string;
  canEdit: boolean;
  hasChanged: boolean;
  submissionState: SubmissionState;
  showSubmissionStatus: boolean;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
  deleteItem: () => Promise<boolean>;
}>();
</script>

<template>
  <div class="mt-4">
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
        :name="name"
        :list="list"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>
