<script setup lang="ts">
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";
import { ValidationStatus } from "@/utils/validation.ts";

// The character editor's Experience: unspent and spent XP, typed in, and their total.
const currentExp = defineModel<number>("currentExp", { required: true });
const spentExp = defineModel<number>("spentExp", { required: true });

defineProps<{
  currentExpValidation: ValidationStatus;
  spentExpValidation: ValidationStatus;
  disabled: boolean;
}>();
</script>

<template>
  <SheetTable title="Experience" :columns="3">
    <SheetField
      v-model="currentExp"
      type="number"
      title="Unspent"
      :validationStatus="currentExpValidation"
      :disabled="disabled"
    />
    <SheetField
      v-model="spentExp"
      type="number"
      title="Spent"
      :validationStatus="spentExpValidation"
      :disabled="disabled"
    />
    <SheetCell title="Total">{{ currentExp + spentExp }}</SheetCell>
  </SheetTable>
</template>
