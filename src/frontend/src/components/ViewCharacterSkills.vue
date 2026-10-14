<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import TextLink from "./TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The character view's Skills in the paper sheet's three columns: the basic skills over the first two, the advanced
// skills in the third. withoutLanguages: language skills are left out (the 5e sheet lists them under Languages).
const props = defineProps<{ character: CharacterFull; withoutLanguages?: boolean }>();

const languageIds = new Set(props.withoutLanguages ? props.character.languageSkills.map((x) => x.id) : []);
const basic = props.character.basicSkills.filter((x) => !languageIds.has(x.id));
const advanced = props.character.advancedSkills.filter((x) => !languageIds.has(x.id));
const half = Math.ceil(basic.length / 2);
const columns = [basic.slice(0, half), basic.slice(half), advanced];

const FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "attributeName", displayName: "Att" },
  { name: "advances", displayName: "Adv" },
  { name: "skill", displayName: "Skill" },
];
</script>

<template>
  <SectionCard v-if="basic.length > 0 || advanced.length > 0" title="Skills">
    <div class="@container">
      <div class="grid @3xl:grid-cols-3 @3xl:divide-x divide-neutral-300">
        <!-- Each column sits in a div, so a shorter column keeps its row heights. -->
        <div
          v-for="(items, i) in columns"
          :key="i"
          class="not-last:border-b @3xl:not-last:border-b-0 border-neutral-300"
        >
          <ViewCharacterTable :fields="FIELDS" :items="items">
            <template #name="item">
              <TextLink routeName="skill" :params="{ id: item.id }">{{ item.name }}</TextLink>
            </template>
          </ViewCharacterTable>
        </div>
      </div>
    </div>
  </SectionCard>
</template>

<style scoped></style>
