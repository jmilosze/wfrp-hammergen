<script setup lang="ts">
import { defaultSource } from "../../../services/wh/source.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Mutation, MutationApi, mutationTypeList, printMutationType } from "../../../services/wh/mutation.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import FormInput from "../../../components/FormInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import SourceTable from "../../../components/SourceTable.vue";
import EditControls from "../../../components/EditControls.vue";
import CharacterModifiers from "../../../components/CharacterModifiers.vue";

const props = defineProps<{
  id: string;
}>();

const newMutation = new Mutation({
  name: "New mutation",
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
} = useWhEdit(newMutation, new MutationApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const typeOptions = ref(mutationTypeList.map((x) => ({ text: printMutationType(x), value: x })));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create mutation' : wh.canEdit ? 'Edit mutation' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <SelectInput v-model="wh.type" :options="typeOptions" :disabled="!wh.canEdit" title="Type"></SelectInput>
      </div>
    </div>
    <div class="my-3 flex-1">
      <div class="flex flex-col gap-4">
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
  </div>

  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="my-3 flex-1">
      <SourceTable
        :disabled="!wh.canEdit"
        :initSources="initSources"
        @selected="(e) => wh.updateSource(e)"
      ></SourceTable>
    </div>
    <div class="my-3 flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Quality/rune" :disabled="!wh.canEdit" />
    </div>
  </div>
  <div class="mt-4">
    <CharacterModifiers
      v-model:attributes="wh.modifiers.attributes"
      v-model:size="wh.modifiers.size"
      v-model:movement="wh.modifiers.movement"
      :disabled="!wh.canEdit"
    ></CharacterModifiers>
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
      list="mutations"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
