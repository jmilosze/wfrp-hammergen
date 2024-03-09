<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { computed, ref } from "vue";
import { authRequest } from "../../../services/auth.ts";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import PublicPropertyBox from "../../../components/ListWh/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { copySource, defaultSource } from "../../../services/wh/source.ts";

const props = defineProps<{
  id: string;
}>();

const newPrayer = new Prayer({
  name: "New prayer",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { wh, apiError, showApiError, loadWh, submitForm, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useWhEdit(newPrayer, new PrayerApi(authRequest));

if (props.id !== "create") {
  await loadWh(props.id);
}

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validRange = computed(() => wh.value.validateRange());
const validTarget = computed(() => wh.value.validateTarget());
const validDuration = computed(() => wh.value.validateDuration());

const initSources = ref(copySource(wh.value.source));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create prayer' : wh.canEdit ? 'Edit prayer' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
    <div class="my-3 flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.range" title="Range" :validationStatus="validRange" :disabled="!wh.canEdit" />
        <FormInput v-model="wh.target" title="Target" :validationStatus="validTarget" :disabled="!wh.canEdit" />
        <FormInput v-model="wh.duration" title="Duration" :validationStatus="validDuration" :disabled="!wh.canEdit" />
      </div>
    </div>
  </div>

  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable :initSources="initSources"></SourceTable>
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Prayer" :disabled="!wh.canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit"
      @close="showSubmissionStatus = false"
    />

    <EditControls
      :saving="submissionState.status === 'inProgress'"
      list="prayers"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
