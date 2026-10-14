<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import TextLink from "./TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The character view's Skills and Talents side by side, as in the editor. Skills are grouped as basic and advanced;
// with languages, language skills are left out of those and listed as Known languages (the 5e sheet).
const props = defineProps<{ character: CharacterFull; languages?: boolean }>();

const languageIds = new Set(props.languages ? props.character.languageSkills.map((x) => x.id) : []);
const skillSections = [
  { subtitle: "Basic", items: props.character.basicSkills.filter((x) => !languageIds.has(x.id)) },
  { subtitle: "Advanced", items: props.character.advancedSkills.filter((x) => !languageIds.has(x.id)) },
  { subtitle: "Known languages", items: props.languages ? props.character.languageSkills : [] },
];

const SKILL_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "attributeName", displayName: "Att" },
  { name: "advances", displayName: "Adv" },
  { name: "skill", displayName: "Skill" },
];

const TALENT_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "rank", displayName: "Taken" },
];
</script>

<template>
  <div class="flex flex-col @2xl:flex-row @2xl:items-start text-left gap-4">
    <SectionCard v-if="skillSections.some((x) => x.items.length > 0)" title="Skills" class="flex-1">
      <ViewCharacterTable
        v-for="section in skillSections"
        :key="section.subtitle"
        :subtitle="section.subtitle"
        :fields="SKILL_FIELDS"
        :items="section.items"
      >
        <template #name="item">
          <TextLink routeName="skill" :params="{ id: item.id }">{{ item.name }}</TextLink>
        </template>
      </ViewCharacterTable>
    </SectionCard>
    <SectionCard v-if="character.talents.length > 0" title="Talents" class="flex-1">
      <ViewCharacterTable :fields="TALENT_FIELDS" :items="character.talents">
        <template #name="item">
          <TextLink routeName="talent" :params="{ id: item.id }">{{ item.name }}</TextLink>
        </template>
      </ViewCharacterTable>
    </SectionCard>
  </div>
</template>

<style scoped></style>
