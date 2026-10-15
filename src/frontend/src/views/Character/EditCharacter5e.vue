<script setup lang="ts">
import TextLink from "../../components/ui/TextLink.vue";
import { Edition } from "../../services/wh/core/edition.ts";
import LoadErrors from "../../components/ui/LoadErrors.vue";
import PageHeader from "../../components/ui/PageHeader.vue";
import { defaultSource } from "../../services/wh/core/source.ts";
import { useCharacterContent, useCharacterEdit, useGenerationCareers } from "../../composables/characterEdit.ts";
import { authRequest } from "../../services/auth.ts";
import { Character, characterApi } from "../../services/wh/character/character.ts";
import { computed, ref } from "vue";
import EditorFooter from "../../components/editor/EditorFooter.vue";
import { printSize } from "../../services/wh/character/size.ts";
import { printSpeciesWithRegion, SpeciesWithRegion } from "../../services/wh/core/species.ts";
import { SPECIES_5E } from "../../services/wh/character/rules/rules5e.ts";
import FormTextarea from "../../components/form/FormTextarea.vue";
import {
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  statusTierList,
} from "../../services/wh/content/career.ts";
import CharacterCareer from "../../components/character/edit/CharacterCareer.vue";
import CharacterAttributes from "../../components/character/edit/CharacterAttributes.vue";
import VisibilityField from "../../components/editor/VisibilityField.vue";
import CharacterSkills from "../../components/character/edit/CharacterSkills.vue";
import CharacterTalents from "../../components/character/edit/CharacterTalents.vue";
import CharacterItems from "../../components/character/edit/CharacterItems.vue";
import ModalWindow from "../../components/ui/ModalWindow.vue";
import Ignored4eModifiersWarning from "../../components/character/Ignored4eModifiersWarning.vue";
import HelpButton from "../../components/ui/HelpButton.vue";
import CharacterStartPanel from "../../components/character/edit/CharacterStartPanel.vue";
import SheetCard from "../../components/sheet/SheetCard.vue";
import AppButton from "../../components/ui/AppButton.vue";
import SheetField from "../../components/sheet/SheetField.vue";
import SheetSelect from "../../components/sheet/SheetSelect.vue";
import SheetTable from "../../components/sheet/SheetTable.vue";
import FormCheckbox from "../../components/form/FormCheckbox.vue";
import SheetCell from "../../components/sheet/SheetCell.vue";
import EditionBadge from "../../components/edition/EditionBadge.vue";
import { useGenerationProps5e } from "../../composables/generationProps.ts";
import { generateCharacter5e } from "../../services/wh/character/generation/5e/generator5e.ts";
import { populateFateFortune5e } from "../../services/wh/character/generation/5e/fate5e.ts";
import { populateSpeciesSkills5e } from "../../services/wh/character/generation/5e/skills5e.ts";
import { populateClassItems } from "../../services/wh/character/generation/shared/trappings.ts";
import { populateDescription } from "../../services/wh/character/generation/shared/description.ts";
import { populateName } from "../../services/wh/character/generation/shared/name.ts";
import { populateSpeciesTalents } from "../../services/wh/character/generation/shared/talents.ts";
import CharacterExperience from "../../components/character/edit/CharacterExperience.vue";
import CharacterWealthEncumbrance from "../../components/character/edit/CharacterWealthEncumbrance.vue";
import CharacterMagicCorruption from "../../components/character/edit/CharacterMagicCorruption.vue";
import { populateStatusAndStanding } from "../../services/wh/character/generation/shared/status.ts";

const props = defineProps<{
  id: string;
  // The loaded character; absent for a new one.
  character?: Character;
}>();

const EDITION: Edition = "5e";
// One 5e Advance adds +5 (advances are stored as points).
const ADVANCE_STEP = 5;

const newCharacter = new Character({
  edition: EDITION,
  name: "New character",
  species: SpeciesWithRegion.HumanReikland,
  id: "create",
  source: defaultSource(),
});

