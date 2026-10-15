<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { printRuneLabel, Rune, runeApi, runeLabelList } from "../../../services/wh/content/rune.ts";
import { computed, ref } from "vue";
import { authRequest } from "../../../services/auth.ts";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import ContentEditorPage from "../../../components/ContentEditorPage.vue";
import { defaultSource } from "../../../services/wh/core/source.ts";
import LabelPicker from "../../../components/LabelPicker.vue";
import { itemTypeList, printItemType } from "../../../services/wh/content/item.ts";

const props = defineProps<{
  id: string;
}>();

const newRune = new Rune({
  name: "New rune",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newRune, runeApi(authRequest));
const { wh, canEdit } = editor;

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const applicableToOptions = ref(itemTypeList.map((x) => ({ text: printItemType(x), value: x })));
const labelOptions = ref(runeLabelList.map((x) => ({ text: printRuneLabel(x), value: x })));
</script>

<template>
  <ContentEditorPage :id="id" :edit="editor" propertyName="Rune" list="runes">
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <div class="flex-1 flex flex-col gap-4">
        <SheetTable>
          <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
          <LabelPicker
            v-model="wh.applicableTo"
            title="Applicable to"
            :options="applicableToOptions"
            :disabled="!canEdit"
            sheetRow
          />
          <LabelPicker v-model="wh.labels" title="Labels" :options="labelOptions" :disabled="!canEdit" sheetRow />
        </SheetTable>
      </div>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SectionCard>
    </div>
  </ContentEditorPage>
</template>

<style scoped></style>
