<script setup lang="ts">
import SectionLink from "../../../components/SectionLink.vue";
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
import { printSize } from "../../../services/wh/character/size.ts";
import {
  getDefaultSpeciesWithRegion,
  getSpeciesFromSpeciesWithRegion,
  getSpeciesWithRegionList,
  printSpeciesRegion,
  SpeciesWithRegion,
  printSpeciesName,
  speciesList,
  speciesWithRegionToSpecies,
} from "../../../services/wh/core/species.ts";
import FormTextarea from "../../../components/FormTextarea.vue";
import { generateCharacter4e } from "../../../services/wh/character/generation/4e/generator4e.ts";
import { populateClassItems } from "../../../services/wh/character/generation/shared/trappings.ts";
import { populateDescription } from "../../../services/wh/character/generation/shared/description.ts";
import { populateName } from "../../../services/wh/character/generation/shared/name.ts";
import { populateSpeciesTalents } from "../../../services/wh/character/generation/shared/talents.ts";
import { populateStatusAndStanding } from "../../../services/wh/character/generation/shared/status.ts";
import { populateFateAndResilience } from "../../../services/wh/character/generation/4e/fate4e.ts";
import { populateSpeciesSkills4e } from "../../../services/wh/character/generation/4e/skills4e.ts";
import {
  Career,
  careerApi,
  printStatusStanding,
  printStatusTier,
  statusStandingList,
  statusTierList,
} from "../../../services/wh/content/career.ts";
import { useWhList } from "../../../composables/whList.ts";
import CharacterCareer from "../../../components/CharacterCareer.vue";
import CharacterAttributes from "../../../components/CharacterAttributes.vue";
import SelectTable from "../../../components/SelectTable.vue";
import SelectIdValueTable from "../../../components/SelectIdValueTable.vue";
import { spellApi } from "../../../services/wh/content/spell.ts";
import { mutationApi } from "../../../services/wh/content/mutation.ts";
import { prayerApi } from "../../../services/wh/content/prayer.ts";
import PublicPropertyBox from "../../../components/PublicPropertyBox.vue";
import CharacterStartPanel from "../../../components/CharacterStartPanel.vue";
import SectionCard from "../../../components/SectionCard.vue";
import SectionButton from "../../../components/SectionButton.vue";
import SheetField from "../../../components/SheetField.vue";
import SheetSelect from "../../../components/SheetSelect.vue";
import SheetTable from "../../../components/SheetTable.vue";
import SheetCell from "../../../components/SheetCell.vue";
import { encumbranceItems, getEncumbrance } from "../../../services/wh/character/encumbrance.ts";
import EditionBadge from "../../../components/EditionBadge.vue";
import { skillApi } from "../../../services/wh/content/skill.ts";
import { talentApi } from "../../../services/wh/content/talent.ts";
import { useGenerationProps } from "../../../composables/generationProps.ts";
import CharacterSkills from "../../../components/CharacterSkills.vue";
import CharacterTalents from "../../../components/CharacterTalents.vue";
import { itemApi } from "../../../services/wh/content/item.ts";
import CharacterItems from "../../../components/CharacterItems.vue";
import { traitApi } from "../../../services/wh/content/trait.ts";

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
  id: "create",
  source: defaultSource(),
});

const selectedGenSpeciesWithRegion = ref(SpeciesWithRegion.HumanReikland);

const selectedGenSpecies = ref(getSpeciesFromSpeciesWithRegion(selectedGenSpeciesWithRegion.value));
const selectedGenSpeciesWithRegionOpts = computed(() =>
  getSpeciesWithRegionList(selectedGenSpecies.value).map((x) => ({ text: printSpeciesRegion(x), value: x })),
);

const selectedGenLevel = ref<1 | 2 | 3 | 4>(1);
const selectedGenCareer = ref("");

const { wh, canEdit, submitForm, deleteItem, hasChanged, submissionState, resetForm, showSubmissionStatus } =
  useCharacterEdit(newCharacter, props.character, characterApi(authRequest), EDITION);

