<script setup lang="ts">
import { Edition } from "../../../services/wh/core/edition.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import Header from "../../../components/PageHeader.vue";
import { defaultSource } from "../../../services/wh/core/source.ts";
import { useCharacterEdit } from "../../../composables/characterEdit.ts";
import { authRequest } from "../../../services/auth.ts";
import { Character, characterApi } from "../../../services/wh/character/character.ts";
import { computed, ref, watch } from "vue";
import EditControls from "../../../components/EditControls.vue";
import DeleteBlock from "../../../components/DeleteBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { printSize } from "../../../services/wh/character/size.ts";
import { printSpeciesWithRegion, SpeciesWithRegion } from "../../../services/wh/core/species.ts";
import { SPECIES_5E } from "../../../services/wh/character/rules/rules5e.ts";
import SelectInput from "../../../components/SelectInput.vue";
import FormTextarea from "../../../components/FormTextarea.vue";
import {
  Career,
  careerApi,
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  statusTierList,
} from "../../../services/wh/content/career.ts";
import { useWith4eContentList } from "../../../composables/with4eContent.ts";
import CharacterCareer from "../../../components/CharacterCareer.vue";
import CharacterAttributes from "../../../components/CharacterAttributes.vue";
import SelectTable from "../../../components/SelectTable.vue";
import SelectIdValueTable from "../../../components/SelectIdValueTable.vue";
import { spellApi } from "../../../services/wh/content/spell.ts";
import { mutationApi } from "../../../services/wh/content/mutation.ts";
import { prayerApi } from "../../../services/wh/content/prayer.ts";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import { skillApi } from "../../../services/wh/content/skill.ts";
import { talentApi } from "../../../services/wh/content/talent.ts";
import CharacterSkills from "../../../components/CharacterSkills.vue";
import CharacterTalents from "../../../components/CharacterTalents.vue";
import { itemApi } from "../../../services/wh/content/item.ts";
import CharacterItems from "../../../components/CharacterItems.vue";
import { traitApi } from "../../../services/wh/content/trait.ts";
import ModalWindow from "../../../components/ModalWindow.vue";
import ActionButton from "../../../components/ActionButton.vue";
import Ignored4eModifiersWarning from "../../../components/Ignored4eModifiersWarning.vue";
import { useModal } from "../../../composables/modal.ts";
import HintModal from "../../../components/HintModal.vue";
import SectionCard from "../../../components/SectionCard.vue";
import SectionButton from "../../../components/SectionButton.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetCheckbox from "../../../components/SheetCheckbox.vue";
import SheetCell from "../../../components/SheetCell.vue";
import { encumbranceItems, getEncumbrance } from "../../../services/wh/character/encumbrance.ts";
import EditionBadge from "../../../components/EditionBadge.vue";
import { useGenerationProps5e } from "../../../composables/generationProps.ts";
import { generateCharacter5e } from "../../../services/wh/character/generation/5e/generator5e.ts";
import { populateFateFortune5e } from "../../../services/wh/character/generation/5e/fate5e.ts";
import { populateSpeciesSkills5e } from "../../../services/wh/character/generation/5e/skills5e.ts";
import { populateClassItems } from "../../../services/wh/character/generation/shared/trappings.ts";
import { populateDescription } from "../../../services/wh/character/generation/shared/description.ts";
import { populateName } from "../../../services/wh/character/generation/shared/name.ts";
import { populateSpeciesTalents } from "../../../services/wh/character/generation/shared/talents.ts";
import { populateStatusAndStanding } from "../../../services/wh/character/generation/shared/status.ts";

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

const careerLists = useWith4eContentList(careerApi(authRequest), () => wh.value.allow4e);
const spellLists = useWith4eContentList(spellApi(authRequest), () => wh.value.allow4e);
const prayerLists = useWith4eContentList(prayerApi(authRequest), () => wh.value.allow4e);
const traitLists = useWith4eContentList(traitApi(authRequest), () => wh.value.allow4e);
const mutationLists = useWith4eContentList(mutationApi(authRequest), () => wh.value.allow4e);
const skillLists = useWith4eContentList(skillApi(authRequest), () => wh.value.allow4e);
const talentLists = useWith4eContentList(talentApi(authRequest), () => wh.value.allow4e);
const itemLists = useWith4eContentList(itemApi(authRequest), () => wh.value.allow4e);
const generationPropsUtils = useGenerationProps5e(authRequest);
generationPropsUtils.loadGenerationProps();