const { wh, canEdit, submitForm, deleteItem, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useCharacterEdit(newCharacter, props.character, characterApi(authRequest), EDITION);

const content = useCharacterContent(wh, EDITION);
const generationPropsUtils = useGenerationProps5e(authRequest);
generationPropsUtils.loadGenerationProps();

// The generator uses 5e content only, whether or not 4e content is allowed.
const generationDataLoading = computed(
  () =>
    content.careers.own.loading.value ||
    content.skills.own.loading.value ||
    content.talents.own.loading.value ||
    content.items.own.loading.value ||
    generationPropsUtils.loading.value,
);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validNotes = computed(() => wh.value.validateNotes());
const validFate = computed(() => wh.value.validateFate());
const validFortune = computed(() => wh.value.validateFortune());
const validCareerTicks = computed(() => wh.value.validateCareerTicks());
const validRolls = computed(() => wh.value.validateRolls());
const validAdvances = computed(() => wh.value.validateAdvances());
const validSkills = computed(() => wh.value.validateSkills());
const validTalents = computed(() => wh.value.validateTalents());
const validEquipped = computed(() => wh.value.validateEquippedItems());
const validCarried = computed(() => wh.value.validateCarriedItems());
const validStored = computed(() => wh.value.validateStoredItems());

const speciesOpts = SPECIES_5E.map((x) => ({ text: printSpeciesWithRegion(x), value: x }));
const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));

const levelOpts = [
  { text: "Level 1", value: 1 },
  { text: "Level 2", value: 2 },
  { text: "Level 3", value: 3 },
  { text: "Level 4", value: 4 },
];

const selectedGenSpecies = ref(SpeciesWithRegion.HumanReikland);
const selectedGenLevel = ref<1 | 2 | 3 | 4>(1);
const { careerOpts, selectedCareer: selectedGenCareer } = useGenerationCareers(
  selectedGenSpecies,
  content.careers.own.whList,
);

const isGenerationDisabled = computed(() => generationDataLoading.value || careerOpts.value.length === 0);
// What the generator is set to, shown in the start strip after generating.
const generationSummary = computed(() =>
  [
    speciesOpts.find((x) => x.value === selectedGenSpecies.value)?.text,
    careerOpts.value.find((x) => x.value === selectedGenCareer.value)?.text,
    `Level ${selectedGenLevel.value}`,
  ]
    .filter((x) => x !== undefined)
    .join(" · "),
);

function rollCharacter() {
  if (isGenerationDisabled.value) {
    return;
  }
  const career = content.careers.own.whList.value.find((x) => x.id === selectedGenCareer.value);
  if (!career) {
    return;
  }
  wh.value = generateCharacter5e({
    species: selectedGenSpecies.value,
    career,
    level: selectedGenLevel.value,
    skills: content.skills.own.whList.value,
    talents: content.talents.own.whList.value,
    generationProps: generationPropsUtils.generationProps.value,
  });

  wh.value.hydrateAllModifiers({
    talents: content.talents.own.whList.value,
    mutations: content.mutations.own.whList.value,
    traits: content.traits.own.whList.value,
  });
}

function formGenerateStatusStanding() {
  if (content.careers.loading.value) {
    return;
  }
  populateStatusAndStanding(wh.value, content.careers.withAllowed.value);
}

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());
const size = computed(() => printSize(wh.value.getSize()));

const allow4eOpen = ref(false);

// Turning on 4e content is one-way: it asks for confirmation and cannot be undone once saved.
function confirmAllow4e() {
  wh.value.allow4e = true;
  allow4eOpen.value = false;
}

// 4e talents, traits and mutations whose modifiers are not applied.
const ignored4eModifiers = computed(() =>
  [
    ...content.talents.fourEOnly.value.filter((x) => x.id in wh.value.talents),
    ...content.traits.fourEOnly.value.filter((x) => wh.value.hasTrait(x.id)),
    ...content.mutations.fourEOnly.value.filter((x) => wh.value.mutations.has(x.id)),
  ]
    .filter((x) => x.modifiers.hasModifiers())
    .map((x) => x.name),
);

const attributes = computed(() => {
  return wh.value.getTotalAttributes();
});

const modifierAttributes = computed(() => {
  return wh.value.getModifierAttributes();
});
</script>

