<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
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
import { useWhEdit } from "../../../composables/whEdit.ts";
import ContentEditorPage from "../../../components/ContentEditorPage.vue";
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

const editor = useWhEdit(newItemProperty, itemPropertyApi(authRequest));
const { wh, canEdit } = editor;

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const typeOptions = ref(itemPropertyTypeList.map((x) => ({ text: printItemPropertyType(x), value: x })));
const applicableToOptions = ref(itemTypeList.map((x) => ({ text: printItemType(x), value: x })));
</script>

<template>
  <ContentEditorPage :id="id" :edit="editor" propertyName="Quality/flaw" list="properties">
    <template #toolbar>
      <div class="flex items-center gap-2">
        <CheckboxInput v-model="wh.hasValue" title="Takes a value?" :disabled="!canEdit" />
        <HintModal modalHeader="Takes a value">
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
    </template>
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
  </ContentEditorPage>
</template>

<style scoped></style>
