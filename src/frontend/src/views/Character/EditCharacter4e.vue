<script setup lang="ts">
import { isNew, NEW_ID } from "@/services/wh/core/entity.ts";
import TextLink from "@/components/ui/TextLink.vue";
import { Edition } from "@/services/wh/core/edition.ts";
import PageHeader from "@/components/ui/PageHeader.vue";
import { defaultSource } from "@/services/wh/core/source.ts";
import { useCharacterContent, useCharacterEdit, useGenerationCareers } from "@/composables/characterEdit.ts";
import { authRequest } from "@/services/auth.ts";
import { Character, characterApi } from "@/services/wh/character/character.ts";
import { computed, ref, watch } from "vue";
import LoadErrors from "@/components/ui/LoadErrors.vue";
import EditorFooter from "@/components/editor/EditorFooter.vue";
import { printSize } from "@/services/wh/character/size.ts";
import {
  getDefaultSpeciesWithRegion,
  getSpeciesFromSpeciesWithRegion,
  getSpeciesWithRegionList,
  printSpeciesRegion,
  SpeciesWithRegion,
  printSpeciesName,
  speciesList,
  speciesWithRegionToSpecies,
} from "@/services/wh/core/species.ts";
import FormTextarea from "@/components/form/FormTextarea.vue";
import { generateCharacter4e } from "@/services/wh/character/generation/4e/generator4e.ts";
import { populateClassItems } from "@/services/wh/character/generation/shared/trappings.ts";
import { populateDescription } from "@/services/wh/character/generation/shared/description.ts";
import { populateName } from "@/services/wh/character/generation/shared/name.ts";
import { populateSpeciesTalents } from "@/services/wh/character/generation/shared/talents.ts";
import { populateStatusAndStanding } from "@/services/wh/character/generation/shared/status.ts";
import { populateFateAndResilience } from "@/services/wh/character/generation/4e/fate4e.ts";
import { populateSpeciesSkills4e } from "@/services/wh/character/generation/4e/skills4e.ts";
import {
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  statusTierList,
} from "@/services/wh/content/career.ts";
import CharacterCareer from "@/components/character/edit/CharacterCareer.vue";
import CharacterAttributes from "@/components/character/edit/CharacterAttributes.vue";
import VisibilityField from "@/components/editor/VisibilityField.vue";
import CharacterStartPanel from "@/components/character/edit/CharacterStartPanel.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import SheetField from "@/components/sheet/SheetField.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";
import EditionBadge from "@/components/edition/EditionBadge.vue";
import { useGenerationProps } from "@/composables/generationProps.ts";
import CharacterSkills from "@/components/character/edit/CharacterSkills.vue";
import CharacterTalents from "@/components/character/edit/CharacterTalents.vue";
import CharacterItems from "@/components/character/edit/CharacterItems.vue";
import CharacterExperience from "@/components/character/edit/CharacterExperience.vue";
import CharacterWealthEncumbrance from "@/components/character/edit/CharacterWealthEncumbrance.vue";
import CharacterMagicCorruption from "@/components/character/edit/CharacterMagicCorruption.vue";

const props = defineProps<{
  id: string;
  // The loaded character; absent for a new one.
  character?: Character;
}>();

const EDITION: Edition = "4e";

const newCharacter = new Character({
  edition: EDITION,
  name: "New character",
  species: SpeciesWithRegion.HumanReikland,
  id: NEW_ID,
  source: defaultSource(),
});

