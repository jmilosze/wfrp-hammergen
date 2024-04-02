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
  itemTypeList,
  printAvailability,
  printItemType,
} from "../../../services/wh/item.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import FormInput from "../../../components/FormInput.vue";
import SelectInput from "../../../components/SelectInput.vue";

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

const typeOpts = itemTypeList.map((x) => ({ text: printItemType(x), value: x }));
const availOpts = availabilityList.map((x) => ({ text: printAvailability(x), value: x }));
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
