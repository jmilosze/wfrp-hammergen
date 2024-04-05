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

const props = defineProps<{
  id: string;
}>();

const newCareer = new Character({
  name: "New character",
  species: SpeciesWithRegion.HumanDefault,
  canEdit: true,
  id: "create",
  shared: true,
  source: defaultSource(),
});

const { openInNewTab } = useNewTab();

const {
  wh,
  initSources,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useWhEdit(newCareer, new CharacterApi(authRequest));

await loadWh(props.id);

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validNotes = computed(() => wh.value.validateNotes());
const validFate = computed(() => wh.value.validateFate());
const validFortune = computed(() => wh.value.validateFortune());
const validResilience = computed(() => wh.value.validateResilience());
const validResolve = computed(() => wh.value.validateResolve());

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

const speciesOpts = speciesWithRegionList.map((x) => ({ text: printSpeciesWithRegion(x), value: x }));
</script>

<template>
  <div class="flex justify-center">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @click="showApiError = false">
      {{ apiError }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create career' : wh.canEdit ? 'Edit career' : wh.name" />
  <div
    ref="contentContainerRef"
    class="justify-between text-left gap-4 my-4"
    :class="[isEqualOrGreater ? 'flex' : 'flex-col']"
  >
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!wh.canEdit">
          <ActionButton class="ml-2" @click="formGenerateName">Generate</ActionButton>
        </FormInput>
        <SelectInput
          v-model="wh.species"
          title="Species"
          :options="speciesOpts"
          :disabled="!wh.canEdit"
          class="min-w-24 flex-1"
        />
        <div class="flex flex-wrap items-center gap-2">
          <p class="text-xl">Fate and resilience</p>
          <ActionButton @click="formGenerateFateResilience">Generate</ActionButton>
        </div>
        <div class="flex gap-4">
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
        <div class="flex gap-4">
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
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!wh.canEdit"
          :class="[isEqualOrGreater ? '' : 'mt-2']"
        >
          <ActionButton class="mb-2" @click="formGenerateDescription">Generate</ActionButton>
        </FormTextarea>
        <FormTextarea v-model="wh.notes" title="Notes" :validationStatus="validNotes" :disabled="!wh.canEdit" />
      </div>
    </div>
  </div>
  <div class="mt-4">
    <AfterSubmit
      :visible="showSubmissionStatus"
      :submissionState="submissionState"
      class="w-fit"
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
