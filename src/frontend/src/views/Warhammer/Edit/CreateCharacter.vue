<script setup lang="ts">
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useNewTab } from "../../../composables/newTab.ts";
import { useWhEdit } from "../../../composables/whEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Character, CharacterApi } from "../../../services/wh/character.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../../composables/viewSize.ts";
import { ViewSize } from "../../../utils/viewSize.ts";
import EditControls from "../../../components/EditControls.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormInput from "../../../components/FormInput.vue";
import ActionButton from "../../../components/ActionButton.vue";
import generateName from "../../../services/wh/characterGeneration/generateName.ts";
import {
  printSpeciesWithRegion,
  SpeciesWithRegion,
  speciesWithRegionList,
} from "../../../services/wh/characterUtils.ts";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import { generateFateAndResilience } from "../../../services/wh/characterGeneration/generateCharacter.ts";
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

const props = defineProps<{
  id: string;
}>();

const newCharacter = new Character({
  name: "New character",
  species: SpeciesWithRegion.HumanDefault,
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

const { wh, apiError, showApiError, loadWh, submitForm, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useWhEdit(newCharacter, new CharacterApi(authRequest));

const careerListUtils = useWhList(new CareerApi(authRequest));
careerListUtils.loadWhList();

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

const speciesOpts = speciesWithRegionList.map((x) => ({ text: printSpeciesWithRegion(x), value: x }));
const statusTierOpts = statusTierList.map((x) => ({ text: printStatusTier(x), value: x }));
const statusStandingOpts = statusStandingList.map((x) => ({ text: printStatusStanding(x), value: x }));

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
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'character' ? 'Create character' : wh.canEdit ? 'Edit character' : wh.name" />
  <div
    ref="contentContainerRef"
    class="flex justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? '' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit">
          <ActionButton v-if="wh.canEdit" size="sm" class="ml-2" @click="formGenerateName">Generate</ActionButton>
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
  <CharacterAttributes :cols="isEqualOrGreater" title="Attributes" />
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
