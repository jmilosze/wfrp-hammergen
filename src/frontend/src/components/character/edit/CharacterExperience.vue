<script setup lang="ts">
import { computed } from "vue";
import { Character } from "../../../services/wh/character/character.ts";
import SheetTable from "../../sheet/SheetTable.vue";
import SheetField from "../../sheet/SheetField.vue";
import SheetCell from "../../sheet/SheetCell.vue";

// The character editor's Experience: unspent and spent XP, typed in, and their total.
const character = defineModel<Character>({ required: true });

defineProps<{ disabled: boolean }>();

const validCurrentExp = computed(() => character.value.validateCurrentExp());
const validSpentExp = computed(() => character.value.validateSpentExp());
</script>

<template>
  <SheetTable title="Experience" :columns="3">
    <SheetField
      v-model="character.currentExp"
      type="number"
      title="Unspent"
      :validationStatus="validCurrentExp"
      :disabled="disabled"
    />
    <SheetField
      v-model="character.spentExp"
      type="number"
      title="Spent"
      :validationStatus="validSpentExp"
      :disabled="disabled"
    />
    <SheetCell title="Total">{{ character.currentExp + character.spentExp }}</SheetCell>
  </SheetTable>
</template>
