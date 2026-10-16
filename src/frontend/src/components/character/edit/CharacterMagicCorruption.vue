<script setup lang="ts">
import { computed } from "vue";
import { CharacterContent } from "@/composables/characterEdit.ts";
import { IdValue } from "@/utils/idValue.ts";
import { ValidationStatus } from "@/utils/validation.ts";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SelectTable from "@/components/picker/SelectTable.vue";
import SelectIdValueTable from "@/components/picker/SelectIdValueTable.vue";
import { idFilter } from "@/components/filter/contentFilter.ts";
import { spellFilters } from "@/components/filter/spellFilters.ts";
import { mutationFilters } from "@/components/filter/mutationFilters.ts";

// The character editor's Magic and Faith (Sin Points, prayers, spells) and Traits and Corruption (Corruption Points,
// mutations, creature traits), side by side once there is room. The picked prayers, spells, mutations and traits are
// read directly; changes to them are emitted for the editor to apply.
const sin = defineModel<number>("sin", { required: true });
const corruption = defineModel<number>("corruption", { required: true });

const props = defineProps<{
  prayers: Set<string>;
  spells: Set<string>;
  mutations: Set<string>;
  traits: IdValue[];
  sinValidation: ValidationStatus;
  corruptionValidation: ValidationStatus;
  traitsValidation: ValidationStatus;
  content: CharacterContent;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "prayerSelected", value: { id: string; selected: boolean }): void;
  (e: "spellSelected", value: { id: string; selected: boolean }): void;
  (e: "mutationSelected", value: { id: string; selected: boolean }): void;
  (e: "traitAdded", id: string): void;
  (e: "traitRemoved", value: { index: number; id: string }): void;
  (e: "traitSelected", value: { id: string; selected: boolean }): void;
  (e: "traitValueUpdated", value: { index: number; id: string; value: string }): void;
}>();

// Spells show their Casting Number before the description, e.g. "CN 3 · Target gains…".
const spellItems = computed(() =>
  props.content.spells.withAllowed.value.map((x) => ({
    id: x.id,
    name: x.name,
    description: `CN ${x.cn} · ${x.description}`,
  })),
);

// The popups filter spells by type and label, mutations by type.
const spellsFilter = computed(() =>
  idFilter({ type: spellFilters.type, label: spellFilters.label }, props.content.spells.withAllowed.value),
);
const mutationsFilter = computed(() =>
  idFilter({ type: mutationFilters.type }, props.content.mutations.withAllowed.value),
);
</script>

<template>
  <div class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <div class="grow basis-80">
      <SheetTable title="Magic and Faith">
        <SheetField
          v-model="sin"
          type="number"
          title="Sin Points"
          :validationStatus="sinValidation"
          :disabled="disabled"
        />
      </SheetTable>
      <SelectTable
        :disabled="disabled"
        :selected="prayers"
        :itemList="content.prayers.withAllowed.value"
        :fourEIds="content.prayers.fourEIds.value"
        title="Prayers"
        modalTitle="Edit prayers"
        :loading="content.prayers.loading.value"
        removable
        :disableDescription="true"
        routeName="prayer"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.prayers.reload"
        @selected="(e) => emit('prayerSelected', e)"
      />
      <SelectTable
        :disabled="disabled"
        :selected="spells"
        :itemList="spellItems"
        :fourEIds="content.spells.fourEIds.value"
        :filter="spellsFilter"
        title="Spells"
        modalTitle="Edit spells"
        :loading="content.spells.loading.value"
        removable
        :disableDescription="true"
        routeName="spell"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.spells.reload"
        @selected="(e) => emit('spellSelected', e)"
      />
    </div>
    <div class="grow basis-80">
      <SheetTable title="Traits and Corruption">
        <SheetField
          v-model="corruption"
          type="number"
          title="Corruption Points"
          :validationStatus="corruptionValidation"
          :disabled="disabled"
        />
      </SheetTable>
      <SelectTable
        :disabled="disabled"
        :selected="mutations"
        :itemList="content.mutations.withAllowed.value"
        :fourEIds="content.mutations.fourEIds.value"
        :filter="mutationsFilter"
        title="Mutations"
        modalTitle="Edit mutations"
        :loading="content.mutations.loading.value"
        removable
        :disableDescription="true"
        routeName="mutation"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.mutations.reload"
        @selected="(e) => emit('mutationSelected', e)"
      />
      <SelectIdValueTable
        :disabled="disabled"
        :selected="traits"
        :itemList="content.traits.withAllowed.value"
        :fourEIds="content.traits.fourEIds.value"
        title="Creature Traits"
        modalTitle="Edit traits"
        :loading="content.traits.loading.value"
        :disableDescription="true"
        :allowRepeat="true"
        :validationStatus="traitsValidation"
        routeName="trait"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.traits.reload"
        @add="(id) => emit('traitAdded', id)"
        @remove="(e) => emit('traitRemoved', e)"
        @selected="(e) => emit('traitSelected', e)"
        @updateValue="(e) => emit('traitValueUpdated', e)"
      />
    </div>
  </div>
</template>
