<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import Header from "../../../components/PageHeader.vue";
import {
  ItemProperty,
  itemPropertyApi,
  itemPropertyTypeList,
  printItemPropertyType,
} from "../../../services/wh/content/itemproperty.ts";
import { computed, ref } from "vue";
import { authRequest } from "../../../services/auth.ts";
import CheckboxInput from "../../../components/CheckboxInput.vue";
import HintModal from "../../../components/HintModal.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import EditorEditionSelector from "../../../components/EditorEditionSelector.vue";
import MissingEditionVariant from "../../../components/MissingEditionVariant.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import SourceTable from "../../../components/SourceTable.vue";
import { defaultSource } from "../../../services/wh/core/source.ts";
import LabelPicker from "../../../components/LabelPicker.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SectionCard from "../../../components/SectionCard.vue";
import { itemTypeList, printItemType } from "../../../services/wh/content/item.ts";

const props = defineProps<{
  id: string;
}>();

const newItemProperty = new ItemProperty({
  name: "New quality",
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
} = useWhEdit(newItemProperty, itemPropertyApi(authRequest));

await loadWh(props.id);

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
  <EditorEditionSelector v-model="edition" />
  <Header :title="id === 'create' ? 'Create quality/flaw' : canEdit ? 'Edit quality/flaw' : wh.name" />
  <MissingEditionVariant
    v-if="!hasVariant"
    :edition="edition"
    :canEdit="canEdit"
    propertyName="Quality/flaw"
    @add="addVariant"
  />
  <template v-if="hasVariant">
    <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
      <div class="flex items-center gap-2">
        <CheckboxInput v-model="wh.hasValue" title="Takes a value?" :disabled="!canEdit" />
        <HintModal modalHeader="Takes a value" modalId="propertyValueHint">
          <p class="my-1">
            Some qualities and flaws come with a value written in brackets after the name, such as a number in Blast
            (3).
          </p>
          <p class="my-1">
            Tick this for such a quality or flaw. When it is added to a trapping, the trapping editor then asks for its
            value.
          </p>
        </HintModal>
      </div>
      <PublicPropertyBox v-model="wh.visibility" propertyName="Quality/flaw" :disabled="!canEdit" />
    </div>
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable>
          <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <SheetSelect v-model="wh.type" title="Type" :options="typeOptions" :disabled="!canEdit" />
          <LabelPicker
            v-model="wh.applicableTo"
            title="Applicable to"
            :options="applicableToOptions"
            :disabled="!canEdit"
            sheetRow
          />
        </SheetTable>
      </div>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SectionCard>
    </div>

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
        propertyName="Quality/flaw"
        :saving="submissionState.status === 'inProgress'"
        list="properties"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Quality/flaw"
        :name="wh.name"
        list="properties"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