const careerListUtils = useWhList(careerApi(authRequest), EDITION);
careerListUtils.loadWhList();
const spellListUtils = useWhList(spellApi(authRequest), EDITION);
spellListUtils.loadWhList();
const prayerListUtils = useWhList(prayerApi(authRequest), EDITION);
prayerListUtils.loadWhList();
const traitListUtils = useWhList(traitApi(authRequest), EDITION);
traitListUtils.loadWhList();
const mutationListUtils = useWhList(mutationApi(authRequest), EDITION);
mutationListUtils.loadWhList();
const skillListUtils = useWhList(skillApi(authRequest), EDITION);
skillListUtils.loadWhList();
const talentListUtils = useWhList(talentApi(authRequest), EDITION);
talentListUtils.loadWhList();
const itemListUtils = useWhList(itemApi(authRequest), EDITION);
itemListUtils.loadWhList();
const generationPropsUtils = useGenerationProps(authRequest);
generationPropsUtils.loadGenerationProps();

const referenceDataLoading = computed(
  () =>
    careerListUtils.loading.value ||
    spellListUtils.loading.value ||
    prayerListUtils.loading.value ||
    traitListUtils.loading.value ||
    mutationListUtils.loading.value ||
    skillListUtils.loading.value ||
    talentListUtils.loading.value ||
    itemListUtils.loading.value ||
    generationPropsUtils.loading.value,
);

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
const levelOpts = [
  { text: "Level 1", value: 1 },
  { text: "Level 2", value: 2 },
  { text: "Level 3", value: 3 },
  { text: "Level 4", value: 4 },
];
const careerOpts = ref([] as { text: string; value: string }[]);

const movement = computed(() => wh.value.getMovement());
const wounds = computed(() => wh.value.getWounds());
const encumbrance = computed(() =>
  getEncumbrance(
    encumbranceItems(wh.value.equippedItems, itemListUtils.whList.value),
    encumbranceItems(wh.value.carriedItems, itemListUtils.whList.value),
  ),
);
const maxEncumbrance = computed(() => wh.value.getMaxEncumbrance());
const size = computed(() => printSize(wh.value.getSize()));

function formGenerateName() {
  populateName(wh.value);
}

function formGenerateFateResilience() {
  populateFateAndResilience(wh.value);
}

function formGenerateDescription() {
  populateDescription(wh.value);
}

function formGenerateStatusStanding() {
  if (careerListUtils.loading.value) {
    return;
  }
  populateStatusAndStanding(wh.value, careerListUtils.whList.value);
}

watch(
  () => selectedGenSpecies.value,
  (newVal) => {
    selectedGenSpeciesWithRegion.value = getDefaultSpeciesWithRegion(newVal);
  },
);

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

watch(
  () => talentListUtils.whList.value,
  (newVal) => {
    wh.value.hydrateTalentModifiers(newVal);
  },
  { immediate: true },
);

watch(
  () => mutationListUtils.whList.value,
  (newVal) => {
    wh.value.hydrateMutationModifiers(newVal);
  },
  { immediate: true },
);

watch(
  () => traitListUtils.whList.value,
  (newVal) => {
    wh.value.hydrateTraitModifiers(newVal);
  },
  { immediate: true },
);

watch(
  () => selectedGenSpeciesWithRegion.value,
  (newVal) => {
    careerOpts.value = setCareerOpts(newVal, careerListUtils.whList.value);
    if (!careerOpts.value.some((x) => x.value === selectedGenCareer.value)) {
      if (careerOpts.value.length > 0) {
        selectedGenCareer.value = careerOpts.value[0].value;
      } else {
        selectedGenCareer.value = "";
      }
    }
  },
  { immediate: true },
);

