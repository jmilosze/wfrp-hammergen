<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import IconButton from "@/components/ui/IconButton.vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import SheetList from "@/components/sheet/SheetList.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import CareerTrappingsHelp from "./CareerTrappingsHelp.vue";
import CareerTrappingEntryModal from "./CareerTrappingEntryModal.vue";
import { Item, printItemType } from "@/services/wh/content/item.ts";
import {
  CareerCoin,
  careerCoinList,
  CareerMoney,
  CareerTrapping,
  CareerTrappingEntry,
  printCareerTrappingEntry,
} from "@/services/wh/content/careerTrapping.ts";
import { truncate } from "@/utils/string.ts";
import TextLink from "@/components/ui/TextLink.vue";
import { printItemWithValue } from "@/utils/idNumberValue.ts";
import { idFilter } from "@/components/filter/contentFilter.ts";
import { itemFilters } from "@/components/filter/itemFilters.ts";
import { ValidationStatus } from "@/utils/validation.ts";

const DESC_CHARS = 100;

// The trappings and money of a career level. Each entry is a row written as the career page shows it ("Bow, 10 × Arrow
// or Pistol, 10 × Bullet and Powder"); Edit opens it in a popup (options, quantities, notes), the cross removes it. Add
// opens the item picker, where each Add is a new entry of one trapping. Money is a coin and a quantity per row. Read-only
// (the career page) the rows are text: names link to the trappings' pages, money reads "3d10 Silver".
const trappings = defineModel<CareerTrappingEntry[]>("trappings", { required: true });
const money = defineModel<CareerMoney[]>("money", { required: true });

const props = defineProps<{
  itemList: Item[];
  loading?: boolean;
  disabled?: boolean;
  validationStatus: ValidationStatus;
}>();

const emit = defineEmits<{ (e: "reload"): void }>();

const COIN_NAMES: Record<CareerCoin, string> = { gold: "Gold", silver: "Silver", brass: "Brass" };

const itemNames = computed(() => new Map(props.itemList.map((x) => [x.id, x.name])));

function nameOf(id: string): string {
  return itemNames.value.get(id) ?? "Unknown trapping";
}

// A trapping's name with its note: "Hand Weapon (Sickle)".
function named(trapping: CareerTrapping): string {
  return printItemWithValue(nameOf(trapping.id), trapping.value);
}

const filter = computed(() => idFilter({ type: itemFilters.type, group: itemFilters.group }, props.itemList));

const pickerItems = computed(() =>
  [...props.itemList]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((x) => ({
      id: x.id,
      name: x.name,
      description: truncate(x.description, DESC_CHARS),
      note: printItemType(x.type),
    })),
);

// Add: each Add is a new entry of one trapping; the picker counts the entries that have the trapping.
const pickerOpen = ref(false);

const pickerRows = computed(() =>
  pickerItems.value.map((x) => ({
    ...x,
    repeatable: true,
    get count() {
      return trappings.value.filter((entry) => entry.options.some((o) => o.some((t) => t.id === x.id))).length;
    },
    get selected() {
      return trappings.value.some((entry) => entry.options.some((o) => o.some((t) => t.id === x.id)));
    },
  })),
);

function addEntry(id: string) {
  trappings.value = [...trappings.value, { options: [[{ id: id, number: "1", value: "" }]] }];
}

function removeEntry(index: number) {
  trappings.value = trappings.value.filter((_, i) => i !== index);
}

const editOpen = ref(false);
const editIndex = ref(0);
const editEntry = computed<CareerTrappingEntry>(() => trappings.value[editIndex.value] ?? { options: [] });

function openEdit(index: number) {
  editIndex.value = index;
  editOpen.value = true;
}

function saveEntry(entry: CareerTrappingEntry) {
  trappings.value = trappings.value.map((x, i) => (i === editIndex.value ? entry : x));
}

function addMoney() {
  money.value = [...money.value, { coin: "gold", number: "1" }];
}

function updateMoney(index: number, update: Partial<CareerMoney>) {
  money.value = money.value.map((x, i) => (i === index ? { ...x, ...update } : x));
}

function removeMoney(index: number) {
  money.value = money.value.filter((_, i) => i !== index);
}

function onCoinChange(index: number, event: Event) {
  const coin = careerCoinList.find((x) => event.target instanceof HTMLSelectElement && x === event.target.value);
  if (coin) {
    updateMoney(index, { coin: coin });
  }
}

