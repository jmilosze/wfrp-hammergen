<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import IconButton from "@/components/ui/IconButton.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SheetList from "@/components/sheet/SheetList.vue";
import { truncate } from "@/utils/string.ts";
import TextLink from "@/components/ui/TextLink.vue";
import Edition4eBadge from "@/components/edition/Edition4eBadge.vue";
import { IdFilter } from "@/components/filter/contentFilter.ts";

type Entity = { name: string; id: string; description: string };

// Picks entries of itemList; selected is the picked ids, read directly (the parent changes it on the emitted events).
const props = defineProps<{
  title: string;
  itemList: Entity[];
  selected: Set<string>;
  routeName: RouteName;
  disabled?: boolean;
  modalTitle?: string;
  loading?: boolean;
  // Each row gets a cross that deselects it.
  removable?: boolean;
  disableDescription?: boolean;
  truncateModalDescription?: number;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
  // The content type's filters, offered in the popup.
  filter?: IdFilter;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "reload"): void;
}>();

const byName = (a: Entity, b: Entity) => a.name.localeCompare(b.name);

const selectedItems = computed(() =>
  props.itemList
    .filter((x) => props.selected.has(x.id))
    .sort(byName)
    .map((x) => ({ id: x.id, name: x.name, description: truncate(x.description, props.truncateModalDescription) })),
);

// Popup rows are made once per list; each reads whether it is picked through a getter, so ticking redraws only its own
// row.
const modalItems = computed(() =>
  [...props.itemList].sort(byName).map((x) => ({
    id: x.id,
    name: x.name,
    description: truncate(x.description, props.truncateModalDescription),
    get selected() {
      return props.selected.has(x.id);
    },
  })),
);

const modalOpen = ref(false);

const showRemove = computed(() => props.removable && !props.disabled);
// The title cell spans the remove column, which has no header, so the actions sit at the right edge.
const titleColspan = computed(() => (props.disableDescription ? 1 : 2) + (showRemove.value ? 1 : 0));

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}
</script>

<template>
  <div>
    <SheetList :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="titleColspan">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</AppButton>
      </template>
      <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-100">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(src.id)" />
        </td>
        <td v-if="!disableDescription" class="hidden @sm:table-cell py-2 px-2 border-b border-neutral-300">
          {{ src.description }}
        </td>
        <td v-if="showRemove" class="py-2 px-2 border-b border-neutral-300 w-0">
          <IconButton
            icon="lucide:x"
            :label="`Remove ${src.name}`"
            @click="emit('selected', { id: src.id, selected: false })"
          />
        </td>
      </tr>
    </SheetList>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header> {{ modalTitle }} </template>
      <ChecklistPicker
        :items="modalItems"
        :routeName="routeName"
        :loading="props.loading"
        :fourEIds="fourEIds"
        :filter="filter"
        @toggle="(e) => emit('selected', e)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>
