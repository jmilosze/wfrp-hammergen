<script setup lang="ts">
import SectionButton from "../../../components/SectionButton.vue";
import Header from "../../../components/PageHeader.vue";
import { computed, toRef } from "vue";
import { CharacterFull } from "../../../services/wh/character/characterFull.ts";
import { characterFullToCsv4e } from "../../../services/wh/character/csv/csv4e.ts";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";
import { usePrint } from "../../../composables/print.ts";
import { useAuth } from "../../../composables/auth.ts";
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
const props = defineProps<{
  character: CharacterFull;
}>();

const router = useRouter();
const auth = useAuth();
const { print, printing } = usePrint();

const character = toRef(props, "character");
const canEdit = computed(() => auth.canEdit(character.value.ownerId));

function saveJson() {
  const blob = new Blob([JSON.stringify(character.value, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.json`);
}

function saveCsv() {
  const blob = new Blob([characterFullToCsv4e(character.value)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.csv`);
}
</script>

<template>
  <Header :title="character.name" />
  <div v-if="!printing" class="flex flex-wrap gap-2 mt-4">
    <SectionButton icon="lucide:file-spreadsheet" @click="saveCsv()">Download CSV</SectionButton>
    <SectionButton icon="lucide:file-json" @click="saveJson()">Download JSON</SectionButton>
    <SectionButton icon="lucide:printer" @click="print()">Print</SectionButton>
    <SectionButton
      v-if="canEdit"
      icon="lucide:pencil"
      variant="dark"
      @click="router.push({ name: 'character', params: { id: character.id } })"
    >
      Edit
    </SectionButton>
    <SectionButton icon="lucide:arrow-left" @click="router.push({ name: 'characters' })">Back to list</SectionButton>
  </div>

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
