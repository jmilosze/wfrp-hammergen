<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { Prayer, prayerApi } from "../../../services/wh/content/prayer.ts";
import { computed } from "vue";
import { authRequest } from "../../../services/auth.ts";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import { useWhEdit } from "../../../composables/whEdit.ts";
import ContentEditorPage from "../../../components/ContentEditorPage.vue";
import { defaultSource } from "../../../services/wh/core/source.ts";

const props = defineProps<{
  id: string;
}>();

const newPrayer = new Prayer({
  name: "New prayer",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newPrayer, prayerApi(authRequest));
const { wh, canEdit } = editor;

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validRange = computed(() => wh.value.validateRange());
const validTarget = computed(() => wh.value.validateTarget());
const validDuration = computed(() => wh.value.validateDuration());
</script>

<template>
  <ContentEditorPage :id="id" :edit="editor" propertyName="Prayer" list="prayers">
    <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
      <SheetTable class="flex-1 self-start w-full">
        <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
        <SheetField v-model="wh.range" title="Range" :validationStatus="validRange" :disabled="!canEdit" />
        <SheetField v-model="wh.target" title="Target" :validationStatus="validTarget" :disabled="!canEdit" />
        <SheetField v-model="wh.duration" title="Duration" :validationStatus="validDuration" :disabled="!canEdit" />
      </SheetTable>
      <SectionCard title="Description" class="flex-1">
        <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare size="beside" />
      </SectionCard>
    </div>
  </ContentEditorPage>
</template>

<style scoped></style>