// The generator uses 5e content only, whether or not 4e content is allowed.
const generationDataLoading = computed(
  () =>
    careerLists.list5e.loading.value ||
    skillLists.list5e.loading.value ||
    talentLists.list5e.loading.value ||
    itemLists.list5e.loading.value ||
    generationPropsUtils.loading.value,
);

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

const levelOpts = [
  { text: "Level 1", value: 1 },
  { text: "Level 2", value: 2 },
  { text: "Level 3", value: 3 },
  { text: "Level 4", value: 4 },
];

const selectedGenSpecies = ref(SpeciesWithRegion.HumanReikland);
const selectedGenLevel = ref<1 | 2 | 3 | 4>(1);
const selectedGenCareer = ref("");

function genCareerOpts(species: SpeciesWithRegion, careerList: Career[]): { text: string; value: string }[] {
  return careerList
    .filter((x) => x.allowedForSpeciesWithRegion(species))
    .filter((x) => x.level1.exists && x.level2.exists && x.level3.exists && x.level4.exists)
    .map((x) => ({ text: x.name, value: x.id }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

const careerOpts = computed(() => genCareerOpts(selectedGenSpecies.value, careerLists.list5e.whList.value));

watch(
  careerOpts,
  (newVal) => {
    if (!newVal.some((x) => x.value === selectedGenCareer.value)) {
      selectedGenCareer.value = newVal.length > 0 ? newVal[0].value : "";
    }
  },
  { immediate: true },
);

const isGenerationDisabled = computed(() => generationDataLoading.value || careerOpts.value.length === 0);

function rollCharacter() {
  if (isGenerationDisabled.value) {
    return;
  }
  const career = careerLists.list5e.whList.value.find((x) => x.id === selectedGenCareer.value);
  if (!career) {
    return;
  }
  wh.value = generateCharacter5e({
    species: selectedGenSpecies.value,
    career,
    level: selectedGenLevel.value,
    skills: skillLists.list5e.whList.value,
    talents: talentLists.list5e.whList.value,
    generationProps: generationPropsUtils.generationProps.value,
  });

  wh.value.hydrateAllModifiers({
    talents: talentLists.list5e.whList.value,
    mutations: mutationLists.list5e.whList.value,
    traits: traitLists.list5e.whList.value,
  });
}

function formGenerateStatusStanding() {
  if (careerLists.loading.value) {
    return;
  }
  populateStatusAndStanding(wh.value, careerLists.withAllowed.value);
}

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());
const encumbrance = computed(() =>
  getEncumbrance(
    encumbranceItems(wh.value.equippedItems, itemLists.withAllowed.value),
    encumbranceItems(wh.value.carriedItems, itemLists.withAllowed.value),
  ),
);
const maxEncumbrance = computed(() => wh.value.getMaxEncumbrance());
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

// Turning on 4e content is one-way: it asks for confirmation and cannot be undone once saved.
function confirmAllow4e() {
  wh.value.allow4e = true;
  modal.hideModal();
}

// 4e talents, traits and mutations whose modifiers are not applied.
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

    <AlertBlock
      v-if="generationPropsUtils.apiError.value && generationPropsUtils.showApiError.value"
      alertType="red"
      @close="generationPropsUtils.showApiError.value = false"
    >
      {{ generationPropsUtils.apiError.value }}
    </AlertBlock>
  </div>
  <Header :title="id === 'create' ? 'Create character' : canEdit ? 'Edit character' : wh.name" />
  <div v-if="id !== 'create'" class="border border-neutral-700 rounded p-2 my-4">
    <div class="text-xl">View character</div>
    <div class="mb-4">View the character sheet formatted for gameplay, printing, or exporting.</div>
    <div class="flex">
      <LinkButton routeName="viewCharacter" :params="{ id: id }" class="btn btn-sm"> View character </LinkButton>
    </div>
  </div>
  <div v-if="canEdit && id === 'create'" class="border border-neutral-700 rounded p-2 my-4 print:hidden">
    <div class="text-xl">Generate character</div>
    <div class="mb-4">Fill out character sheet automatically by randomly generating character (level 1-4).</div>
    <div class="flex flex-col @2xl:flex-row gap-4">
      <SelectInput
        v-model="selectedGenSpecies"
        title="Species"
        :options="speciesOpts"
        :disabled="!canEdit"
        class="min-w-24 flex-1"
      />
      <SelectInput
        v-model="selectedGenLevel"
        title="Level"
        :options="levelOpts"
        :disabled="!canEdit"
        class="min-w-24 flex-1"
      />
      <SelectInput
        v-model="selectedGenCareer"
        title="Career"
        :options="careerOpts"
        :disabled="!canEdit"
        class="min-w-24 flex-1"
      />
    </div>
    <div class="flex flex-wrap mt-4 gap-4">
      <HintModal buttonText="More details" modalHeader="Character generation" modalId="charGenerationHint">
        <p class="my-1">
          A level 1 character is generated following the character creation chapter of the 5e rulebook, using 5e content
          only. Species and career are chosen, not rolled, so the bonuses for keeping a rolled species or career are not
          given.
        </p>
        <p class="my-1">
          Characteristics are rolled and kept in order: the 6 extra points are spread at random over the 3
          characteristics of the first career level and added to the rolls.
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
          each level, the character takes 1 career talent and a +5 advance in each characteristic it can advance, and
          the rest of the Career Advancement Tracker (10 ticks for level 2, 12 more for level 3, 14 more for level 4) is
          filled with career skill advances. XP is spent as in the rulebook, plus 100 XP for each new level.
        </p>
        <p class="my-1">Generating will override all current entries on the character sheet.</p>
      </HintModal>
      <ActionButton class="btn btn-sm" :disabled="isGenerationDisabled" @click="rollCharacter"> Generate </ActionButton>
    </div>
  </div>
  <div class="flex flex-wrap items-center gap-x-8 gap-y-2 my-4">
    <div class="flex items-center gap-2">
      Edition
      <EditionBadge edition="5e" large />
    </div>
    <div class="flex items-center gap-2">
      <label class="flex items-center gap-2">
        <SheetCheckbox
          :checked="wh.allow4e"
          :disabled="!canEdit || wh.allow4e"
          @click.prevent="modal.showModal('allow4eModal')"
        />
        Allow 4e content
      </label>
      <HintModal modalHeader="Allow 4e content" modalId="allow4eHint">
        <p class="my-1">
          The character can use 4e content that has no 5e version. Such content is marked 4e in the pickers and on the
          character sheet.
        </p>
        <p class="my-1">
          4e trappings count as usual. 4e talents, traits and mutations are listed, but their modifiers are not applied.
        </p>
        <p class="my-1">Once saved, 4e content cannot be turned off for this character.</p>
      </HintModal>
    </div>
    <PublicPropertyBox v-model="wh.visibility" propertyName="Character" :disabled="!canEdit" />
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
        <div>
          <SheetTable>
            <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
            <template v-if="canEdit" #actions>
              <SectionButton icon="lucide:dices" variant="secondary" iconOnlyWhenNarrow @click="populateName(wh)">
                Generate
              </SectionButton>
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
              <SectionButton
                icon="lucide:dices"
                variant="secondary"
                iconOnlyWhenNarrow
                @click="populateFateFortune5e(wh)"
              >
                Generate
              </SectionButton>
            </template>
          </SheetTable>
          <SheetTable :columns="3" class="-mt-px">
            <SheetCell title="Movement">{{ movement }}</SheetCell>
            <SheetCell title="Size">{{ size }}</SheetCell>
            <SheetCell title="Wounds">{{ wounds }}</SheetCell>
          </SheetTable>
        </div>
        <SheetTable title="Experience" :columns="3">
          <SheetField
            v-model="wh.currentExp"
            type="number"
            title="Unspent"
            :validationStatus="validCurrentExp"
            :disabled="!canEdit"
          />
          <SheetField
            v-model="wh.spentExp"
            type="number"
            title="Spent"
            :validationStatus="validSpentExp"
            :disabled="!canEdit"
          />
          <SheetCell title="Total">{{ wh.currentExp + wh.spentExp }}</SheetCell>
        </SheetTable>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <div>
          <SheetTable title="Career" :columns="2">
            <SheetSelect v-model="wh.status" title="Status" :options="statusTierOpts" :disabled="!canEdit" />
            <SheetSelect v-model="wh.standing" title="Standing" :options="statusStandingOpts" :disabled="!canEdit" />
            <template v-if="canEdit" #actions>
              <SectionButton
                icon="lucide:dices"
                variant="secondary"
                iconOnlyWhenNarrow
                :disabled="careerLists.loading.value"
                @click="formGenerateStatusStanding"
              >
                Generate
              </SectionButton>
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
            <p class="px-2 py-1 bg-white text-xs text-neutral-600">
              Ticks in the current career (0–36). Level 2 is reached at 10 ticks, level 3 at 22 and level 4 at 36.
            </p>
          </SheetTable>
          <CharacterCareer
            class="-mt-px"
            :disabled="!canEdit"
            :initSelectedCurrentCareer="wh.career"
            :initSelectedPastCareers="wh.careerPath"
            :careerList="careerLists.withAllowed.value"
            :fourEIds="careerLists.fourEIds.value"
            :loading="careerLists.loading.value"
            @reload="careerLists.reload"
            @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
            @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
          />
        </div>
        <Ignored4eModifiersWarning :names="ignored4eModifiers" />
      </div>
    </div>
  </div>
  <SectionCard title="Description" class="my-4">
    <template v-if="canEdit" #actions>
      <SectionButton icon="lucide:dices" variant="neutral" @click="populateDescription(wh)">Generate</SectionButton>
    </template>
    <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
  </SectionCard>
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
      :loading="skillLists.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validSkills"
      :step="ADVANCE_STEP"
      class="flex-1"
      @reload="skillLists.reload"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
      @addSpeciesSkills="
        populateSpeciesSkills5e(wh, skillLists.list5e.whList.value, generationPropsUtils.generationProps.value)
      "
    />
    <CharacterTalents
      :disabled="!canEdit"
      :initTalents="wh.talents"
      :talentList="talentLists.withAllowed.value"
      :fourEIds="talentLists.fourEIds.value"
      :loading="talentLists.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validTalents"
      class="flex-1"
      @reload="talentLists.reload"
      @updated="(event) => wh.updateTalents(event.id, event.number, talentLists.list5e.whList.value)"
      @addSpeciesTalents="
        populateSpeciesTalents(wh, talentLists.list5e.whList.value, generationPropsUtils.generationProps.value)
      "
    />
  </div>

  <div class="flex flex-wrap gap-4 my-4">
    <SheetTable title="Wealth" :columns="3" class="grow basis-80">
      <SheetField v-model="wh.gold" type="number" title="Gold" :validationStatus="validGold" :disabled="!canEdit" />
      <SheetField
        v-model="wh.silver"
        type="number"
        title="Silver"
        :validationStatus="validSilver"
        :disabled="!canEdit"
      />
      <SheetField v-model="wh.brass" type="number" title="Brass" :validationStatus="validBrass" :disabled="!canEdit" />
    </SheetTable>
    <SheetTable title="Encumbrance" :columns="3" class="grow basis-80">
      <SheetCell title="Weapons">{{ encumbrance.weapons }}</SheetCell>
      <SheetCell title="Armour">{{ encumbrance.armour }}</SheetCell>
      <SheetCell title="Other">{{ encumbrance.otherEquipped }}</SheetCell>
      <SheetCell title="Carried">{{ encumbrance.carried }}</SheetCell>
      <SheetCell title="Total">
        <span
          :class="{ 'text-danger-600 font-semibold': encumbrance.total > maxEncumbrance }"
          :title="encumbrance.total > maxEncumbrance ? 'Over the Encumbrance limit' : undefined"
        >
          {{ encumbrance.total }}
        </span>
      </SheetCell>
      <SheetCell title="Max">{{ maxEncumbrance }}</SheetCell>
    </SheetTable>
  </div>
  <CharacterItems
    :disabled="!canEdit"
    :initEquipped="wh.equippedItems"
    :initCarried="wh.carriedItems"
    :initStored="wh.storedItems"
    :itemList="itemLists.withAllowed.value"
    :fourEIds="itemLists.fourEIds.value"
    :loading="itemLists.loading.value || careerLists.loading.value || generationPropsUtils.loading.value"
    :equippedValidationStatus="validEquipped"
    :carriedValidationStatus="validCarried"
    :storedValidationStatus="validStored"
    class="flex-1"
    @reload="itemLists.reload"
    @clearAll="wh.clearItems(true)"
    @equippedUpdated="(event) => wh.updateItems(event.id, event.number, 'equipped')"
    @carriedUpdated="(event) => wh.updateItems(event.id, event.number, 'carried')"
    @storedUpdated="(event) => wh.updateItems(event.id, event.number, 'stored')"
    @addClassItems="populateClassItems(wh, careerLists.withAllowed.value, generationPropsUtils.generationProps.value)"
  />

  <div class="flex justify-between text-left gap-4 my-4 flex-wrap">
    <div class="grow basis-80">
      <SheetTable title="Magic and Faith">
        <SheetField
          v-model="wh.sin"
          type="number"
          title="Sin Points"
          :validationStatus="validSin"
          :disabled="!canEdit"
        />
      </SheetTable>
      <SelectTable
        :disabled="!canEdit"
        :initSelectedItems="wh.prayers"
        :itemList="prayerLists.withAllowed.value"
        :fourEIds="prayerLists.fourEIds.value"
        title="Prayers"
        modalTitle="Edit prayers"
        modalId="characterPrayers"
        :loading="prayerLists.loading.value"
        removable
        :disableDescription="true"
        routeName="prayer"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="prayerLists.reload"
        @selected="(e) => wh.updatePrayers(e.id, e.selected)"
      />
      <SelectTable
        :disabled="!canEdit"
        :initSelectedItems="wh.spells"
        :itemList="spellLists.withAllowed.value"
        :fourEIds="spellLists.fourEIds.value"
        title="Spells"
        modalTitle="Edit spells"
        modalId="characterSpells"
        :loading="spellLists.loading.value"
        removable
        :disableDescription="true"
        routeName="spell"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="spellLists.reload"
        @selected="(e) => wh.updateSpells(e.id, e.selected)"
      />
    </div>
    <div class="grow basis-80">
      <SheetTable title="Traits and Corruption">
        <SheetField
          v-model="wh.corruption"
          type="number"
          title="Corruption Points"
          :validationStatus="validCorruption"
          :disabled="!canEdit"
        />
      </SheetTable>
      <SelectTable
        :disabled="!canEdit"
        :initSelectedItems="wh.mutations"
        :itemList="mutationLists.withAllowed.value"
        :fourEIds="mutationLists.fourEIds.value"
        title="Mutations"
        modalTitle="Edit mutations"
        modalId="characterMutations"
        :loading="mutationLists.loading.value"
        removable
        :disableDescription="true"
        routeName="mutation"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="mutationLists.reload"
        @selected="(e) => wh.updateMutations(e.id, e.selected, mutationLists.list5e.whList.value)"
      />
      <SelectIdValueTable
        :disabled="!canEdit"
        :selected="wh.traits"
        :itemList="traitLists.withAllowed.value"
        :fourEIds="traitLists.fourEIds.value"
        title="Creature Traits"
        modalTitle="Edit traits"
        :loading="traitLists.loading.value"
        :disableDescription="true"
        :allowRepeat="true"
        :validationStatus="wh.validateTraits()"
        routeName="trait"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="traitLists.reload"
        @add="(id) => wh.addTrait(id, traitLists.list5e.whList.value)"
        @remove="(e) => wh.removeTrait(e.index)"
        @selected="(e) => wh.updateTraits(e.id, e.selected, traitLists.list5e.whList.value)"
        @updateValue="(e) => wh.updateTraitValue(e.index, e.value)"
      />
    </div>
  </div>

  <SectionCard title="Notes" class="my-4">
    <FormTextarea v-model="wh.notes" :validationStatus="validNotes" :disabled="!canEdit" bare />
  </SectionCard>

  <div class="mt-4">
    <div class="flex flex-col md:flex-row gap-4">
      <EditControls
        :submissionState="submissionState"
        :showSubmissionStatus="showSubmissionStatus"
        propertyName="Character"
        :saving="submissionState.status === 'inProgress'"
        list="characters"
        :allowAddAnother="id === 'create'"
        :confirmExit="hasChanged"
        :submitForm="submitForm"
        :resetForm="resetForm"
        :readOnly="!canEdit"
        class="flex-1"
      />
      <DeleteBlock
        v-if="id !== 'create' && canEdit"
        propertyName="Character"
        :name="wh.name"
        list="characters"
        :deleteItem="deleteItem"
        class="flex-1"
      />
    </div>
  </div>
</template>

<style scoped></style>
