<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteName } from "@/router.ts";
import SheetTitle from "@/components/sheet/SheetTitle.vue";
import { ref } from "vue";
import DeleteModal from "./DeleteModal.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { returnToPreviousPage } from "@/utils/history.ts";

const router = useRouter();

const props = defineProps<{
  propertyName: string;
  name: string;
  list: RouteName;
  deleteItem: () => Promise<boolean>;
}>();

const deleting = ref(false);
const confirmOpen = ref(false);

async function onConfirmDelete() {
  if (deleting.value) {
    return;
  }
  deleting.value = true;
  const success = await props.deleteItem();
  deleting.value = false;
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
      <AppButton icon="lucide:trash-2" variant="danger" :busy="deleting" class="shrink-0" @click="confirmOpen = true">
        Delete
      </AppButton>
    </div>
    <DeleteModal v-model:open="confirmOpen" :name="name" @deleteConfirmed="onConfirmDelete" />
  </div>
</template>