<template>
  <LoadErrors :states="[...content.loadStates, generationPropsUtils]" />
  <PageHeader :title="id === 'create' ? 'Create character' : canEdit ? 'Edit character' : wh.name" />
  <p v-if="id !== 'create'" class="mt-2">
    <TextLink routeName="viewCharacter" :params="{ id: id }" sameWindow>View character</TextLink>
  </p>
  <CharacterStartPanel
    v-if="canEdit && id === 'create'"
    :generateDisabled="isGenerationDisabled"
    :generationSummary="generationSummary"
    @generate="rollCharacter"
  >
    <template #fields>
      <SheetTable :columns="3">
        <SheetSelect v-model="selectedGenSpecies" title="Species" :options="speciesOpts" />
        <SheetSelect v-model="selectedGenCareer" title="Career" :options="careerOpts" />
        <SheetSelect v-model="selectedGenLevel" title="Level" :options="levelOpts" />
      </SheetTable>
    </template>
    <template #hint>
      <p class="my-1">
        A level 1 character is generated following the character creation chapter of the 5e rulebook, using 5e content
        only. Species and career are chosen, not rolled, so the bonuses for keeping a rolled species or career are not
        given.
      </p>
      <p class="my-1">
        Characteristics are rolled and kept in order: the 6 extra points are spread at random over the 3 characteristics
        of the first career level and added to the rolls.
      </p>
      <p class="my-1">
        The career box lists the 5e careers open to the selected species, including your custom 5e careers.
      </p>
      <p class="my-1">
        Class trappings are added to the character sheet but career specific trappings are not and have to be added
        manually afterward.
      </p>
      <p class="my-1">
        Higher level characters are generated by creating a level 1 character and moving it up a level at a time. At
        each level, the character takes 1 career talent and a +5 advance in each characteristic it can advance, and the
        rest of the Career Advancement Tracker (10 ticks for level 2, 12 more for level 3, 14 more for level 4) is
        filled with career skill advances. XP is spent as in the rulebook, plus 100 XP for each new level.
      </p>
      <p class="my-1">Generating will override all current entries on the character sheet.</p>
    </template>
  </CharacterStartPanel>
  <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
    <div class="flex items-center gap-2">
      Edition
      <EditionBadge edition="5e" large />
    </div>
    <div class="flex items-center gap-2">
      <label class="flex items-center gap-2">
        <FormCheckbox :checked="wh.allow4e" :disabled="!canEdit || wh.allow4e" @click.prevent="allow4eOpen = true" />
        Allow 4e content
      </label>
      <HelpButton modalHeader="Allow 4e content">
        <p class="my-1">
          The character can use 4e content that has no 5e version. Such content is marked 4e in the pickers and on the
          character sheet.
        </p>
        <p class="my-1">
          4e trappings count as usual. 4e talents, traits and mutations are listed, but their modifiers are not applied.
        </p>
        <p class="my-1">Once saved, 4e content cannot be turned off for this character.</p>
      </HelpButton>
    </div>
    <VisibilityField v-model="wh.visibility" propertyName="Character" :disabled="!canEdit" />
  </div>
  <ModalWindow v-model:open="allow4eOpen">
    <template #header> Allow 4e content </template>
    <template #buttons>
      <div class="flex gap-2">
        <AppButton icon="lucide:check" variant="light" @click="confirmAllow4e">Allow 4e content</AppButton>
        <AppButton icon="lucide:x" variant="neutral" @click="allow4eOpen = false">Cancel</AppButton>
      </div>
    </template>
    <div>
      Once saved, 4e content cannot be turned off for this character. Its pickers will also list 4e content that has no
      5e version.
    </div>
  </ModalWindow>
  <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <div>
          <SheetTable>
            <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
            <template v-if="canEdit" #actions>
              <AppButton icon="lucide:dices" iconOnlyWhenNarrow @click="populateName(wh)"> Generate </AppButton>
            </template>
          </SheetTable>
          <SheetTable class="-mt-px">
            <SheetSelect v-model="wh.species" title="Species" :options="speciesOpts" :disabled="!canEdit" />
          </SheetTable>
          <SheetTable :columns="2" class="-mt-px">
            <SheetField
              v-model="wh.fate"
              type="number"
              title="Fate"
              :validationStatus="validFate"
              :disabled="!canEdit"
            />
            <SheetField
              v-model="wh.fortune"
              type="number"
              title="Fortune"
              :validationStatus="validFortune"
              :disabled="!canEdit"
            />
            <template v-if="canEdit" #actions>
              <AppButton icon="lucide:dices" iconOnlyWhenNarrow @click="populateFateFortune5e(wh)">
                Generate
              </AppButton>
            </template>
          </SheetTable>
          <SheetTable :columns="3" class="-mt-px">
            <SheetCell title="Movement">{{ movement }}</SheetCell>
            <SheetCell title="Size">{{ size }}</SheetCell>
            <SheetCell title="Wounds">{{ wounds }}</SheetCell>
          </SheetTable>
        </div>
        <CharacterExperience v-model="wh" :disabled="!canEdit" />
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <div>
          <SheetTable title="Career" :columns="2">
            <SheetSelect v-model="wh.status" title="Status" :options="statusTierOpts" :disabled="!canEdit" />
            <SheetSelect v-model="wh.standing" title="Standing" :options="statusStandingOpts" :disabled="!canEdit" />
            <template v-if="canEdit" #actions>
              <AppButton
                icon="lucide:dices"
                iconOnlyWhenNarrow
                :disabled="content.careers.loading.value"
                @click="formGenerateStatusStanding"
              >
                Generate
              </AppButton>
            </template>
          </SheetTable>
          <SheetTable class="-mt-px">
            <SheetField
              v-model="wh.careerTicks"
              type="number"
              title="Advancement"
              :validationStatus="validCareerTicks"
              :disabled="!canEdit"
            />
            <p class="px-2 py-1 bg-white font-sans text-xs text-neutral-600">
              Ticks in the current career (0–36). Level 2 is reached at 10 ticks, level 3 at 22 and level 4 at 36.
            </p>
          </SheetTable>
          <CharacterCareer
            class="-mt-px"
            :disabled="!canEdit"
            :currentCareer="wh.career"
            :pastCareers="wh.careerPath"
            :careerList="content.careers.withAllowed.value"
            :fourEIds="content.careers.fourEIds.value"
            :loading="content.careers.loading.value"
            @reload="content.careers.reload"
            @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
            @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
          />
        </div>
        <Ignored4eModifiersWarning :names="ignored4eModifiers" />
      </div>
    </div>
  </div>
  <SheetCard title="Description" class="my-4">
    <template v-if="canEdit" #actions>
      <AppButton icon="lucide:dices" variant="neutral" @click="populateDescription(wh)">Generate</AppButton>
    </template>
    <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
  </SheetCard>
  <Ignored4eModifiersWarning :names="ignored4eModifiers" class="mb-2" />
  <CharacterAttributes
    v-model:attributeRolls="wh.attributeRolls"
    v-model:attributeAdvances="wh.attributeAdvances"
    :otherAttributes="modifierAttributes"
    :speciesAttributes="wh.getRacialAttributes()"
    :advanceStep="ADVANCE_STEP"
    title="Attributes"
    :rollsValidationStatus="validRolls"
    :advancesValidationStatus="validAdvances"
    :disabled="!canEdit"
  />
  <div class="flex flex-col @2xl:flex-row justify-between text-left gap-4 my-4">
    <CharacterSkills
      :disabled="!canEdit"
      :skills="wh.skills"
      :skillList="content.skills.withAllowed.value"
      :fourEIds="content.skills.fourEIds.value"
      :loading="content.skills.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validSkills"
      :step="ADVANCE_STEP"
      class="flex-1"
      @reload="content.skills.reload"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
      @addSpeciesSkills="
        populateSpeciesSkills5e(wh, content.skills.own.whList.value, generationPropsUtils.generationProps.value)
      "
    />
    <CharacterTalents
      :disabled="!canEdit"
      :talents="wh.talents"
      :talentList="content.talents.withAllowed.value"
      :fourEIds="content.talents.fourEIds.value"
      :loading="content.talents.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validTalents"
      class="flex-1"
      @reload="content.talents.reload"
      @updated="(event) => wh.updateTalents(event.id, event.number, content.talents.own.whList.value)"
      @addSpeciesTalents="
        populateSpeciesTalents(wh, content.talents.own.whList.value, generationPropsUtils.generationProps.value)
      "
    />
  </div>

  <CharacterWealthEncumbrance v-model="wh" :itemList="content.items.withAllowed.value" :disabled="!canEdit" />
  <CharacterItems
    :disabled="!canEdit"
    :equipped="wh.equippedItems"
    :carried="wh.carriedItems"
    :stored="wh.storedItems"
    :itemList="content.items.withAllowed.value"
    :fourEIds="content.items.fourEIds.value"
    :loading="content.items.loading.value || content.careers.loading.value || generationPropsUtils.loading.value"
    :equippedValidationStatus="validEquipped"
    :carriedValidationStatus="validCarried"
    :storedValidationStatus="validStored"
    class="flex-1"
    @reload="content.items.reload"
    @equippedUpdated="(event) => wh.updateItems(event.id, event.number, 'equipped')"
    @carriedUpdated="(event) => wh.updateItems(event.id, event.number, 'carried')"
    @storedUpdated="(event) => wh.updateItems(event.id, event.number, 'stored')"
    @addClassItems="
      populateClassItems(wh, content.careers.withAllowed.value, generationPropsUtils.generationProps.value)
    "
  />

  <CharacterMagicCorruption v-model="wh" :content="content" :disabled="!canEdit" />

  <SheetCard title="Notes" class="my-4">
    <FormTextarea v-model="wh.notes" :validationStatus="validNotes" :disabled="!canEdit" bare />
  </SheetCard>

  <EditorFooter
    :id="id"
    propertyName="Character"
    :name="wh.name"
    list="characters"
    :canEdit="canEdit"
    :hasChanged="hasChanged"
    :submissionState="submissionState"
    :showSubmissionStatus="showSubmissionStatus"
    :submitForm="submitForm"
    :resetForm="resetForm"
    :deleteItem="deleteItem"
  />
</template>

<style scoped></style>
