<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import {
  availabilityList,
  Item,
  ItemApi,
  ItemType,
  itemTypeList,
  printAvailability,
  printItemType,
} from "../../../services/wh/item.ts";
import { computed, ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import EditControls from "../../../components/EditControls.vue";
import SourceTable from "../../../components/SourceTable.vue";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";

const props = defineProps<{
  id: string;
}>();

const newItem = new Item({
  name: "New item",
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

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
} = useWhEdit(newItem, new ItemApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validPrice = computed(() => wh.value.validatePrice());
const validEnc = computed(() => wh.value.validateEnc());

const validMeleeSbDmgMult = computed(() => wh.value.validateMeleeDmgSbMult());
const validMeleeDmg = computed(() => wh.value.validateMeleeDmg());

const typeOpts = itemTypeList.map((x) => ({ text: printItemType(x), value: x }));
const availOpts = availabilityList.map((x) => ({ text: printAvailability(x), value: x }));

watch(
  () => wh.value.type,
  () => {
    wh.value.resetDetails();
  },
);
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create trapping' : wh.canEdit ? 'Edit trapping' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit" />
        <SelectInput
          v-model="wh.type"
          :options="typeOpts"
          :disabled="!wh.canEdit"
          title="Type"
          class="min-w-24"
        ></SelectInput>
        <SelectInput
          v-model="wh.availability"
          :options="availOpts"
          :disabled="!wh.canEdit"
          title="Availability"
          class="min-w-24"
        ></SelectInput>
        <FormInput v-model="wh.price" title="Price (in brass)" :validationStatus="validPrice" :disabled="!wh.canEdit" />
        <FormInput v-model="wh.enc" title="Encumbrance" :validationStatus="validEnc" :disabled="!wh.canEdit" />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
        />
      </div>
    </div>
    <div class="flex-1">
      <div v-if="wh.type === ItemType.Melee" class="flex flex-col gap-4">
        <div>
          <p class="mb-1">Weapon damage</p>
          <div class="flex">
            <div class="shrink-0 mr-4 pt-2">SB x</div>
            <FormInput
              v-model="wh.melee.dmgSbMult"
              :validationStatus="validMeleeSbDmgMult"
              :disabled="!wh.canEdit"
              class="min-w-14"
            />
            <div class="shrink-0 mx-4 pt-2">+</div>
            <FormInput
              v-model="wh.melee.dmg"
              :validationStatus="validMeleeDmg"
              :disabled="!wh.canEdit"
              type="number"
              class="min-w-14"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
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
      <PublicPropertyBox v-model="wh.shared" propertyName="Trapping" :disabled="!wh.canEdit" />
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
      list="items"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
