<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Talent } from "../services/wh/content/talent.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, printAttributeName } from "../services/wh/core/attributes.ts";
import { isEqualEntity } from "../utils/equal.ts";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import SectionButton from "./SectionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import SectionCard from "./SectionCard.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import EditionFilterSelect from "./EditionFilterSelect.vue";
import { EditionFilter, matchesEditionFilter } from "../services/wh/core/edition.ts";
import ReloadButton from "./ReloadButton.vue";
import LinkButton from "./LinkButton.vue";

const DESC_CHARS = 100;

type TalentWithNumber = {
  id: string;
  name: string;
  description: string;
  maxRank: number;
  maxRankFormula: string;
  attributeName: string;
  number: number;
  fullTalentPos: number;
};

const props = defineProps<{
  disabled?: boolean;
  talentList: Talent[];
  initTalents: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
  validationStatus: ValidationStatus;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "addSpeciesTalents"): void;
}>();

function isNonzero(talentWithNumber: TalentWithNumber): boolean {
  return talentWithNumber.number !== 0;
}

const talentsWithNumber: Ref<Record<string, TalentWithNumber>> = ref({});
const talentsWithNumberList: Ref<TalentWithNumber[]> = ref([]);
const editionFilter = ref<EditionFilter>("both");
const talentsWithNumberListFiltered = computed(() =>
  talentsWithNumberList.value.filter((x) => matchesEditionFilter(x.id, props.fourEIds, editionFilter.value)),
);

function updateTalentsWithNumber(
  selectedTalents: Record<string, number>,
  talentList: Talent[],
  attributes: Attributes,
) {
  talentsWithNumber.value = {};
  for (let i = 0; i < talentList.length; i++) {
    const talent = talentList[i];
    if (!talent.isGroup) {
      talentsWithNumber.value[talent.id] = {
        id: talent.id,
        name: talent.name,
        description: talent.description,
        maxRank: talent.getMaxRank(attributes),
        maxRankFormula: talent.getMaxRankDisplay(),
        attributeName: printAttributeName(talent.attribute),
        number: 0,
        fullTalentPos: i,
      };
      if (talent.id in selectedTalents) {
        talentsWithNumber.value[talent.id].number = selectedTalents[talent.id];
      }
    }
  }
  talentsWithNumberList.value = Object.values(talentsWithNumber.value).sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}

function updateAttributes(attributes: Attributes) {
  for (const talent of talentsWithNumberList.value) {
    const newMaxRank = props.talentList[talent.fullTalentPos].getMaxRank(attributes);
    talent.maxRank = newMaxRank;
    talentsWithNumber.value[talent.id].maxRank = newMaxRank;
  }
}

watch(
  () => props.initTalents,
  (newVal) => {
    updateTalentsWithNumber(newVal, props.talentList, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.talentList,
  (newVal) => {
    updateTalentsWithNumber(props.initTalents, newVal, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.attributes,
  (newVal, oldVal) => {
    if (oldVal === undefined || !isEqualEntity(newVal, oldVal)) {
      updateAttributes(newVal);
    }
  },
  { immediate: true },
);

const selectedTalents = computed(() => talentsWithNumberList.value.filter((x) => isNonzero(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "number", displayName: "Rank", skipStackedTitle: false },
];

const resetPaginationCounter = ref(0);

function removeTalent(id: string) {
  talentsWithNumber.value[id].number = 0;
  emit("updated", { id: id, number: 0 });
}

function onEditClick() {
  if (props.loading) {
    return;
  }
  resetPaginationCounter.value += 1;
  modal.showModal("modifyTalentsModal");
  searchTerm.value = "";
  talentsWithNumberList.value.sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <SectionCard title="Talents" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
        <SectionButton
          icon="lucide:plus"
          variant="neutral"
          :disabled="props.loading"
          @click="emit('addSpeciesTalents')"
        >
          Add species talents
        </SectionButton>
      </template>
      <table class="w-full">
        <thead>
          <tr class="text-left" :class="{ 'bg-primary-50': !disabled }">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th v-if="!disabled" class="border-b border-neutral-300 py-2 px-2 w-0" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedTalents" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink routeName="talent" :params="{ id: src.id }">
                {{ src.name }}
              </TextLink>
              <span v-if="src.number > 1" class="ml-1">x{{ src.number }}</span>
              <Edition4eBadge v-if="fourEIds?.has(src.id)" />
            </td>
            <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
              <button
                class="text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 rounded p-1"
                :aria-label="`Remove ${src.name}`"
                @click="removeTalent(src.id)"
              >
                <Icon icon="lucide:x" class="size-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
    <div class="text-sm text-danger-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow id="modifyTalentsModal">
      <template #header> Edit talents </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="talentsWithNumberListFiltered"
        stackBreakpoint="lg"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" routeName="talent" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton :loading="props.loading" @click="emit('reload')" />
        <EditionFilterSelect v-if="fourEIds" v-model="editionFilter" />

        <template #name="{ id }: { id: string }">
          <TextLink routeName="talent" :params="{ id: id }">{{ talentsWithNumber[id].name }}</TextLink>
          <Edition4eBadge v-if="fourEIds?.has(id)" />
        </template>

        <template #number="{ id }: { id: string }">
          <FormInput
            v-model="talentsWithNumber[id].number"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('updated', { id: id, number: talentsWithNumber[id].number })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div>
            {{ truncate(talentsWithNumber[id].description, DESC_CHARS) }}
            <div class="mb-1">
              <span class="font-semibold mr-1">Max rank</span>
              {{ talentsWithNumber[id].maxRank }}
              {{
                talentsWithNumber[id].maxRankFormula.includes("Bonus")
                  ? "(" + talentsWithNumber[id].maxRankFormula + ")"
                  : ""
              }}
            </div>
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
