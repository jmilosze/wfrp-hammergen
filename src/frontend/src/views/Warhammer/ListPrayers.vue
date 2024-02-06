<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";

const whListUtils = useWhListUtils(new PrayerApi(authRequest));

await whListUtils.loadWhList();
for (const [_, prayer] of whListUtils.whList.value.entries()) {
  console.log(JSON.stringify(prayer));
}
</script>

<template></template>

<style scoped></style>
