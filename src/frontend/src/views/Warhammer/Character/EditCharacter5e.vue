<script setup lang="ts">
import { Edition } from "../../../services/wh/common.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/source.ts";
import { useCharacterEdit } from "../../../composables/characterEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Character, characterApi } from "../../../services/wh/character.ts";
import { computed, watch } from "vue";
import EditControls from "../../../components/EditControls.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import AfterSubmit from "../../../components/AfterSubmit.vue";
import FormInput from "../../../components/FormInput.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { printSize, printSpeciesWithRegion, SpeciesWithRegion } from "../../../services/wh/characterUtils.ts";
import { SPECIES_5E } from "../../../services/wh/rules/rules5e.ts";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import {
  careerApi,
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  statusTierList,
} from "../../../services/wh/career.ts";
import { useWith4eContentList } from "../../../composables/with4eContent.ts";
import CharacterCareer from "../../../components/CharacterCareer.vue";
import CharacterAttributes from "../../../components/CharacterAttributes.vue";
import SelectTable from "../../../components/SelectTable.vue";
import SelectIdValueTable from "../../../components/SelectIdValueTable.vue";
import { spellApi } from "../../../services/wh/spell.ts";
import { mutationApi } from "../../../services/wh/mutation.ts";
import { prayerApi } from "../../../services/wh/prayer.ts";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import { skillApi } from "../../../services/wh/skill.ts";
import { talentApi } from "../../../services/wh/talent.ts";
import CharacterSkills from "../../../components/CharacterSkills.vue";
import CharacterTalents from "../../../components/CharacterTalents.vue";
import { itemApi } from "../../../services/wh/item.ts";
import CharacterItems from "../../../components/CharacterItems.vue";
import { traitApi } from "../../../services/wh/trait.ts";
import ModalWindow from "../../../components/ModalWindow.vue";
import ActionButton from "../../../components/ActionButton.vue";
import Ignored4eModifiersWarning from "../../../components/Ignored4eModifiersWarning.vue";
import { useModal } from "../../../composables/modal.ts";

const props = defineProps<{
  id: string;
}>();

const EDITION: Edition = "5e";
// One 5e Advance adds +5 (Q-ADV: advances are stored as points).
const ADVANCE_STEP = 5;

const newCharacter = new Character({
  edition: EDITION,
  name: "New character",
  species: SpeciesWithRegion.HumanReikland,
  id: "create",
  source: defaultSource(),
});

const {
  wh,
  canEdit,
  apiError,
  showApiError,
  loadWh,
  submitForm,
  deleteItem,
  hasChanged,
  submissionState,
  resetForm,
  showSubmissionStatus,
} = useCharacterEdit(newCharacter, characterApi(authRequest), EDITION);

const careerLists = useWith4eContentList(careerApi(authRequest), () => wh.value.allow4e);
const spellLists = useWith4eContentList(spellApi(authRequest), () => wh.value.allow4e);
const prayerLists = useWith4eContentList(prayerApi(authRequest), () => wh.value.allow4e);
const traitLists = useWith4eContentList(traitApi(authRequest), () => wh.value.allow4e);
const mutationLists = useWith4eContentList(mutationApi(authRequest), () => wh.value.allow4e);
const skillLists = useWith4eContentList(skillApi(authRequest), () => wh.value.allow4e);
const talentLists = useWith4eContentList(talentApi(authRequest), () => wh.value.allow4e);
const itemLists = useWith4eContentList(itemApi(authRequest), () => wh.value.allow4e);

await loadWh(props.id);

const validName = computed(() => wh.value.validateName());
const validDesc = computed(() => wh.value.validateDescription());
const validNotes = computed(() => wh.value.validateNotes());
const validFate = computed(() => wh.value.validateFate());
const validFortune = computed(() => wh.value.validateFortune());
const validBrass = computed(() => wh.value.validateBrass());
const validSilver = computed(() => wh.value.validateSilver());
const validGold = computed(() => wh.value.validateGold());
const validSin = computed(() => wh.value.validateSin());
const validCorruption = computed(() => wh.value.validateCorruption());
const validCurrentExp = computed(() => wh.value.validateCurrentExp());
const validSpentExp = computed(() => wh.value.validateSpentExp());
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

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());
const size = computed(() => printSize(wh.value.getSize()));

watch(
  () => talentLists.list5e.whList.value,
  (newVal) => {
    wh.value.hydrateTalentModifiers(newVal);
  },
  { immediate: true },
);

