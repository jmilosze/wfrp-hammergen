<script setup lang="ts">
import SheetTitle from "./SheetTitle.vue";
import { nextTick, ref } from "vue";
import DeleteModal from "./DeleteModal.vue";
import SectionButton from "./SectionButton.vue";
import router from "../router.ts";
import { returnToPreviousPage } from "../utils/history.ts";

const props = defineProps<{
  propertyName: string;
  name: string;
  list: string;
  deleteItem: () => Promise<boolean>;
}>();

const deleting = ref(false);
const elementToDelete = ref({ id: "", name: "" });

function onDeleteClick() {
  elementToDelete.value = { id: "", name: "" };
  nextTick(() => {
    elementToDelete.value = { id: "delete", name: props.name };
  });
}

async function onConfirmDelete() {
  if (deleting.value) {
    return;
  }
  deleting.value = true;
  const success = await props.deleteItem();
  deleting.value = false;
  elementToDelete.value = { id: "", name: "" };
  if (success) {
    await returnToPreviousPage(router, props.list);
  }
}
</script>

<template>
  <div class="flex flex-col border border-neutral-400 bg-white text-left">
    <SheetTitle class="border-b border-neutral-300">Delete {{ propertyName.toLowerCase() }}</SheetTitle>
    <div class="flex grow items-center justify-between gap-2 px-2 py-1.5">
      <p class="flex-1 min-w-0 text-sm">
        The {{ propertyName.toLowerCase() }} and all its data will be deleted. It will be impossible to recover.
      </p>
      <SectionButton icon="lucide:trash-2" variant="danger" :busy="deleting" class="shrink-0" @click="onDeleteClick">
        Delete
      </SectionButton>
    </div>
    <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="onConfirmDelete" />
  </div>
</template>

<style scoped></style>
