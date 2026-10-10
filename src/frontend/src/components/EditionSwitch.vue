<script setup lang="ts">
import { computed } from "vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import { Edition, EDITIONS, printEditionName } from "../services/wh/core/edition.ts";

// longNames: "4th Edition" / "5th Edition" instead of "4e" / "5e". dark: for a dark background.
const props = defineProps<{ longNames?: boolean; dark?: boolean }>();

const edition = defineModel<Edition>({ required: true });

const options = computed(() => EDITIONS.map((e) => ({ value: e, text: props.longNames ? printEditionName(e) : e })));
</script>

<template>
  <ToggleSwitch v-model="edition" :options="options" label="Edition" :dark="dark" />
</template>
