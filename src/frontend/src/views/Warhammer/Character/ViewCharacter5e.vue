<script setup lang="ts">
import ViewCharacterHeader from "../../../components/ViewCharacterHeader.vue";
import ViewCharacterIdentity from "../../../components/ViewCharacterIdentity.vue";
import ViewCharacterCareer from "../../../components/ViewCharacterCareer.vue";
import ViewCharacterAttributes from "../../../components/ViewCharacterAttributes.vue";
import ViewCharacterSkills from "../../../components/ViewCharacterSkills.vue";
import ViewCharacterTable from "../../../components/ViewCharacterTable.vue";
import ViewCharacterList from "../../../components/ViewCharacterList.vue";
import ViewCharacterSecondPage from "../../../components/ViewCharacterSecondPage.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetCell from "../../../components/SheetCell.vue";
import SectionCard from "../../../components/SectionCard.vue";
import TextLink from "../../../components/TextLink.vue";
import CareerAdvancementTracker from "../../../components/CareerAdvancementTracker.vue";
import Ignored4eModifiersWarning from "../../../components/Ignored4eModifiersWarning.vue";
import { CharacterFull } from "../../../services/wh/character/characterFull.ts";
import { characterFullToCsv5e } from "../../../services/wh/character/csv/csv5e.ts";
import { sumAttributes } from "../../../services/wh/core/attributes.ts";

// The 5e character sheet, read-only, laid out like the paper sheet. First page: name and experience, career with the
// advancement tracker, characteristics with fate and wounds, movement and languages, skills, talents. Then the
// second page (ViewCharacterSecondPage). Empty sections are left out.
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
const MOVEMENT_FIELDS = [
  { name: "movement", displayName: "Movement" },
  { name: "walk", displayName: "Walk" },
  { name: "run", displayName: "Run" },
];

const LANGUAGE_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "attributeName", displayName: "Att" },
  { name: "advances", displayName: "Adv" },
  { name: "skill", displayName: "Skill" },
];
</script>

<template>
  <ViewCharacterHeader :character="character" :toCsv="characterFullToCsv5e" />

  <Ignored4eModifiersWarning :names="character.ignored4eModifiers" class="my-4" />
  <ViewCharacterIdentity :character="character" />
  <ViewCharacterCareer :character="character">
    <SheetCell title="Advancement" class="col-span-full">
      <CareerAdvancementTracker :ticks="character.careerTicks" />
    </SheetCell>
  </ViewCharacterCareer>
  <div class="grid @3xl:grid-cols-3 @6xl:grid-cols-[5fr_2fr_2fr_3fr] items-start text-left gap-4 my-4">
    <ViewCharacterAttributes
      title="Characteristics"
      :rows="characteristicRows"
      class="@3xl:col-span-3 @6xl:col-span-1"
    />
    <!-- Fate and Movement as on the paper sheet: the names over the numbers, in one row. -->
    <div class="flex flex-col gap-4">
      <SectionCard title="Fate">
        <ViewCharacterTable :fields="FATE_FIELDS" :items="[character]" />
      </SectionCard>
      <SheetTable title="Wounds">
        <SheetCell title="Total">{{ character.wounds }}</SheetCell>
      </SheetTable>
    </div>
    <SectionCard title="Movement">
      <ViewCharacterTable :fields="MOVEMENT_FIELDS" :items="[character]" />
    </SectionCard>
    <SectionCard v-if="character.languageSkills.length > 0" title="Languages">
      <ViewCharacterTable :fields="LANGUAGE_FIELDS" :items="character.languageSkills">
        <template #name="item">
          <TextLink routeName="skill" :params="{ id: item.id }">{{ item.name }}</TextLink>
        </template>
      </ViewCharacterTable>
    </SectionCard>
  </div>
  <ViewCharacterSkills :character="character" withoutLanguages class="my-4" />
  <SectionCard v-if="character.talents.length > 0" title="Talents" class="my-4 text-left">
    <ViewCharacterList :items="character.talents" routeName="talent" />
  </SectionCard>
  <ViewCharacterSecondPage :character="character" />
</template>

<style scoped></style>
