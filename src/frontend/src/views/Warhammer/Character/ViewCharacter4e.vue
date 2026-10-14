<script setup lang="ts">
import ViewCharacterHeader from "../../../components/ViewCharacterHeader.vue";
import { CharacterFull } from "../../../services/wh/character/characterFull.ts";
import { characterFullToCsv4e } from "../../../services/wh/character/csv/csv4e.ts";
import TextLink from "../../../components/TextLink.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetCell from "../../../components/SheetCell.vue";
import SectionCard from "../../../components/SectionCard.vue";
import ViewCharacterAttributes from "../../../components/ViewCharacterAttributes.vue";
import ViewCharacterSkills from "../../../components/ViewCharacterSkills.vue";
import ViewCharacterWealth from "../../../components/ViewCharacterWealth.vue";
import ViewCharacterTrappings from "../../../components/ViewCharacterTrappings.vue";
import ViewCharacterMagic from "../../../components/ViewCharacterMagic.vue";

// The 4e character sheet, read-only, laid out like the editor. Empty sections are left out.
defineProps<{
  character: CharacterFull;
}>();
</script>

<template>
  <ViewCharacterHeader :character="character" :toCsv="characterFullToCsv4e" />

  <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
    <div class="flex-1 flex flex-col gap-4">
      <div>
        <SheetTable>
          <SheetCell title="Name">{{ character.name }}</SheetCell>
        </SheetTable>
        <SheetTable class="-mt-px">
          <SheetCell title="Species">{{ character.species }}</SheetCell>
        </SheetTable>
        <SheetTable :columns="2" class="-mt-px">
          <SheetCell title="Fate">{{ character.fate }}</SheetCell>
          <SheetCell title="Fortune">{{ character.fortune }}</SheetCell>
          <SheetCell title="Resilience">{{ character.resilience }}</SheetCell>
          <SheetCell title="Resolve">{{ character.resolve }}</SheetCell>
        </SheetTable>
        <SheetTable :columns="3" class="-mt-px">
          <SheetCell title="Movement">{{ character.movement }}</SheetCell>
          <SheetCell title="Size">{{ character.size }}</SheetCell>
          <SheetCell title="Wounds">{{ character.wounds }}</SheetCell>
        </SheetTable>
        <SheetTable :columns="2" class="-mt-px">
          <SheetCell title="Walk">{{ character.walk }}</SheetCell>
          <SheetCell title="Run">{{ character.run }}</SheetCell>
        </SheetTable>
      </div>
      <SheetTable title="Experience" :columns="3">
        <SheetCell title="Unspent">{{ character.currentExp }}</SheetCell>
        <SheetCell title="Spent">{{ character.spentExp }}</SheetCell>
        <SheetCell title="Total">{{ character.totalExp }}</SheetCell>
      </SheetTable>
    </div>
    <div class="flex-1 flex flex-col gap-4">
      <div>
        <SheetTable title="Career" :columns="2">
          <SheetCell title="Status">{{ character.status }}</SheetCell>
          <SheetCell title="Standing">{{ character.standing }}</SheetCell>
        </SheetTable>
        <SheetTable class="-mt-px">
          <SheetCell title="Current">
            <div v-if="character.currentCareer">
              <TextLink routeName="career" :params="{ id: character.currentCareer.id }">
                {{ character.currentCareer.name }}
              </TextLink>
              ({{ character.currentCareer.className }})
            </div>
          </SheetCell>
          <SheetCell v-if="character.pastCareers.length > 0" title="Past">
            <div>
              <span v-for="(pastCareer, i) in character.pastCareers" :key="i">
                <TextLink routeName="career" :params="{ id: pastCareer.id }">{{ pastCareer.name }}</TextLink>
                <template v-if="i < character.pastCareers.length - 1">, </template>
              </span>
            </div>
          </SheetCell>
        </SheetTable>
      </div>
    </div>
  </div>
  <SectionCard v-if="character.description" title="Description" class="my-4">
    <p class="px-2 py-2 whitespace-pre-wrap wrap-anywhere">{{ character.description }}</p>
  </SectionCard>
  <ViewCharacterAttributes
    :base="character.baseAttributes"
    :other="character.otherAttributes"
    :advances="character.attributeAdvances"
    :total="character.attributes"
    class="my-4"
  />
  <ViewCharacterSkills :character="character" class="my-4" />
  <ViewCharacterWealth :character="character" class="my-4" />
  <ViewCharacterTrappings :character="character" class="my-4" />
  <ViewCharacterMagic :character="character" class="my-4" />
  <SectionCard v-if="character.notes" title="Notes" class="my-4">
    <p class="px-2 py-2 whitespace-pre-wrap wrap-anywhere">{{ character.notes }}</p>
  </SectionCard>
</template>

<style scoped></style>
