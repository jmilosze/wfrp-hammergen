<script setup lang="ts">
import { Visibility, NEW_ID } from "@/services/wh/core/entity.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { useWhEdit } from "@/composables/whEdit.ts";
import ContentEditorPage from "@/components/content/edit/ContentEditorPage.vue";
import { authRequest } from "@/services/auth.ts";
import { Mutation, mutationApi, mutationTypeList, printMutationType } from "@/services/wh/content/mutation.ts";
import { computed, ref } from "vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import ModifiersBlock from "@/components/content/edit/ModifiersBlock.vue";

const props = defineProps<{
  id: string;
}>();

const newMutation = new Mutation({
  name: "New mutation",
  id: NEW_ID,
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
    <SheetCard title="Description" class="my-4">
      <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
    </SheetCard>
    <ModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit" class="my-4" />
  </ContentEditorPage>
</template>
