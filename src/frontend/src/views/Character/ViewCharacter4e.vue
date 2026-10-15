<script setup lang="ts">
import ViewCharacterHeader from "../../components/character/sheet/ViewCharacterHeader.vue";
import ViewCharacterIdentity from "../../components/character/sheet/ViewCharacterIdentity.vue";
import ViewCharacterCareer from "../../components/character/sheet/ViewCharacterCareer.vue";
import ViewCharacterAttributes from "../../components/character/sheet/ViewCharacterAttributes.vue";
import ViewCharacterSkills from "../../components/character/sheet/ViewCharacterSkills.vue";
import ViewCharacterTable from "../../components/character/sheet/ViewCharacterTable.vue";
import ViewCharacterList from "../../components/character/sheet/ViewCharacterList.vue";
import ViewCharacterSecondPage from "../../components/character/sheet/ViewCharacterSecondPage.vue";
import SheetTable from "../../components/sheet/SheetTable.vue";
import SheetCell from "../../components/sheet/SheetCell.vue";
import SheetCard from "../../components/sheet/SheetCard.vue";
import { CharacterFull } from "../../services/wh/character/characterFull.ts";
import { characterFullToCsv4e } from "../../services/wh/character/csv/csv4e.ts";
import { sumAttributes } from "../../services/wh/core/attributes.ts";

// The 4e character sheet, read-only, laid out like the paper sheet. First page: name and experience, career,
// characteristics with fate and resilience, movement and wounds, skills, talents. Then the second page
// (ViewCharacterSecondPage). Empty sections are left out.
const props = defineProps<{
  character: CharacterFull;
}>();

const characteristicRows = [
  { name: "Initial", values: sumAttributes(props.character.baseAttributes, props.character.otherAttributes) },
  { name: "Advances", values: props.character.attributeAdvances },
  { name: "Current", values: props.character.attributes },
];

const FATE_FIELDS = [
  { name: "fate", displayName: "Fate" },
  { name: "fortune", displayName: "Fortune" },
];
const RESILIENCE_FIELDS = [
  { name: "resilience", displayName: "Resilience" },
  { name: "resolve", displayName: "Resolve" },
];
const MOVEMENT_FIELDS = [
  { name: "movement", displayName: "Movement" },
  { name: "walk", displayName: "Walk" },
  { name: "run", displayName: "Run" },
];
</script>

<template>
  <ViewCharacterHeader :character="character" :toCsv="characterFullToCsv4e" />

  <ViewCharacterIdentity :character="character" />
  <ViewCharacterCareer :character="character" />
  <div class="grid @3xl:grid-cols-2 @6xl:grid-cols-[5fr_2fr_2fr] items-start text-left gap-4 my-4">
    <ViewCharacterAttributes
      title="Characteristics"
      :rows="characteristicRows"
      class="@3xl:col-span-2 @6xl:col-span-1"
    />
    <!-- Fate, Resilience and Movement as on the paper sheet: the names over the numbers, in one row. -->
    <div class="flex flex-col gap-4">
      <SheetCard title="Fate">
        <ViewCharacterTable :fields="FATE_FIELDS" :items="[character]" />
      </SheetCard>
      <SheetCard title="Resilience">
        <ViewCharacterTable :fields="RESILIENCE_FIELDS" :items="[character]" />
      </SheetCard>
    </div>
    <div class="flex flex-col gap-4">
      <SheetCard title="Movement">
        <ViewCharacterTable :fields="MOVEMENT_FIELDS" :items="[character]" />
      </SheetCard>
      <SheetTable title="Wounds">
        <SheetCell title="Total">{{ character.wounds }}</SheetCell>
      </SheetTable>
    </div>
  </div>
  <ViewCharacterSkills :character="character" class="my-4" />
  <SheetCard v-if="character.talents.length > 0" title="Talents" class="my-4 text-left">
    <ViewCharacterList :items="character.talents" routeName="talent" />
  </SheetCard>
  <ViewCharacterSecondPage :character="character" />
</template>

<style scoped></style>
