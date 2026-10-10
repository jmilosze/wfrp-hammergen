<script setup lang="ts">
import { Edition } from "../services/wh/core/edition.ts";
import EditionSwitch from "./EditionSwitch.vue";

const edition = defineModel<Edition>({ required: true });
</script>

<template>
  <div class="flex justify-center my-2">
    <EditionSwitch v-model="edition" longNames />
  </div>
</template>

<style scoped></style>
