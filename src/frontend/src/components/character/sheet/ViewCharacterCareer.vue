<script setup lang="ts">
import SheetCell from "../../sheet/SheetCell.vue";
import SheetTable from "../../sheet/SheetTable.vue";
import TextLink from "../../ui/TextLink.vue";
import { CharacterFull } from "../../../services/wh/character/characterFull.ts";

// The character view's Career box: class, current career, status and past careers. The slot adds full-width rows
// (e.g. the 5e Career Advancement Tracker).
defineProps<{ character: CharacterFull }>();
</script>

<template>
  <SheetTable title="Career" :columns="3" class="my-4 text-left">
    <SheetCell title="Class">{{ character.currentCareer?.className }}</SheetCell>
    <SheetCell title="Career">
      <TextLink v-if="character.currentCareer" routeName="career" :params="{ id: character.currentCareer.id }">
        {{ character.currentCareer.name }}
      </TextLink>
    </SheetCell>
    <SheetCell title="Status">{{ character.status }} {{ character.standing }}</SheetCell>
    <SheetCell v-if="character.pastCareers.length > 0" title="Past careers" class="col-span-full">
      <div>
        <span v-for="(pastCareer, i) in character.pastCareers" :key="i">
          <TextLink routeName="career" :params="{ id: pastCareer.id }">{{ pastCareer.name }}</TextLink>
          <template v-if="i < character.pastCareers.length - 1">, </template>
        </span>
      </div>
    </SheetCell>
    <slot />
  </SheetTable>
</template>

<style scoped></style>
