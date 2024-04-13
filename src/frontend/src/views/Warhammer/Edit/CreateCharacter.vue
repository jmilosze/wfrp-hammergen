<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Character, CharacterApi } from "../../../services/wh/character.ts";
import { computed, ref, watch } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import EditControls from "../../../components/EditControls.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormInput from "../../../components/FormInput.vue";
import ActionButton from "../../../components/ActionButton.vue";
import generateName from "../../../services/wh/characterGeneration/generateName.ts";
import {
  DEFAULT_CAREER_ID,
  printSpeciesWithRegion,
  SpeciesWithRegion,
  speciesWithRegionList,
} from "../../../services/wh/characterUtils.ts";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import {
  generateCharacter,
  generateFateAndResilience,
} from "../../../services/wh/characterGeneration/generateCharacter.ts";
import { rollDice } from "../../../utils/random.ts";
import generateDescription from "../../../services/wh/characterGeneration/generateDescription.ts";
import {
  Career,
  CareerApi,
  isLevel,
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  StatusTier,
  statusTierList,
} from "../../../services/wh/career.ts";
import { useWhList } from "../../../composables/whList.ts";
import CharacterCareer from "../../../components/CharacterCareer.vue";
import CharacterAttributes from "../../../components/CharacterAttributes.vue";
import { getAttributes } from "../../../services/wh/attributes.ts";
import SelectTable from "../../../components/SelectTable.vue";
import { SpellApi } from "../../../services/wh/spell.ts";
import { MutationApi } from "../../../services/wh/mutation.ts";
import { PrayerApi } from "../../../services/wh/prayer.ts";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import HintModal from "../../../components/HintModal.vue";
import { SkillApi } from "../../../services/wh/skill.ts";
import { TalentApi } from "../../../services/wh/talent.ts";
import { useGenerationProps } from "../../../composables/generationProps.ts";
import CharacterSkills from "../../../components/CharacterSkills.vue";
import CharacterTalents from "../../../components/CharacterTalents.vue";

const props = defineProps<{
  id: string;
}>();

const newCharacter = new Character({
  name: "New character",
  species: SpeciesWithRegion.HumanReikland,
  canEdit: true,
  id: "create",
  shared: false,
  source: defaultSource(),
});

const selectedGenSpecies = ref(SpeciesWithRegion.HumanReikland);
const selectedGenLevel = ref(1);
const selectedGenCareer = ref(DEFAULT_CAREER_ID);

const { openInNewTab } = useNewTab();

const { wh, apiError, showApiError, loadWh, submitForm, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useWhEdit(newCharacter, new CharacterApi(authRequest));

const careerListUtils = useWhList(new CareerApi(authRequest));
careerListUtils.loadWhList();
const spellListUtils = useWhList(new SpellApi(authRequest));
spellListUtils.loadWhList();
const prayerListUtils = useWhList(new PrayerApi(authRequest));
prayerListUtils.loadWhList();
const mutationListUtils = useWhList(new MutationApi(authRequest));
mutationListUtils.loadWhList();
const skillListUtils = useWhList(new SkillApi(authRequest));
skillListUtils.loadWhList();
const talentListUtils = useWhList(new TalentApi(authRequest));
talentListUtils.loadWhList();
const generationPropsUtils = useGenerationProps(authRequest);
generationPropsUtils.loadGenerationProps();

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const smSize = useElSize(ViewSize.sm, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validNotes = computed(() => wh.value.validateNotes());
const validFate = computed(() => wh.value.validateFate());
const validFortune = computed(() => wh.value.validateFortune());
const validResilience = computed(() => wh.value.validateResilience());
const validResolve = computed(() => wh.value.validateResolve());
const validBrass = computed(() => wh.value.validateBrass());
const validSilver = computed(() => wh.value.validateSilver());
const validGold = computed(() => wh.value.validateGold());
const validSin = computed(() => wh.value.validateSin());
const validCorruption = computed(() => wh.value.validateCorruption());
const validCurrentExp = computed(() => wh.value.validateCurrentExp());
const validSpentExp = computed(() => wh.value.validateSpentExp());
const validRolls = computed(() => wh.value.validateRolls());
const validAdvances = computed(() => wh.value.validateAdvances());

const speciesOpts = speciesWithRegionList
  .filter((x) => x !== SpeciesWithRegion.HumanDefault)
  .map((x) => ({ text: printSpeciesWithRegion(x), value: x }));
const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));
const levelOpts = [
  { text: "Level 1", value: 1 },
  { text: "Level 2", value: 2 },
  { text: "Level 3", value: 3 },
  { text: "Level 4", value: 4 },
];
const careerOpts = ref([] as { text: string; value: string }[]);

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());