function onNumberInput(index: number, event: Event) {
  if (event.target instanceof HTMLInputElement) {
    updateMoney(index, { number: event.target.value.trim() });
  }
}

const CELL_CLASS = "block w-full h-10 px-2 bg-editable outline-neutral-700 focus:outline-2 focus:-outline-offset-2";
</script>

<template>
  <div class="flex flex-col">
    <SheetList title="Items and Assets" :editable="!disabled" :loading="loading" :titleColspan="disabled ? 1 : 3">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:plus" :disabled="loading" @click="pickerOpen = true">Add</AppButton>
      </template>
      <tr v-if="trappings.length === 0">
        <td :colspan="disabled ? 1 : 3" class="px-2 py-2 border-b border-neutral-300 text-neutral-500">None</td>
      </tr>
      <tr v-for="(entry, index) in trappings" :key="index">
        <!-- Written as printCareerTrappingEntry writes it, each known trapping's name a link to its page. -->
        <td class="px-2 py-1 h-10 border-b border-neutral-300">
          <template v-for="(option, o) in entry.options" :key="o">
            <template v-if="o > 0"> or </template>
            <template v-for="(x, t) in option" :key="t">
              <template v-if="t > 0">, </template>
              <template v-if="x.number !== '1'">{{ x.number }} × </template>
              <TextLink v-if="itemNames.has(x.id)" routeName="item" :params="{ id: x.id }">{{ named(x) }}</TextLink>
              <template v-else>{{ named(x) }}</template>
            </template>
          </template>
        </td>
        <td v-if="!disabled" class="w-0 px-1 border-b border-neutral-300">
          <AppButton
            icon="lucide:pencil"
            variant="neutral"
            iconOnlyWhenNarrow
            :aria-label="`Edit ${printCareerTrappingEntry(entry, nameOf)}`"
            @click="openEdit(index)"
          >
            Edit
          </AppButton>
        </td>
        <td v-if="!disabled" class="w-0 px-1 border-b border-neutral-300">
          <IconButton
            icon="lucide:x"
            size="lg"
            :label="`Remove ${printCareerTrappingEntry(entry, nameOf)}`"
            @click="removeEntry(index)"
          />
        </td>
      </tr>
    </SheetList>
    <SheetList title="Money" :editable="!disabled" :titleColspan="disabled ? 1 : 3" class="-mt-px">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:plus" @click="addMoney">Add</AppButton>
      </template>
      <tr v-if="money.length === 0">
        <td :colspan="disabled ? 1 : 3" class="px-2 py-2 border-b border-neutral-300 text-neutral-500">None</td>
      </tr>
      <tr v-for="(coins, index) in money" :key="index">
        <td v-if="disabled" class="px-2 py-1 h-10 border-b border-neutral-300">
          {{ coins.number }} {{ COIN_NAMES[coins.coin] }}
        </td>
        <td v-if="!disabled" class="p-0 w-32 border-b border-r border-neutral-300">
          <select
            :value="coins.coin"
            :aria-label="`Coin of money ${index + 1}`"
            :class="CELL_CLASS"
            @change="onCoinChange(index, $event)"
          >
            <option v-for="coin in careerCoinList" :key="coin" :value="coin">{{ COIN_NAMES[coin] }}</option>
          </select>
        </td>
        <td v-if="!disabled" class="p-0 border-b border-r border-neutral-300">
          <input
            :value="coins.number"
            type="text"
            :aria-label="`Quantity of money ${index + 1}`"
            :class="CELL_CLASS"
            @input="onNumberInput(index, $event)"
          />
        </td>
        <td v-if="!disabled" class="w-0 px-1 border-b border-neutral-300">
          <IconButton
            icon="lucide:x"
            size="lg"
            :label="`Remove ${coins.number} ${COIN_NAMES[coins.coin]}`"
            @click="removeMoney(index)"
          />
        </td>
      </tr>
    </SheetList>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="pickerOpen" size="lg" fullHeight>
      <template #header>
        <span class="flex items-center gap-2">Add trappings <CareerTrappingsHelp /></span>
      </template>
      <ChecklistPicker
        :items="pickerRows"
        routeName="item"
        :loading="loading"
        :filter="filter"
        @add="addEntry"
        @reload="emit('reload')"
      />
    </ModalWindow>
    <CareerTrappingEntryModal
      v-model:open="editOpen"
      :entry="editEntry"
      :pickerItems="pickerItems"
      :nameOf="nameOf"
      :filter="filter"
      :loading="loading"
      @save="saveEntry"
      @reload="emit('reload')"
    />
  </div>
</template>
