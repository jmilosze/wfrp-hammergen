<script setup lang="ts">
import { Visibility, NEW_ID } from "@/services/wh/core/entity.ts";
import { defaultSource } from "@/services/wh/core/source.ts";
import { Trait, traitApi } from "@/services/wh/content/trait.ts";
import { useWhEdit } from "@/composables/whEdit.ts";
import ContentEditorPage from "@/components/content/edit/ContentEditorPage.vue";
import { authRequest } from "@/services/auth.ts";
import { computed } from "vue";
import LabelledCheckbox from "@/components/form/LabelledCheckbox.vue";
import HelpButton from "@/components/ui/HelpButton.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import FormTextarea from "@/components/form/FormTextarea.vue";
import ModifiersBlock from "@/components/content/edit/ModifiersBlock.vue";

const props = defineProps<{
  id: string;
}>();

const newTrait = new Trait({
  name: "New trait",
  id: NEW_ID,
  visibility: Visibility.Shared,
  source: defaultSource(),
});

const editor = useWhEdit(newTrait, traitApi(authRequest));
const { wh, edition, canEdit } = editor;

await editor.loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
</script>

<template>
  <ContentEditorPage :id="id" :edit="editor" propertyName="Creature trait" list="traits">
    <template #toolbar>
      <div class="flex items-center gap-2">
        <LabelledCheckbox v-model="wh.hasValue" title="Takes a value?" :disabled="!canEdit" />
        <HelpButton modalHeader="Takes a value">
          <p class="my-1">
            Some creature traits come with a value written in brackets after the name, such as a number in Ward (8) or a
            target in Hatred (Elves).
          </p>
          <p class="my-1">
            Tick this for such a trait. When it is added to a character, the character editor then asks for its value.
          </p>
        </HelpButton>
      </div>
    </template>
    <SheetTable class="my-4">
      <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
    </SheetTable>
    <SheetCard title="Description" class="my-4">
      <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
    </SheetCard>
    <ModifiersBlock v-model="wh.modifiers" :edition="edition" :disabled="!canEdit" class="my-4" />
  </ContentEditorPage>
</template>
