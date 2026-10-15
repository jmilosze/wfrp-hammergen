<script setup lang="ts">
import { Visibility } from "../../../services/wh/core/entity.ts";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import ContentEditorPage from "../../../components/ContentEditorPage.vue";
import { authRequest } from "../../../services/auth.ts";
import { Mutation, mutationApi, mutationTypeList, printMutationType } from "../../../services/wh/content/mutation.ts";
import { computed, ref } from "vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SectionCard from "../../../components/SectionCard.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import CharacterModifiersBlock from "../../../components/CharacterModifiersBlock.vue";

const props = defineProps<{
  id: string;
}>();

const newMutation = new Mutation({
  name: "New mutation",
  id: "create",
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newMutation, mutationApi(authRequest));
const { wh, edition, canEdit } = editor;

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());

const typeOptions = ref(mutationTypeList.map((x) => ({ text: printMutationType(x), value: x })));
</script>

<template>
  <ContentEditorPage :id="id" :edit="editor" propertyName="Mutation" list="mutations">
    <SheetTable :columns="2" class="my-4">
      <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
      <SheetSelect v-model="wh.type" title="Type" :options="typeOptions" :disabled="!canEdit" />
    </SheetTable>
    <SectionCard title="Description" class="my-4">
      <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
    </SectionCard>
    <CharacterModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit" class="my-4" />
  </ContentEditorPage>
</template>

<style scoped></style>
