<script setup lang="ts">
import { computed } from "vue";
import { Character } from "../services/wh/character/character.ts";
import { CharacterContent } from "../composables/characterEdit.ts";
import SheetTable from "./SheetTable.vue";
import SheetField from "./SheetField.vue";
import SelectTable from "./SelectTable.vue";
import SelectIdValueTable from "./SelectIdValueTable.vue";

// The character editor's Magic and Faith (Sin Points, prayers, spells) and Traits and Corruption (Corruption Points,
// mutations, creature traits), side by side once there is room. Mutation and trait modifiers come from the content of
// the character's own edition only.
const character = defineModel<Character>({ required: true });

defineProps<{ content: CharacterContent; disabled: boolean }>();

const validSin = computed(() => character.value.validateSin());
const validCorruption = computed(() => character.value.validateCorruption());
</script>

<template>
  <div class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <div class="grow basis-80">
      <SheetTable title="Magic and Faith">
        <SheetField
          v-model="character.sin"
          type="number"
          title="Sin Points"
          :validationStatus="validSin"
          :disabled="disabled"
        />
      </SheetTable>
      <SelectTable
        :disabled="disabled"
        :selected="character.prayers"
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
        @selected="(e) => character.updatePrayers(e.id, e.selected)"
      />
      <SelectTable
        :disabled="disabled"
        :selected="character.spells"
        :itemList="content.spells.withAllowed.value"
        :fourEIds="content.spells.fourEIds.value"
        title="Spells"
        modalTitle="Edit spells"
        :loading="content.spells.loading.value"
        removable
        :disableDescription="true"
        routeName="spell"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.spells.reload"
        @selected="(e) => character.updateSpells(e.id, e.selected)"
      />
    </div>
    <div class="grow basis-80">
      <SheetTable title="Traits and Corruption">
        <SheetField
          v-model="character.corruption"
          type="number"
          title="Corruption Points"
          :validationStatus="validCorruption"
          :disabled="disabled"
        />
      </SheetTable>
      <SelectTable
        :disabled="disabled"
        :selected="character.mutations"
        :itemList="content.mutations.withAllowed.value"
        :fourEIds="content.mutations.fourEIds.value"
        title="Mutations"
        modalTitle="Edit mutations"
        :loading="content.mutations.loading.value"
        removable
        :disableDescription="true"
        routeName="mutation"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.mutations.reload"
        @selected="(e) => character.updateMutations(e.id, e.selected, content.mutations.own.whList.value)"
      />
      <SelectIdValueTable
        :disabled="disabled"
        :selected="character.traits"
        :itemList="content.traits.withAllowed.value"
        :fourEIds="content.traits.fourEIds.value"
        title="Creature Traits"
        modalTitle="Edit traits"
        :loading="content.traits.loading.value"
        :disableDescription="true"
        :allowRepeat="true"
        :validationStatus="character.validateTraits()"
        routeName="trait"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="content.traits.reload"
        @add="(id) => character.addTrait(id, content.traits.own.whList.value)"
        @remove="(e) => character.removeTrait(e.index)"
        @selected="(e) => character.updateTraits(e.id, e.selected, content.traits.own.whList.value)"
        @updateValue="(e) => character.updateTraitValue(e.index, e.value)"
      />
    </div>
  </div>
</template>