function formGenerateName() {
  wh.value.name = generateName(wh.value.species);
}

function formGenerateFateResilience() {
  [wh.value.fate, wh.value.resilience] = generateFateAndResilience(wh.value.species, rollDice);
  wh.value.fortune = wh.value.fate;
  wh.value.resolve = wh.value.resilience;
}

function formGenerateDescription() {
  wh.value.description = generateDescription(wh.value.species);
}

function formGenerateStatusStanding() {
  let career = careerListUtils.whList.value.find((x) => x.id === wh.value.career.id);
  if (!career) {
    career = new Career();
  }

  if (isLevel(wh.value.career.number)) {
    const careerWithLevel = career.getLevel(wh.value.career.number);
    wh.value.status = careerWithLevel.status;
    wh.value.standing = careerWithLevel.standing;
  } else {
    wh.value.status = StatusTier.Brass;
    wh.value.standing = 0;
  }
}

watch(
  () => selectedGenSpecies.value,
  (newVal) => {
    careerOpts.value = setCareerOpts(newVal, careerListUtils.whList.value);
    if (!careerOpts.value.some((x) => x.value === selectedGenCareer.value)) {
      if (careerOpts.value.length > 0) {
        selectedGenCareer.value = careerOpts.value[0].value;
      } else {
        selectedGenCareer.value = DEFAULT_CAREER_ID;
      }
    }
  },
  { immediate: true },
);

watch(
  () => careerListUtils.whList.value,
  (newVal) => {
    careerOpts.value = setCareerOpts(selectedGenSpecies.value, newVal);
    if (!careerOpts.value.some((x) => x.value === selectedGenCareer.value)) {
      if (newVal.length > 0) {
        selectedGenCareer.value = careerOpts.value[0].value;
      } else {
        selectedGenCareer.value = DEFAULT_CAREER_ID;
      }
    }
  },
  { immediate: true },
);