watch(
  () => careerListUtils.whList.value,
  (newVal) => {
    careerOpts.value = setCareerOpts(selectedGenSpeciesWithRegion.value, newVal);
    if (!careerOpts.value.some((x) => x.value === selectedGenCareer.value)) {
      if (careerOpts.value.length > 0) {
        selectedGenCareer.value = careerOpts.value[0].value;
      } else {
        selectedGenCareer.value = "";
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
    .filter((x) => x.level1.exists && x.level2.exists && x.level3.exists && x.level4.exists)
    .map((x) => ({ text: x.name, value: x.id }))
    .sort((a, b) => a.text.localeCompare(b.text));
}

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
  const career = careerListUtils.whList.value.find((x) => x.id === selectedGenCareer.value);
  if (!career) {
    return;
  }
  wh.value = generateCharacter4e({
    species: selectedGenSpeciesWithRegion.value,
    career,
    skills: skillListUtils.whList.value,
    talents: talentListUtils.whList.value,
    generationProps: generationPropsUtils.generationProps.value,
    level: selectedGenLevel.value,
  });

  wh.value.hydrateAllModifiers({
    talents: talentListUtils.whList.value,
    mutations: mutationListUtils.whList.value,
    traits: traitListUtils.whList.value,
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
  <div class="flex items-center flex-col gap-4">
    <AlertBlock
      v-if="careerListUtils.apiError.value && careerListUtils.showApiError.value"
      alertType="red"
      @close="careerListUtils.showApiError.value = false"
    >
      {{ careerListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="spellListUtils.apiError.value && spellListUtils.showApiError.value"
      alertType="red"
      @close="spellListUtils.showApiError.value = false"
    >
      {{ spellListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="prayerListUtils.apiError.value && prayerListUtils.showApiError.value"
      alertType="red"
      @close="prayerListUtils.showApiError.value = false"
    >
      {{ prayerListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="mutationListUtils.apiError.value && mutationListUtils.showApiError.value"
      alertType="red"
      @close="mutationListUtils.showApiError.value = false"
    >
      {{ mutationListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="skillListUtils.apiError.value && skillListUtils.showApiError.value"
      alertType="red"
      @close="skillListUtils.showApiError.value = false"
    >
      {{ skillListUtils.apiError.value }}
    </AlertBlock>

    <AlertBlock
      v-if="talentListUtils.apiError.value && talentListUtils.showApiError.value"
      alertType="red"
      @close="talentListUtils.showApiError.value = false"
    >
      {{ talentListUtils.apiError.value }}
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
      <SectionLink icon="lucide:eye" routeName="viewCharacter" :params="{ id: id }" variant="neutral">
        View character
      </SectionLink>
    </div>
  </div>
  <CharacterStartPanel
    v-if="canEdit && id === 'create'"
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
    <PublicPropertyBox v-model="wh.visibility" propertyName="Character" :disabled="!canEdit" />
  </div>
  <div class="flex flex-col @3xl:flex-row justify-between text-left gap-4 my-4">
    <div class="flex-1">
      <div class="flex flex-col gap-4">
        <div>
          <SheetTable>
            <SheetField v-model="wh.name" title="Name" :validationStatus="validName" :disabled="!canEdit" />
            <template v-if="canEdit" #actions>
              <SectionButton icon="lucide:dices" iconOnlyWhenNarrow @click="formGenerateName"> Generate </SectionButton>
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
              <SectionButton icon="lucide:dices" iconOnlyWhenNarrow @click="formGenerateFateResilience">
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
                iconOnlyWhenNarrow
                :disabled="careerListUtils.loading.value"
                @click="formGenerateStatusStanding"
              >
                Generate
              </SectionButton>
            </template>
          </SheetTable>
          <CharacterCareer
            class="-mt-px"
            :disabled="!canEdit"
            :initSelectedCurrentCareer="wh.career"
            :initSelectedPastCareers="wh.careerPath"
            :careerList="careerListUtils.whList.value"
            :loading="careerListUtils.loading.value"
            @reload="careerListUtils.loadWhList"
            @currentSelected="(event) => wh.updateCurrentCareer(event.id, event.number, event.selected)"
            @pastSelected="(event) => wh.updatePastCareer(event.id, event.number, event.selected)"
          />
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
  </div>
  <SectionCard title="Description" class="my-4">
    <template v-if="canEdit" #actions>
      <SectionButton icon="lucide:dices" variant="neutral" @click="formGenerateDescription">Generate</SectionButton>
    </template>
    <FormTextarea v-model="wh.description" :validationStatus="validDesc" :disabled="!canEdit" bare />
  </SectionCard>
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
      :initSkills="wh.skills"
      :skillList="skillListUtils.whList.value"
      :loading="skillListUtils.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validSkills"
      class="flex-1"
      @reload="skillListUtils.loadWhList"
      @updated="(event) => wh.updateSkills(event.id, event.number)"
      @addSpeciesSkills="
        populateSpeciesSkills4e(wh, skillListUtils.whList.value, generationPropsUtils.generationProps.value)
      "
    />
    <CharacterTalents
      :disabled="!canEdit"
      :initTalents="wh.talents"
      :talentList="talentListUtils.whList.value"
      :loading="talentListUtils.loading.value || generationPropsUtils.loading.value"
      :attributes="attributes"
      :validationStatus="validTalents"
      class="flex-1"
      @reload="talentListUtils.loadWhList"
      @updated="(event) => wh.updateTalents(event.id, event.number, talentListUtils.whList.value)"
      @addSpeciesTalents="
        populateSpeciesTalents(wh, talentListUtils.whList.value, generationPropsUtils.generationProps.value)
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
    :itemList="itemListUtils.whList.value"
    :loading="itemListUtils.loading.value || careerListUtils.loading.value || generationPropsUtils.loading.value"
    :equippedValidationStatus="validEquipped"
    :carriedValidationStatus="validCarried"
    :storedValidationStatus="validStored"
    class="flex-1"
    @reload="itemListUtils.loadWhList"
    @equippedUpdated="(event) => wh.updateItems(event.id, event.number, 'equipped')"
    @carriedUpdated="(event) => wh.updateItems(event.id, event.number, 'carried')"
    @storedUpdated="(event) => wh.updateItems(event.id, event.number, 'stored')"
    @addClassItems="populateClassItems(wh, careerListUtils.whList.value, generationPropsUtils.generationProps.value)"
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
        :itemList="prayerListUtils.whList.value"
        title="Prayers"
        modalTitle="Edit prayers"
        modalId="characterPrayers"
        :loading="prayerListUtils.loading.value"
        removable
        :disableDescription="true"
        routeName="prayer"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="prayerListUtils.loadWhList"
        @selected="(e) => wh.updatePrayers(e.id, e.selected)"
      />
      <SelectTable
        :disabled="!canEdit"
        :initSelectedItems="wh.spells"
        :itemList="spellListUtils.whList.value"
        title="Spells"
        modalTitle="Edit spells"
        modalId="characterSpells"
        :loading="spellListUtils.loading.value"
        removable
        :disableDescription="true"
        routeName="spell"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="spellListUtils.loadWhList"
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
        :itemList="mutationListUtils.whList.value"
        title="Mutations"
        modalTitle="Edit mutations"
        modalId="characterMutations"
        :loading="mutationListUtils.loading.value"
        removable
        :disableDescription="true"
        routeName="mutation"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="mutationListUtils.loadWhList"
        @selected="(e) => wh.updateMutations(e.id, e.selected, mutationListUtils.whList.value)"
      />
      <SelectIdValueTable
        :disabled="!canEdit"
        :selected="wh.traits"
        :itemList="traitListUtils.whList.value"
        title="Creature Traits"
        modalTitle="Edit traits"
        :loading="traitListUtils.loading.value"
        :disableDescription="true"
        :allowRepeat="true"
        :validationStatus="wh.validateTraits()"
        routeName="trait"
        :truncateModalDescription="100"
        class="-mt-px"
        @reload="traitListUtils.loadWhList"
        @add="(id) => wh.addTrait(id, traitListUtils.whList.value)"
        @remove="(e) => wh.removeTrait(e.index)"
        @selected="(e) => wh.updateTraits(e.id, e.selected, traitListUtils.whList.value)"
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
