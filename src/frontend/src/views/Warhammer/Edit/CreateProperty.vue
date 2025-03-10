<script setup lang="ts">
import Header from "../../../components/PageHeader.vue";
import {
  ItemProperty,
  ItemPropertyApi,
  itemPropertyTypeList,
  printItemPropertyType,
} from "../../../services/wh/itemproperty.ts";
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
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import SelectInput from "../../../components/SelectInput.vue";
import MultipleCheckboxColumnInput from "../../../components/MultipleCheckboxColumnInput.vue";
import { itemTypeList, printItemType } from "../../../services/wh/item.ts";

const props = defineProps<{
  id: string;
}>();

const newItemProperty = new ItemProperty({
  name: "New quality",
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
} = useWhEdit(newItemProperty, new ItemPropertyApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref<HTMLDivElement | null>(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const typeOptions = ref(itemPropertyTypeList.map((x) => ({ text: printItemPropertyType(x), value: x })));
const applicableToOptions = ref(itemTypeList.map((x) => ({ text: printItemType(x), value: x })));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create quality/flaw' : wh.canEdit ? 'Edit quality/flaw' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <SelectInput v-model="wh.type" :options="typeOptions" :disabled="!wh.canEdit" title="Type" />
        <MultipleCheckboxColumnInput
          v-model="wh.applicableTo"
          :options="applicableToOptions"
          :disabled="!wh.canEdit"
          :viewBreakpoint="[
            { columns: 3, view: ViewSize.xs },
            { columns: 2, view: ViewSize.xxs },
          ]"
          title="Applicable to"
        />
      </div>
    </div>
    <div class="flex-1">
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
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <SourceTable :disabled="!wh.canEdit" :initSources="initSources" @selected="(e) => wh.updateSource(e)" />
    </div>
    <div class="flex-1">
      <PublicPropertyBox v-model="wh.shared" propertyName="Quality/flaw" :disabled="!wh.canEdit" />
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
      list="properties"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    />
  </div>
</template>

<style scoped></style>