function setCareerOpts(species: SpeciesWithRegion, careerList: Career[]): { text: string; value: string }[] {
  if (!careerList) {
    return [];
  }

  return careerList
    .filter((x) => x.allowedForSpeciesWithRegion(species))
    .map((x) => ({ text: x.name, value: x.id }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

function rollCharacter() {
  const career = careerListUtils.whList.value.find((x) => x.id === selectedGenCareer.value);
  if (!career) {
    return;
  }
  wh.value = generateCharacter(
    selectedGenSpecies.value,
    career,
    skillListUtils.whList.value,
    talentListUtils.whList.value,
    generationPropsUtils.generationProps.value,
    selectedGenLevel.value as 1 | 2 | 3 | 4,
  );
}

const attributes = computed(() => {
  return wh.value.getTotalAttributes();
});
</script>

<template>
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="careerListUtils.apiError.value && careerListUtils.showApiError.value"
      alertType="red"
      @click="careerListUtils.showApiError.value = false"
    >
      {{ careerListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="spellListUtils.apiError.value && spellListUtils.showApiError.value"
      alertType="red"
      @click="spellListUtils.showApiError.value = false"
    >
      {{ spellListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="prayerListUtils.apiError.value && prayerListUtils.showApiError.value"
      alertType="red"
      @click="prayerListUtils.showApiError.value = false"
    >
      {{ prayerListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="mutationListUtils.apiError.value && mutationListUtils.showApiError.value"
      alertType="red"
      @click="mutationListUtils.showApiError.value = false"
    >
      {{ mutationListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="skillListUtils.apiError.value && skillListUtils.showApiError.value"
      alertType="red"
      @click="skillListUtils.showApiError.value = false"
    >
      {{ skillListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="talentListUtils.apiError.value && talentListUtils.showApiError.value"
      alertType="red"
      @click="talentListUtils.showApiError.value = false"
    >
      {{ talentListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="generationPropsUtils.apiError.value && generationPropsUtils.showApiError.value"
      alertType="red"
      @click="generationPropsUtils.showApiError.value = false"
    >
      {{ generationPropsUtils.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'character' ? 'Create character' : wh.canEdit ? 'Edit character' : wh.name" />
  <div class="border border-neutral-700 rounded p-2 my-4">
    <div class="text-xl">Generate character</div>
    <div class="mb-4">Fill out character sheet automatically by randomly generating character (level 1-4).</div>
    <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
      <SelectInput
        v-model="selectedGenSpecies"
        title="Species"
        :options="speciesOpts"
        :disabled="!wh.canEdit"
        class="min-w-24 flex-1"
      />
      <SelectInput
        v-model="selectedGenLevel"
        title="Level"
        :options="levelOpts"
        :disabled="!wh.canEdit"
        class="min-w-24 flex-1"
      />
      <SelectInput
        v-model="selectedGenCareer"
        title="Career"
        :options="careerOpts"
        :disabled="!wh.canEdit"
        class="min-w-24 flex-1"
      />
    </div>
    <div class="flex flex-wrap mt-4 gap-4">
      <HintModal
        buttonText="More details"
        buttonSize="sm"
        modalHeader="Character generation"
        modalId="charGenerationHint"
      >
        <p class="my-1">
          The generation process of a level 1 character follows all steps from character chapter of the rulebook with
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
          character gets 2 talents, 5 attribute advances, and 5 times number of sills for that level (30, 20, 10) of
          skill advances. Skill advances are allocated to the skills from the level character is on. Before advancing to
          next level, 8 skills are selected at random from all available skills (all levels) and advanced enough to
          satisfy criteria of career advancement. Attributes are increased so that each one has enough of advances to
          level up the career.
        </p>
        <p class="my-1">Generating will override all current entries on the character sheet.</p>
      </HintModal>
      <ActionButton size="sm" @click="rollCharacter">Generate</ActionButton>
    </div>
  </div>
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit">
          <ActionButton v-if="wh.canEdit" size="sm" class="ml-2 h-full" @click="formGenerateName"
            >Generate</ActionButton
          >
        </FormInput>
        <SelectInput
          v-model="wh.species"
          title="Species"
          :options="speciesOpts"
          :disabled="!wh.canEdit"
          class="min-w-24 flex-1"
        />
        <div class="flex flex-wrap items-center gap-2 -mb-3">
          <p class="">Fate and resilience</p>
          <ActionButton v-if="wh.canEdit" size="sm" @click="formGenerateFateResilience">Generate</ActionButton>
        </div>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <FormInput
              v-model="wh.fate"
              type="number"
              title="Fate"
              :validationStatus="validFate"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.fortune"
              type="number"
              title="Fortune"
              :validationStatus="validFortune"
              :disabled="!wh.canEdit"
            />
          </div>

          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <FormInput
              v-model="wh.resilience"
              type="number"
              title="Resilience"
              :validationStatus="validResilience"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.resolve"
              type="number"
              title="Resolve"
              :validationStatus="validResolve"
              :disabled="!wh.canEdit"
            />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 -mb-3">
          <p class="">Status and standing</p>
          <ActionButton
            v-if="wh.canEdit && !careerListUtils.loading.value"
            size="sm"
            @click="formGenerateStatusStanding"
            >Generate</ActionButton
          >
        </div>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <SelectInput
              v-model="wh.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!wh.canEdit"
              class="min-w-24 flex-1"
            />
          </div>
        </div>
        <p class="-mb-3">Wealth</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <FormInput
              v-model="wh.brass"
              type="number"
              title="Brass"
              :validationStatus="validBrass"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.silver"
              type="number"
              title="Silver"
              :validationStatus="validSilver"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.gold"
              type="number"
              title="Gold"
              :validationStatus="validGold"
              :disabled="!wh.canEdit"
            />
          </div>
        </div>
        <p class="-mb-3">Sin and corruption</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <FormInput
              v-model="wh.sin"
              type="number"
              title="Sin"
              :validationStatus="validSin"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.corruption"
              type="number"
              title="Corruption"
              :validationStatus="validCorruption"
              :disabled="!wh.canEdit"
            />
          </div>
        </div>
        <p class="-mb-3">Experience</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <FormInput
              v-model="wh.currentExp"
              type="number"
              title="Unspent"
              :validationStatus="validCurrentExp"
              :disabled="!wh.canEdit"
            />
            <FormInput
              v-model="wh.spentExp"
              type="number"
              title="Spent"
              :validationStatus="validSpentExp"
              :disabled="!wh.canEdit"
            />
            <div>
              <p class="mb-3">Total</p>
              <div class="ml-2">{{ wh.currentExp + wh.spentExp }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <CharacterCareer
          :disabled="!wh.canEdit"
          :initSelectedCurrentCareer="wh.career"
          :initSelectedPastCareers="wh.careerPath"
          :careerList="careerListUtils.whList.value"
          title="Career"
          modalTitle="Modify career"
          :loading="careerListUtils.loading.value"
          @createNew="openInNewTab('career', { id: 'create' })"
          @reload="careerListUtils.loadWhList"
          @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
          @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
        />
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
          :class="[isEqualOrGreater ? '' : 'mt-2']"
        >
          <ActionButton class="mb-1" size="sm" @click="formGenerateDescription">Generate</ActionButton>
        </FormTextarea>
        <FormTextarea v-model="wh.notes" title="Notes" :validationStatus="validNotes" :disabled="!wh.canEdit" />
        <p class="-mb-3">Calculated</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex gap-4" :class="smSize.isEqualOrGreater.value ? [''] : ['flex-col']">
            <div class="flex-1">
              <p class="mb-3">Movement</p>
              <div class="ml-2">{{ movement }}</div>
            </div>
            <div class="flex-1">
              <p class="mb-3">Wounds (unmodified by Hardy)</p>
              <div class="ml-2">{{ wounds }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CharacterAttributes
    v-model:attributeRolls="wh.attributeRolls"
    v-model:attributeAdvances="wh.attributeAdvances"
    :otherAttributes="getAttributes()"
    :species="wh.species"
    :cols="isEqualOrGreater"
    title="Attributes"
    :rollsValidationStatus="validRolls"
    :advancesValidationStatus="validAdvances"
  />
  <div ref="contentContainerRef" class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <CharacterSkills
      :disabled="!wh.canEdit"
      :initSkills="wh.skills"
      :skillList="skillListUtils.whList.value"
      :loading="skillListUtils.loading.value"
      :attributes="attributes"
      class="flex-1 min-w-52"
      @createNew="openInNewTab('skill', { id: 'create' })"
      @reload="skillListUtils.loadWhList"
      @clearAll="wh.clearSkills(true)"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
      @addSpeciesSkills="
        wh.addSpeciesSkills(skillListUtils.whList.value, generationPropsUtils.generationProps.value, true)
      "
    />
    <CharacterTalents
      :disabled="!wh.canEdit"
      :initTalents="wh.talents"
      :talentList="talentListUtils.whList.value"
      :loading="talentListUtils.loading.value"
      :attributes="attributes"
      class="flex-1 min-w-52"
      @createNew="openInNewTab('talent', { id: 'create' })"
      @reload="talentListUtils.loadWhList"
      @clearAll="wh.clearTalents(true)"
      @updated="(event) => wh.updateTalents(event.id, event.number)"
      @addSpeciesTalents="console.log('add species talents')"
    />
  </div>

  <div ref="contentContainerRef" class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <SelectTable
      :disabled="!wh.canEdit"
      :initSelectedItems="wh.spells"
      :itemList="spellListUtils.whList.value"
      title="Spells"
      modalTitle="Modify spells"
      modalId="characterSpells"
      :loading="spellListUtils.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      class="flex-1 min-w-52"
      @createNew="openInNewTab('spell', { id: 'create' })"
      @reload="spellListUtils.loadWhList"
      @selected="(e) => wh.updateSpells(e.id, e.selected)"
      @clearAll="wh.clearSpells(true)"
    />
    <SelectTable
      :disabled="!wh.canEdit"
      :initSelectedItems="wh.prayers"
      :itemList="prayerListUtils.whList.value"
      title="Prayers"
      modalTitle="Modify prayers"
      modalId="characterPrayers"
      :loading="prayerListUtils.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      class="flex-1 min-w-52"
      @createNew="openInNewTab('prayer', { id: 'create' })"
      @reload="prayerListUtils.loadWhList"
      @selected="(e) => wh.updatePrayers(e.id, e.selected)"
      @clearAll="wh.clearPrayers(true)"
    />
    <SelectTable
      :disabled="!wh.canEdit"
      :initSelectedItems="wh.mutations"
      :itemList="mutationListUtils.whList.value"
      title="Mutations"
      modalTitle="Modify mutations"
      modalId="characterMutations"
      :loading="mutationListUtils.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      class="flex-1 min-w-56"
      @createNew="openInNewTab('mutation', { id: 'create' })"
      @reload="mutationListUtils.loadWhList"
      @selected="(e) => wh.updateMutations(e.id, e.selected)"
      @clearAll="wh.clearMutations(true)"
    />
  </div>

  <div class="my-4">
    <PublicPropertyBox v-model="wh.shared" propertyName="Character" :disabled="!wh.canEdit" />
  </div>

  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit my-2"
      @close="showSubmissionStatus = false"
    />

    <EditControls
      :saving="submissionState.status === 'inProgress'"
      list="characters"
      :allowAddAnother="id === 'create'"
      :confirmExit="hasChanged"
      :submitForm="submitForm"
      :resetForm="resetForm"
      :readOnly="!wh.canEdit"
    ></EditControls>
  </div>
</template>

<style scoped></style>
