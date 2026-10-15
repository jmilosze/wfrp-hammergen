<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "./ModalWindow.vue";
import SectionButton from "./SectionButton.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SectionCard from "./SectionCard.vue";
import { Item, printItemType } from "../services/wh/content/item.ts";
import { ValidationStatus } from "../utils/validation.ts";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

const DESC_CHARS = 100;

type Location = "equipped" | "carried" | "stored";

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
  // The character's trappings: id to quantity, read directly (the parent changes them on the emitted events).
  equipped: Record<string, number>;
  carried: Record<string, number>;
  stored: Record<string, number>;
  equippedValidationStatus: ValidationStatus;
  storedValidationStatus: ValidationStatus;
  carriedValidationStatus: ValidationStatus;
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "equippedUpdated", value: { id: string; number: number }): void;
  (e: "carriedUpdated", value: { id: string; number: number }): void;
  (e: "storedUpdated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "addClassItems"): void;
}>();

// The sections read the character's records (equipped, carried and stored: id to quantity) directly. The parent changes
// them in place, which updates the sections; nothing here copies the item list on an edit.
const records = computed<Record<Location, Record<string, number>>>(() => ({
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

// The trappings of a location, by name; entries of unknown items are skipped.
function sectionItems(location: Location) {
  return Object.entries(records.value[location])
    .flatMap(([id, number]) => {
      const info = itemInfo.value.get(id);
      return info ? [{ ...info, number: number }] : [];
    })
    .sort((a, b) => a.name.localeCompare(b.name));
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

// The popup's rows are made when it opens (and when the item list changes); each reads its quantity from the record as
// it is shown, so typing a quantity doesn't rebuild the rows.
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
      get number() {
        return record[x.id] ?? 0;
      },
      get selected() {
        return (record[x.id] ?? 0) !== 0;
      },
    }));
});

function setNumber(id: string, location: Location, number: number) {
  if (location === "equipped") {
    emit("equippedUpdated", { id: id, number: number });
  } else if (location === "carried") {
    emit("carriedUpdated", { id: id, number: number });
  } else {
    emit("storedUpdated", { id: id, number: number });
  }
}

function move(id: string, from: Location, to: Location) {
  setNumber(id, from, (records.value[from][id] ?? 0) - 1);
  setNumber(id, to, (records.value[to][id] ?? 0) + 1);
}

// An emptied quantity gives NaN, which validation then reports.
function onQuantityInput(id: string, location: Location, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  setNumber(id, location, event.target.value === "" ? Number.NaN : Number(event.target.value));
}

const sections = computed(() => [
  { location: "equipped" as const, title: "Equipped", items: sectionItems("equipped") },
  { location: "carried" as const, title: "Carried", items: sectionItems("carried") },
  { location: "stored" as const, title: "Stored/Assets", items: sectionItems("stored") },
]);
</script>

<template>
  <div class="@container">
    <SectionCard title="Trappings" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:plus" variant="neutral" :disabled="props.loading" @click="emit('addClassItems')">
          Add class trappings
        </SectionButton>
      </template>
      <template v-for="section in sections" :key="section.location">
        <div
          class="flex flex-wrap items-center justify-between gap-2 px-2 py-1 bg-neutral-100 border-b border-neutral-300 font-semibold"
        >
          {{ section.title }}
          <SectionButton
            v-if="!disabled"
            icon="lucide:plus"
            :disabled="props.loading"
            @click="onAddClick(section.location)"
          >
            Add
          </SectionButton>
        </div>
        <div v-if="section.items.length === 0" class="px-2 py-2 border-b border-neutral-300 text-neutral-500">None</div>
        <div
          v-for="item in section.items"
          :key="item.id"
          class="flex flex-wrap items-center gap-x-2 gap-y-1 px-2 py-1 min-h-10 border-b border-neutral-300 bg-white hover:bg-neutral-100"
        >
          <span class="flex-1 min-w-20">
            <TextLink routeName="item" :params="{ id: item.id }">{{ item.name }}</TextLink>
            <Edition4eBadge v-if="fourEIds?.has(item.id)" />
          </span>
          <!-- The move buttons sit just before the quantity; quantity and cross end every row, so they line up. -->
          <span v-if="!disabled" class="flex items-center gap-2">
            <SectionButton
              v-if="section.location === 'equipped'"
              icon="lucide:arrow-down"
              variant="neutral"
              iconOnlyWhenNarrow
              :disabled="!(item.number >= 1)"
              @click="move(item.id, 'equipped', 'carried')"
            >
              Unequip
            </SectionButton>
            <template v-if="section.location === 'carried'">
              <SectionButton
                icon="lucide:arrow-up"
                variant="neutral"
                iconOnlyWhenNarrow
                :disabled="!item.canBeEquipped || !(item.number >= 1)"
                :title="item.canBeEquipped ? undefined : 'This trapping can\'t be equipped'"
                @click="move(item.id, 'carried', 'equipped')"
              >
                Equip
              </SectionButton>
              <SectionButton
                icon="lucide:arrow-down"
                variant="neutral"
                iconOnlyWhenNarrow
                :disabled="!(item.number >= 1)"
                @click="move(item.id, 'carried', 'stored')"
              >
                Store
              </SectionButton>
            </template>
            <SectionButton
              v-if="section.location === 'stored'"
              icon="lucide:arrow-up"
              variant="neutral"
              iconOnlyWhenNarrow
              :disabled="!item.canBeCarried || !(item.number >= 1)"
              :title="item.canBeCarried ? undefined : 'This trapping can\'t be carried'"
              @click="move(item.id, 'stored', 'carried')"
            >
              Carry
            </SectionButton>
          </span>
          <span v-if="disabled" class="w-14 text-right pr-2">
            {{ item.number }}
          </span>
          <input
            v-else
            :value="item.number"
            type="number"
            :aria-label="`Quantity of ${item.name}`"
            class="w-14 min-h-8 px-2 border border-neutral-400 rounded-sm bg-editable outline-neutral-700 focus:outline-2"
            @input="onQuantityInput(item.id, section.location, $event)"
          />
          <IconButton
            v-if="!disabled"
            icon="lucide:x"
            :label="`Remove ${item.name} from ${section.title}`"
            @click="setNumber(item.id, section.location, 0)"
          />
        </div>
      </template>
    </SectionCard>
    <div class="text-sm text-error mt-1" :class="[equippedValidationStatus.valid ? 'hidden' : '']">
      {{ equippedValidationStatus.message }}
    </div>
    <div class="text-sm text-error mt-1" :class="[carriedValidationStatus.valid ? 'hidden' : '']">
      {{ carriedValidationStatus.message }}
    </div>
    <div class="text-sm text-error mt-1" :class="[storedValidationStatus.valid ? 'hidden' : '']">
      {{ storedValidationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen" size="lg" fullHeight>
      <template #header>
        {{ PICKER_TITLES[pickerLocation] }}
      </template>
      <ChecklistPicker
        :items="pickerItems"
        routeName="item"
        :loading="props.loading"
        :fourEIds="fourEIds"
        numberLabel="Qty"
        @setNumber="(e) => setNumber(e.id, pickerLocation, e.number)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