const { wh, canEdit, submitForm, deleteItem, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useCharacterEdit(newCharacter, props.character, characterApi(authRequest), EDITION);

const content = useCharacterContent(wh, EDITION);
const generationPropsUtils = useGenerationProps(authRequest);
generationPropsUtils.loadGenerationProps();

const referenceDataLoading = computed(() => content.loading.value || generationPropsUtils.loading.value);

const validName = computed(() => wh.value.validateName());
const validCurrentExp = computed(() => wh.value.validateCurrentExp());
const validSpentExp = computed(() => wh.value.validateSpentExp());
const validGold = computed(() => wh.value.validateGold());
const validSilver = computed(() => wh.value.validateSilver());
const validBrass = computed(() => wh.value.validateBrass());
const validSin = computed(() => wh.value.validateSin());
const validCorruption = computed(() => wh.value.validateCorruption());
const validTraits = computed(() => wh.value.validateTraits());
const validDesc = computed(() => wh.value.validateDescription());
const validNotes = computed(() => wh.value.validateNotes());
const validFate = computed(() => wh.value.validateFate());
const validFortune = computed(() => wh.value.validateFortune());
const validResilience = computed(() => wh.value.validateResilience());
const validResolve = computed(() => wh.value.validateResolve());
const validRolls = computed(() => wh.value.validateRolls());
const validAdvances = computed(() => wh.value.validateAdvances());
const validSkills = computed(() => wh.value.validateSkills());
const validTalents = computed(() => wh.value.validateTalents());
const validEquipped = computed(() => wh.value.validateEquippedItems());
const validCarried = computed(() => wh.value.validateCarriedItems());
const validStored = computed(() => wh.value.validateStoredItems());

const speciesOpts = speciesList.map((x) => ({ text: printSpeciesName(x), value: x }));

const species = ref(getSpeciesFromSpeciesWithRegion(wh.value.species));
const speciesWithRegionOpts = computed(() =>
  getSpeciesWithRegionList(species.value).map((x) => ({ text: printSpeciesRegion(x), value: x })),
);

const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));
const levelOpts: { text: string; value: 1 | 2 | 3 | 4 }[] = [
  { text: "Level 1", value: 1 },
  { text: "Level 2", value: 2 },
  { text: "Level 3", value: 3 },
  { text: "Level 4", value: 4 },
];

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());
const size = computed(() => printSize(wh.value.getSize()));
const maxEncumbrance = computed(() => wh.value.getMaxEncumbrance());

function formGenerateStatusStanding() {
  if (content.careers.loading.value) {
    return;
  }
  populateStatusAndStanding(wh.value, content.careers.own.whList.value);
}

watch(
  () => species.value,
  (newVal) => {
    if (!getSpeciesWithRegionList(newVal).includes(wh.value.species)) {
      wh.value.species = getDefaultSpeciesWithRegion(newVal);
    }
  },
);

watch(
  () => wh.value.species,
  (newVal) => {
    species.value = speciesWithRegionToSpecies(newVal);
  },
);

// The generator's options: species, then its region or group, career and level.
const selectedGenSpeciesWithRegion = ref(SpeciesWithRegion.HumanReikland);
const selectedGenSpecies = ref(getSpeciesFromSpeciesWithRegion(selectedGenSpeciesWithRegion.value));
const selectedGenSpeciesWithRegionOpts = computed(() =>
  getSpeciesWithRegionList(selectedGenSpecies.value).map((x) => ({ text: printSpeciesRegion(x), value: x })),
);
const selectedGenLevel = ref<1 | 2 | 3 | 4>(1);
const { careerOpts, selectedCareer: selectedGenCareer } = useGenerationCareers(
  selectedGenSpeciesWithRegion,
  content.careers.own.whList,
);

watch(
  () => selectedGenSpecies.value,
  (newVal) => {
    selectedGenSpeciesWithRegion.value = getDefaultSpeciesWithRegion(newVal);
  },
);

