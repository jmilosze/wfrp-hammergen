<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import NoteModal from "./NoteModal.vue";
import ActionMenu from "@/components/ui/ActionMenu.vue";
import { ActionMenuItem } from "@/components/ui/actionMenu.ts";
import AppButton from "@/components/ui/AppButton.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import { Item, printItemType } from "@/services/wh/content/item.ts";
import { ValidationStatus } from "@/utils/validation.ts";
import { truncate } from "@/utils/string.ts";
import TextLink from "@/components/ui/TextLink.vue";
import Edition4eBadge from "@/components/edition/Edition4eBadge.vue";
import { idFilter } from "@/components/filter/contentFilter.ts";
import { itemFilters } from "@/components/filter/itemFilters.ts";
import { IdNumberValue, MAX_ITEM_VALUE_LENGTH, printItemWithValue } from "@/utils/idNumberValue.ts";
import { ItemLocation } from "@/services/wh/character/character.ts";

const DESC_CHARS = 100;

type Location = ItemLocation;

// What the trappings show of an item; built once per item list.
type ItemInfo = {
  id: string;
  name: string;
  description: string;
  itemType: string;
  canBeEquipped: boolean;
  canBeCarried: boolean;
};

const props = defineProps<{
  disabled?: boolean;
  itemList: Item[];
  // The character's trappings (item, quantity and note), read directly (the parent changes them on the emitted events).
  equipped: IdNumberValue[];
  carried: IdNumberValue[];
  stored: IdNumberValue[];
  equippedValidationStatus: ValidationStatus;
  storedValidationStatus: ValidationStatus;
  carriedValidationStatus: ValidationStatus;
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

// addItem adds a new row of the trapping, quantity 1 without a note (the popup); updateItem changes one entry of a list, by its index
// (quantity, note; quantity 0 removes it); move shifts one of an entry to another list, keeping its note.
const emit = defineEmits<{
  (e: "addItem", value: { location: Location; id: string }): void;
  (e: "updateItem", value: { location: Location; index: number; number?: number; value?: string }): void;
  (e: "move", value: { from: Location; index: number; to: Location }): void;
  (e: "reload"): void;
  (e: "addClassItems"): void;
}>();

// The sections read the character's lists (equipped, carried and stored) directly. The parent changes them in place,
// which updates the sections; nothing here copies the item list on an edit.
const records = computed<Record<Location, IdNumberValue[]>>(() => ({
  equipped: props.equipped,
  carried: props.carried,
  stored: props.stored,
}));

const itemInfo = computed(
  () =>
    new Map<string, ItemInfo>(
      props.itemList.map((item) => [
        item.id,
        {
          id: item.id,
          name: item.name,
          description: truncate(item.description, DESC_CHARS),
          itemType: printItemType(item.type),
          canBeEquipped: item.canBeEquipped(),
          canBeCarried: item.canBeCarried(),
        },
      ]),
    ),
);

// The popup filters trappings by type and group.
const filter = computed(() => idFilter({ type: itemFilters.type, group: itemFilters.group }, props.itemList));

// The trappings of a location, by name and note; each keeps the index of its entry. Entries of unknown items are
// skipped.
function sectionItems(location: Location) {
  return records.value[location]
    .flatMap((entry, index) => {
      const info = itemInfo.value.get(entry.id);
      return info ? [{ ...info, number: entry.number, value: entry.value, index: index }] : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));
}

// Trappings are added straight to any of the three lists, each with its own popup. Moves go through Carried: Equip and
// Unequip between Carried and Equipped, Store and Carry between Carried and Stored/Assets. Each move shifts one
// trapping.

const PICKER_TITLES: Record<Location, string> = {
  equipped: "Equipped trappings",
  carried: "Carried trappings",
  stored: "Stored trappings and assets",
};

const pickerLocation = ref<Location>("carried");
const modalOpen = ref(false);

function onAddClick(location: Location) {
  if (props.loading) {
    return;
  }
  pickerLocation.value = location;
  modalOpen.value = true;
}

// The popup's rows are made when it opens (and when the item list changes). Like traits that take a value, every
// trapping has Add, which adds a new row of it (quantity 1, no note), and shows how many rows of it the list has, with or
// without notes; each popup row reads that from the list as it is shown, so adding doesn't rebuild them. Quantities and
// notes are changed in the trappings' rows.
const pickerItems = computed(() => {
  const location = pickerLocation.value;
  const record = records.value[location];
  return [...itemInfo.value.values()]
    .filter(
      (x) =>
        location === "stored" ||
        (location === "carried" && x.canBeCarried) ||
        (location === "equipped" && x.canBeEquipped),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((x) => ({
      id: x.id,
      name: x.name,
      description: x.description,
      note: x.itemType,
      repeatable: true,
      get count() {
        return record.filter((entry) => entry.id === x.id).length;
      },
      get selected() {
        return record.some((entry) => entry.id === x.id);
      },
    }));
});

type Row = ReturnType<typeof sectionItems>[number];

// The actions of a row: its buttons in a wide card, its menu in a narrow one (the cross stays in the row either way).
function rowActions(item: Row, location: Location): ActionMenuItem[] {
  const actions: ActionMenuItem[] = [
    {
      label: "Note",
      icon: "lucide:sticky-note",
      title: `Note for ${printItemWithValue(item.name, item.value)}`,
      action: () => onNoteClick(location, item.index, item.name, item.value),
    },
  ];
  if (location === "equipped") {
    actions.push({
      label: "Unequip",
      icon: "lucide:arrow-down",
      disabled: !(item.number >= 1),
      action: () => move(item.index, "equipped", "carried"),
    });
  } else if (location === "carried") {
    actions.push(
      {
        label: "Equip",
        icon: "lucide:arrow-up",
        disabled: !item.canBeEquipped || !(item.number >= 1),
        title: item.canBeEquipped ? undefined : "This trapping can't be equipped",
        action: () => move(item.index, "carried", "equipped"),
      },
      {
        label: "Store",
        icon: "lucide:arrow-down",
        disabled: !(item.number >= 1),
        action: () => move(item.index, "carried", "stored"),
      },
    );
  } else {
    actions.push({
      label: "Carry",
      icon: "lucide:arrow-up",
      disabled: !item.canBeCarried || !(item.number >= 1),
      title: item.canBeCarried ? undefined : "This trapping can't be carried",
      action: () => move(item.index, "stored", "carried"),
    });
  }
  return actions;
}

function move(index: number, from: Location, to: Location) {
  emit("move", { from: from, index: index, to: to });
}

// An emptied quantity gives NaN, which validation then reports.
function onQuantityInput(index: number, location: Location, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const number = event.target.value === "" ? Number.NaN : Number(event.target.value);
  emit("updateItem", { location: location, index: index, number: number });
}

// The note of a row is edited in a small popup.
const NOTE_HINT = `At most ${MAX_ITEM_VALUE_LENGTH} characters, e.g. "Axe" or "with a Footman". Leave it empty for none.`;
const noteOpen = ref(false);
const noteRow = ref<{ location: Location; index: number; name: string; value: string }>({
  location: "carried",
  index: 0,
  name: "",
  value: "",
});

function onNoteClick(location: Location, index: number, name: string, value: string) {
  noteRow.value = { location: location, index: index, name: name, value: value };
  noteOpen.value = true;
}

function saveNote(value: string) {
  emit("updateItem", { location: noteRow.value.location, index: noteRow.value.index, value: value });
}

const sections = computed(() => [
  { location: "equipped" as const, title: "Equipped", items: sectionItems("equipped") },
  { location: "carried" as const, title: "Carried", items: sectionItems("carried") },
  { location: "stored" as const, title: "Stored/Assets", items: sectionItems("stored") },
]);
</script>

<template>
  <div class="@container">
    <SheetCard title="Trappings" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:plus" variant="neutral" :disabled="props.loading" @click="emit('addClassItems')">
          Add class trappings
        </AppButton>
      </template>
      <template v-for="section in sections" :key="section.location">
        <div
          class="flex flex-wrap items-center justify-between gap-2 px-2 py-1 bg-neutral-100 border-b border-neutral-300 font-semibold"
        >
          {{ section.title }}
          <AppButton
            v-if="!disabled"
            icon="lucide:plus"
            :disabled="props.loading"
            @click="onAddClick(section.location)"
          >
            Add
          </AppButton>
        </div>
        <div v-if="section.items.length === 0" class="px-2 py-2 border-b border-neutral-300 text-neutral-500">None</div>
        <div
          v-for="item in section.items"
          :key="`${item.id}-${item.index}`"
          class="flex flex-wrap items-center gap-x-2 gap-y-1 px-2 py-1 min-h-10 border-b border-neutral-300 bg-white transition-colors duration-100 hover:bg-neutral-100"
        >
          <span class="flex-1 min-w-20">
            <TextLink routeName="item" :params="{ id: item.id }">{{ item.name }}</TextLink>
            <Edition4eBadge v-if="fourEIds?.has(item.id)" />
            <span v-if="item.value" class="block font-sans text-xs text-neutral-600">{{ item.value }}</span>
          </span>
          <!-- The move buttons sit just before the quantity; quantity and cross end every row, so they line up. In a narrow
               card the buttons give way to one menu, in their place before the quantity. -->
          <span v-if="!disabled" class="hidden @lg:flex items-center gap-2">
            <AppButton
              v-for="action in rowActions(item, section.location)"
              :key="action.label"
              :icon="action.icon"
              variant="neutral"
              iconOnlyWhenNarrow
              :disabled="action.disabled"
              :title="action.title"
              @click="action.action()"
            >
              {{ action.label }}
            </AppButton>
          </span>
          <span v-if="!disabled" class="@lg:hidden">
            <ActionMenu
              :label="`Actions for ${printItemWithValue(item.name, item.value)}`"
              :items="rowActions(item, section.location)"
            />
          </span>
          <span v-if="disabled" class="w-14 text-right pr-2">
            {{ item.number }}
          </span>
          <input
            v-else
            :value="item.number"
            type="number"
            :aria-label="`Quantity of ${printItemWithValue(item.name, item.value)}`"
            class="w-14 min-h-8 px-2 border border-neutral-400 rounded-sm bg-editable outline-neutral-700 focus:outline-2"
            @input="onQuantityInput(item.index, section.location, $event)"
          />
          <IconButton
            v-if="!disabled"
            icon="lucide:x"
            :label="`Remove ${printItemWithValue(item.name, item.value)} from ${section.title}`"
            @click="emit('updateItem', { location: section.location, index: item.index, number: 0 })"
          />
        </div>
      </template>
    </SheetCard>
    <div class="text-sm text-error mt-1" :class="[equippedValidationStatus.valid ? 'hidden' : '']">
      {{ equippedValidationStatus.message }}
    </div>
    <div class="text-sm text-error mt-1" :class="[carriedValidationStatus.valid ? 'hidden' : '']">
      {{ carriedValidationStatus.message }}
    </div>
    <div class="text-sm text-error mt-1" :class="[storedValidationStatus.valid ? 'hidden' : '']">
      {{ storedValidationStatus.message }}
    </div>
    <NoteModal
      v-model:open="noteOpen"
      :name="noteRow.name"
      :value="noteRow.value"
      :maxlength="MAX_ITEM_VALUE_LENGTH"
      :hint="NOTE_HINT"
      @save="saveNote"
    />
    <ModalWindow v-model:open="modalOpen" size="lg" fullHeight>
      <template #header>
        {{ PICKER_TITLES[pickerLocation] }}
      </template>
      <ChecklistPicker
        :items="pickerItems"
        routeName="item"
        :loading="props.loading"
        :fourEIds="fourEIds"
        :filter="filter"
        @add="(id) => emit('addItem', { location: pickerLocation, id: id })"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>