watch(
  () => mutationLists.list5e.whList.value,
  (newVal) => {
    wh.value.hydrateMutationModifiers(newVal);
  },
  { immediate: true },
);

watch(
  () => traitLists.list5e.whList.value,
  (newVal) => {
    wh.value.hydrateTraitModifiers(newVal);
  },
  { immediate: true },
);

const modal = useModal();

// Turning on 4e content is one-way (R6): it asks for confirmation and cannot be undone once saved.
function confirmAllow4e() {
  wh.value.allow4e = true;
  modal.hideModal();
}

// 4e talents, traits and mutations whose modifiers are not applied (R8).
const ignored4eModifiers = computed(() =>
  [
    ...talentLists.fourEOnly.value.filter((x) => x.id in wh.value.talents),
    ...traitLists.fourEOnly.value.filter((x) => wh.value.hasTrait(x.id)),
    ...mutationLists.fourEOnly.value.filter((x) => wh.value.mutations.has(x.id)),
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
  <div class="flex items-center flex-col gap-4">
    <AlertBlock v-if="apiError && showApiError" alertType="red" @close="showApiError = false">
      {{ apiError }}
    </AlertBlock>

    <AlertBlock
      v-if="careerLists.list5e.apiError.value && careerLists.list5e.showApiError.value"
      alertType="red"
      @close="careerLists.list5e.showApiError.value = false"
    >
      {{ careerLists.list5e.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="spellLists.list5e.apiError.value && spellLists.list5e.showApiError.value"
      alertType="red"
      @close="spellLists.list5e.showApiError.value = false"
    >
      {{ spellLists.list5e.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="prayerLists.list5e.apiError.value && prayerLists.list5e.showApiError.value"
      alertType="red"
      @close="prayerLists.list5e.showApiError.value = false"
    >
      {{ prayerLists.list5e.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="mutationLists.list5e.apiError.value && mutationLists.list5e.showApiError.value"
      alertType="red"
      @close="mutationLists.list5e.showApiError.value = false"
    >
      {{ mutationLists.list5e.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="skillLists.list5e.apiError.value && skillLists.list5e.showApiError.value"
      alertType="red"
      @close="skillLists.list5e.showApiError.value = false"
    >
      {{ skillLists.list5e.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="talentLists.list5e.apiError.value && talentLists.list5e.showApiError.value"
      alertType="red"
      @close="talentLists.list5e.showApiError.value = false"
    >
      {{ talentLists.list5e.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create 5e character' : canEdit ? 'Edit 5e character' : wh.name" />
  <div v-if="id !== 'create'" class="border border-neutral-700 rounded p-2 my-4">
    <div class="text-xl">View character</div>
    <div class="mb-4">View the character sheet formatted for gameplay, printing, or exporting.</div>
    <div class="flex">
      <LinkButton routeName="viewCharacter" :params="{ id: id }" :query="{ edition: EDITION }" class="btn btn-sm">
        View character
      </LinkButton>
    </div>
  </div>
  <div class="border border-neutral-700 rounded p-2 my-4">
    <div class="text-xl">4e content</div>
    <div class="mb-2">
      Allow this character to use 4e content that has no 5e version (marked 4e). 4e trappings count as usual; the
      modifiers of 4e talents, traits and mutations are not applied. This cannot be undone.
    </div>
    <label class="flex items-center gap-2 w-fit">
      <input
        type="checkbox"
        class="w-5 h-5 accent-neutral-600"
        :checked="wh.allow4e"
        :disabled="!canEdit || wh.allow4e"
        @click.prevent="modal.showModal('allow4eModal')"
      />
      Allow 4e content
    </label>
  </div>
  <ModalWindow id="allow4eModal">
    <template #header> Allow 4e content </template>
    <template #buttons>
      <div class="flex gap-2">
        <ActionButton class="btn" @click="confirmAllow4e">Allow 4e content</ActionButton>
        <ActionButton class="btn btn-secondary" @click="modal.hideModal()">Cancel</ActionButton>
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
        <FormInput v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
        <p class="-mb-3">Species</p>
        <div class="border border-neutral-300 rounded p-2">
          <SelectInput
            v-model="wh.species"
            title="Species"
            :options="speciesOpts"
            :disabled="!canEdit"
            class="min-w-24 flex-1"
          />
        </div>
        <p class="-mb-3">Fate and fortune</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <FormInput
              v-model="wh.fate"
              type="number"
              title="Fate"
              :validationStatus="validFate"
              :disabled="!canEdit"
            />
            <FormInput
              v-model="wh.fortune"
              type="number"
              title="Fortune"
              :validationStatus="validFortune"
              :disabled="!canEdit"
            />
          </div>
        </div>
        <p class="-mb-3">Status and standing</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <SelectInput
              v-model="wh.status"
              title="Status"
              :options="statusTierOpts"
              :disabled="!canEdit"
              class="min-w-24 flex-1"
            />
            <SelectInput
              v-model="wh.standing"
              title="Standing"
              :options="statusStandingOpts"
              :disabled="!canEdit"
              class="min-w-24 flex-1"
            />
          </div>
        </div>
        <p class="-mb-3">Wealth</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <FormInput
              v-model="wh.brass"
              type="number"
              title="Brass"
              :validationStatus="validBrass"
              :disabled="!canEdit"
            />
            <FormInput
              v-model="wh.silver"
              type="number"
              title="Silver"
              :validationStatus="validSilver"
              :disabled="!canEdit"
            />
            <FormInput
              v-model="wh.gold"
              type="number"
              title="Gold"
              :validationStatus="validGold"
              :disabled="!canEdit"
            />
          </div>
        </div>
        <p class="-mb-3">Sin and corruption</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <FormInput v-model="wh.sin" type="number" title="Sin" :validationStatus="validSin" :disabled="!canEdit" />
            <FormInput
              v-model="wh.corruption"
              type="number"
              title="Corruption"
              :validationStatus="validCorruption"
              :disabled="!canEdit"
            />
          </div>
        </div>
        <p class="-mb-3">Experience</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <FormInput
              v-model="wh.currentExp"
              type="number"
              title="Unspent"
              :validationStatus="validCurrentExp"
              :disabled="!canEdit"
            />
            <FormInput
              v-model="wh.spentExp"
              type="number"
              title="Spent"
              :validationStatus="validSpentExp"
              :disabled="!canEdit"
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
          :disabled="!canEdit"
          :initSelectedCurrentCareer="wh.career"
          :initSelectedPastCareers="wh.careerPath"
          :careerList="careerLists.withAllowed.value"
          :fourEIds="careerLists.fourEIds.value"
          title="Career"
          modalTitle="Modify career"
          :loading="careerLists.loading.value"
          @reload="careerLists.reload"
          @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
          @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
        />
        <FormInput
          v-model="wh.careerTicks"
          type="number"
          title="Career Advancement Tracker"
          :validationStatus="validCareerTicks"
          :disabled="!canEdit"
        />
        <p class="text-sm -mt-3">
          Ticks in the current career (0–36). Level 2 is reached at 10 ticks, level 3 at 22 and level 4 at 36.
        </p>
        <FormTextarea
          v-model="wh.description"
          title="Description"
          :validationStatus="validDesc"
          :disabled="!canEdit"
          class="mt-2 @3xl:mt-0"
        />
        <FormTextarea v-model="wh.notes" title="Notes" :validationStatus="validNotes" :disabled="!canEdit" />
        <Ignored4eModifiersWarning :names="ignored4eModifiers" />
        <p class="-mb-3">Calculated</p>
        <div class="border border-neutral-300 rounded p-2">
          <div class="flex flex-col @2xl:flex-row gap-4">
            <div class="flex-1">
              <p class="mb-3">Movement</p>
              <div class="ml-1">{{ movement }}</div>
            </div>
            <div class="flex-1">
              <p class="mb-3">Size</p>
              <div>{{ size }}</div>
            </div>
            <div class="flex-1">
              <p class="mb-3">Wounds</p>
              <div class="ml-1">{{ wounds }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      :initSkills="wh.skills"
      :skillList="skillLists.withAllowed.value"
      :fourEIds="skillLists.fourEIds.value"
      :loading="skillLists.loading.value"
      :attributes="attributes"
      :validationStatus="validSkills"
      :hideGenerate="true"
      :step="ADVANCE_STEP"
      class="flex-1"
      @reload="skillLists.reload"
      @clearAll="wh.clearSkills(true)"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
    />
    <CharacterTalents
      :disabled="!canEdit"
      :initTalents="wh.talents"
      :talentList="talentLists.withAllowed.value"
      :fourEIds="talentLists.fourEIds.value"
      :loading="talentLists.loading.value"
      :attributes="attributes"
      :validationStatus="validTalents"
      :hideGenerate="true"
      class="flex-1"
      @reload="talentLists.reload"
      @clearAll="wh.clearTalents(true)"
      @updated="(event) => wh.updateTalents(event.id, event.number, talentLists.list5e.whList.value)"
    />
  </div>

  <CharacterItems
    :disabled="!canEdit"
    :initEquipped="wh.equippedItems"
    :initCarried="wh.carriedItems"
    :initStored="wh.storedItems"
    :itemList="itemLists.withAllowed.value"
    :fourEIds="itemLists.fourEIds.value"
    :loading="itemLists.loading.value"
    :hideGenerate="true"
    :equippedValidationStatus="validEquipped"
    :carriedValidationStatus="validCarried"
    :storedValidationStatus="validStored"
    class="flex-1"
    @reload="itemLists.reload"
    @clearAll="wh.clearItems(true)"
    @equippedUpdated="(event) => wh.updateItems(event.id, event.number, 'equipped')"
    @carriedUpdated="(event) => wh.updateItems(event.id, event.number, 'carried')"
    @storedUpdated="(event) => wh.updateItems(event.id, event.number, 'stored')"
  />

  <div class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <SelectTable
      :disabled="!canEdit"
      :initSelectedItems="wh.spells"
      :itemList="spellLists.withAllowed.value"
      :fourEIds="spellLists.fourEIds.value"
      title="Spells"
      modalTitle="Modify spells"
      modalId="characterSpells"
      :loading="spellLists.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      routeName="spell"
      :truncateModalDescription="100"
      class="flex-1 min-w-52"
      @reload="spellLists.reload"
      @selected="(e) => wh.updateSpells(e.id, e.selected)"
      @clearAll="wh.clearSpells(true)"
    />
    <SelectTable
      :disabled="!canEdit"
      :initSelectedItems="wh.prayers"
      :itemList="prayerLists.withAllowed.value"
      :fourEIds="prayerLists.fourEIds.value"
      title="Prayers"
      modalTitle="Modify prayers"
      modalId="characterPrayers"
      :loading="prayerLists.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      routeName="prayer"
      :truncateModalDescription="100"
      class="flex-1 min-w-52"
      @reload="prayerLists.reload"
      @selected="(e) => wh.updatePrayers(e.id, e.selected)"
      @clearAll="wh.clearPrayers(true)"
    />
  </div>

  <div class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <SelectTable
      :disabled="!canEdit"
      :initSelectedItems="wh.mutations"
      :itemList="mutationLists.withAllowed.value"
      :fourEIds="mutationLists.fourEIds.value"
      title="Mutations"
      modalTitle="Modify mutations"
      modalId="characterMutations"
      :loading="mutationLists.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      routeName="mutation"
      :truncateModalDescription="100"
      class="flex-1 min-w-56"
      @reload="mutationLists.reload"
      @selected="(e) => wh.updateMutations(e.id, e.selected, mutationLists.list5e.whList.value)"
      @clearAll="wh.clearMutations(true)"
    />
    <SelectIdValueTable
      :disabled="!canEdit"
      :selected="wh.traits"
      :itemList="traitLists.withAllowed.value"
      :fourEIds="traitLists.fourEIds.value"
      title="Creature traits"
      modalTitle="Modify traits"
      :loading="traitLists.loading.value"
      :clearAllBtn="true"
      :disableDescription="true"
      :allowRepeat="true"
      :validationStatus="wh.validateTraits()"
      routeName="trait"
      :truncateModalDescription="100"
      class="flex-1 min-w-56"
      @reload="traitLists.reload"
      @add="(id) => wh.addTrait(id, traitLists.list5e.whList.value)"
      @remove="(e) => wh.removeTrait(e.index)"
      @selected="(e) => wh.updateTraits(e.id, e.selected, traitLists.list5e.whList.value)"
      @updateValue="(e) => wh.updateTraitValue(e.index, e.value)"
      @clearAll="wh.clearTraits()"
    />
  </div>

  <div class="my-4">
    <PublicPropertyBox v-model="wh.visibility" propertyName="Character" :disabled="!canEdit" />
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
      :readOnly="!canEdit"
    />

    <DeleteBlock
      v-if="id !== 'create' && canEdit"
      propertyName="Character"
      :name="wh.name"
      list="characters"
      :deleteItem="deleteItem"
    />
  </div>
</template>

<style scoped></style>