const isGenerationDisabled = computed(() => referenceDataLoading.value || careerOpts.value.length === 0);
// What the generator is set to, shown in the start strip after generating.
const generationSummary = computed(() =>
  [
    selectedGenSpeciesWithRegionOpts.value.find((x) => x.value === selectedGenSpeciesWithRegion.value)?.text,
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
  wh.value = generateCharacter4e({
    species: selectedGenSpeciesWithRegion.value,
    career,
    skills: content.skills.own.whList.value,
    talents: content.talents.own.whList.value,
    generationProps: generationPropsUtils.generationProps.value,
    level: selectedGenLevel.value,
  });

  wh.value.hydrateAllModifiers({
    talents: content.talents.own.whList.value,
    mutations: content.mutations.own.whList.value,
    traits: content.traits.own.whList.value,
  });
}

const attributes = computed(() => {
  return wh.value.getTotalAttributes();
});

const modifierAttributes = computed(() => {
  return wh.value.getModifierAttributes();
});
</script>

<template>
  <LoadErrors :states="[...content.loadStates, generationPropsUtils]" />
  <PageHeader :title="isNew(id) ? 'Create character' : canEdit ? 'Edit character' : wh.name" />
  <p v-if="!isNew(id)" class="mt-2">
    <TextLink routeName="viewCharacter" :params="{ id: id }" sameWindow>View character</TextLink>
  </p>
  <CharacterStartPanel
    v-if="canEdit && isNew(id)"
    :generateDisabled="isGenerationDisabled"
    :generationSummary="generationSummary"
    @generate="rollCharacter"
  >
    <template #fields>
      <SheetTable :columns="2">
        <SheetSelect v-model="selectedGenSpecies" title="Species" :options="speciesOpts" />
        <SheetSelect
          v-model="selectedGenSpeciesWithRegion"
          title="Region/Group"
          :options="selectedGenSpeciesWithRegionOpts"
          :disabled="selectedGenSpeciesWithRegionOpts.length <= 1"
        />
        <SheetSelect v-model="selectedGenCareer" title="Career" :options="careerOpts" />
        <SheetSelect v-model="selectedGenLevel" title="Level" :options="levelOpts" />
      </SheetTable>
    </template>
    <template #hint>
      <p class="my-1">
        The generation process of a level 1 character follows all steps from character chapter of the 4e rulebook with
        the exception that species and career cannot be chosen as random at this moment.
      </p>
      <p class="my-1">
        The careers in career box depend on selected species. You can only select careers that are available for that
        species. You can use custom careers to generate characters too.
      </p>
      <p class="my-1">
        Class trappings are added to the character sheet but career specific trappings are not and have to be added
        manually afterward.
      </p>
      <p class="my-1">Generating will override all current entries on the character sheet.</p>
      <p class="my-1">
        High level characters are generated by creating level 1 character and then leveling it up. At each level, the
        character gets 2 talents, 5 attribute advances, and 5 times number of sills for that level (30, 20, 10) of skill
        advances. Skill advances are allocated to the skills from the level character is on. Before advancing to next
        level, 8 skills are selected at random from all available skills (all levels) and advanced enough to satisfy
        criteria of career advancement. Attributes are increased so that each one has enough of advances to level up the
        career.
      </p>
      <p class="my-1">Generating will override all current entries on the character sheet.</p>
    </template>
  </CharacterStartPanel>
  <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
    <div class="flex items-center gap-2">
      Edition
      <EditionBadge edition="4e" large />
    </div>
    <VisibilityField v-model="wh.visibility" propertyName="Character" :disabled="!canEdit" />
  </div>
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
            <SheetSelect v-model="species" title="Species" :options="speciesOpts" :disabled="!canEdit" />
            <SheetSelect
              v-model="wh.species"
              title="Region/Group"
              :options="speciesWithRegionOpts"
              :disabled="!canEdit || speciesWithRegionOpts.length <= 1"
            />
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
            <SheetField
              v-model="wh.resilience"
              type="number"
              title="Resilience"
              :validationStatus="validResilience"
              :disabled="!canEdit"
            />
            <SheetField
              v-model="wh.resolve"
              type="number"
              title="Resolve"
              :validationStatus="validResolve"
              :disabled="!canEdit"
            />
            <template v-if="canEdit" #actions>
              <AppButton icon="lucide:dices" iconOnlyWhenNarrow @click="populateFateAndResilience(wh)">
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
          <CharacterCareer
            class="-mt-px"
            :disabled="!canEdit"
            :currentCareer="wh.career"
            :pastCareers="wh.careerPath"
            :careerList="content.careers.own.whList.value"
            :loading="content.careers.loading.value"
            @reload="content.careers.reload"
            @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
            @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
          />
        </div>
        <CharacterExperience
          v-model:currentExp="wh.currentExp"
          v-model:spentExp="wh.spentExp"
          :currentExpValidation="validCurrentExp"
          :spentExpValidation="validSpentExp"
          :disabled="!canEdit"
        />
      </div>
    </div>
  </div>
  <SheetCard title="Description" class="my-4">
    <template v-if="canEdit" #actions>
      <AppButton icon="lucide:dices" variant="neutral" @click="populateDescription(wh)">Generate</AppButton>
    </template>
    <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
  </SheetCard>
  <CharacterAttributes
    v-model:attributeRolls="wh.attributeRolls"
    v-model:attributeAdvances="wh.attributeAdvances"
    :otherAttributes="modifierAttributes"
    :speciesAttributes="wh.getRacialAttributes()"
    title="Attributes"
    :rollsValidationStatus="validRolls"
    :advancesValidationStatus="validAdvances"
    :disabled="!canEdit"
  />
  <div class="flex flex-col @2xl:flex-row justify-between text-left gap-4 my-4">
    <CharacterSkills
      :disabled="!canEdit"
      :skills="wh.skills"
      :skillList="content.skills.own.whList.value"
      :loading="content.skills.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validSkills"
      class="flex-1"
      @reload="content.skills.reload"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
      @addSpeciesSkills="
        populateSpeciesSkills4e(wh, content.skills.own.whList.value, generationPropsUtils.generationProps.value)
      "
    />
    <CharacterTalents
      :disabled="!canEdit"
      :talents="wh.talents"
      :talentList="content.talents.own.whList.value"
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

  <CharacterWealthEncumbrance
    v-model:gold="wh.gold"
    v-model:silver="wh.silver"
    v-model:brass="wh.brass"
    :goldValidation="validGold"
    :silverValidation="validSilver"
    :brassValidation="validBrass"
    :equipped="wh.equippedItems"
    :carried="wh.carriedItems"
    :itemList="content.items.withAllowed.value"
    :maxEncumbrance="maxEncumbrance"
    :disabled="!canEdit"
  />
  <CharacterItems
    :disabled="!canEdit"
    :equipped="wh.equippedItems"
    :carried="wh.carriedItems"
    :stored="wh.storedItems"
    :itemList="content.items.own.whList.value"
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
      populateClassItems(wh, content.careers.own.whList.value, generationPropsUtils.generationProps.value)
    "
  />

  <CharacterMagicCorruption
    v-model:sin="wh.sin"
    v-model:corruption="wh.corruption"
    :prayers="wh.prayers"
    :spells="wh.spells"
    :mutations="wh.mutations"
    :traits="wh.traits"
    :sinValidation="validSin"
    :corruptionValidation="validCorruption"
    :traitsValidation="validTraits"
    :content="content"
    :disabled="!canEdit"
    @prayerSelected="(e) => wh.updatePrayers(e.id, e.selected)"
    @spellSelected="(e) => wh.updateSpells(e.id, e.selected)"
    @mutationSelected="(e) => wh.updateMutations(e.id, e.selected, content.mutations.own.whList.value)"
    @traitAdded="(id) => wh.addTrait(id, content.traits.own.whList.value)"
    @traitRemoved="(e) => wh.removeTrait(e.index)"
    @traitSelected="(e) => wh.updateTraits(e.id, e.selected, content.traits.own.whList.value)"
    @traitValueUpdated="(e) => wh.updateTraitValue(e.index, e.value)"
  />

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
