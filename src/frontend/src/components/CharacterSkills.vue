<script setup lang="ts">
import { printSkillType, Skill } from "../services/wh/content/skill.ts";
import { computed, ref, Ref, watch } from "vue";
import { Attributes, getAttributeValue, printAttributeName } from "../services/wh/core/attributes.ts";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import SectionButton from "./SectionButton.vue";
import TableWithSearch from "./TableWithSearch.vue";
import FormInput from "./FormInput.vue";
import ListTable from "./ListTable.vue";
import { ValidationStatus } from "../utils/validation.ts";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import EditionFilterSelect from "./EditionFilterSelect.vue";
import { EditionFilter, matchesEditionFilter } from "../services/wh/core/edition.ts";
import ReloadButton from "./ReloadButton.vue";
import LinkButton from "./LinkButton.vue";

const DESC_CHARS = 100;

type SkillWithNumber = {
  id: string;
  name: string;
  description: string;
  attributeName: string;
  attributeValue: number;
  type: string;
  number: number;
};

const props = defineProps<{
  disabled?: boolean;
  skillList: Skill[];
  initSkills: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
  validationStatus: ValidationStatus;
  step?: number;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
  (e: "addSpeciesSkills"): void;
}>();

function isNonzero(skillWithNumber: SkillWithNumber): boolean {
  return skillWithNumber.number !== 0;
}

const skillsWithNumber: Ref<Record<string, SkillWithNumber>> = ref({});
const skillsWithNumberList: Ref<SkillWithNumber[]> = ref([]);
const editionFilter = ref<EditionFilter>("both");
const skillsWithNumberListFiltered = computed(() =>
  skillsWithNumberList.value.filter((x) => matchesEditionFilter(x.id, props.fourEIds, editionFilter.value)),
);

function updateSkillsWithNumber(selectedSkills: Record<string, number>, skillList: Skill[], attributes: Attributes) {
  skillsWithNumber.value = {};
  for (const skill of skillList) {
    if (!skill.isGroup) {
      skillsWithNumber.value[skill.id] = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        attributeName: printAttributeName(skill.attribute),
        attributeValue: getAttributeValue(skill.attribute, attributes),
        type: printSkillType(skill.type),
        number: 0,
      };
      if (skill.id in selectedSkills) {
        skillsWithNumber.value[skill.id].number = selectedSkills[skill.id];
      }
    }
  }
  skillsWithNumberList.value = Object.values(skillsWithNumber.value).sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}

watch(
  () => props.initSkills,
  (newVal) => {
    updateSkillsWithNumber(newVal, props.skillList, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.skillList,
  (newVal) => {
    updateSkillsWithNumber(props.initSkills, newVal, props.attributes);
  },
  { immediate: true },
);

watch(
  () => props.attributes,
  (newVal) => {
    updateSkillsWithNumber(props.initSkills, props.skillList, newVal);
  },
  { immediate: true },
);

const selectedSkills = computed(() => skillsWithNumberList.value.filter((x) => isNonzero(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "number", displayName: "Rank", skipStackedTitle: false },
];

const resetPaginationCounter = ref(0);

function onEditClick() {
  if (props.loading) {
    return;
  }
  resetPaginationCounter.value += 1;
  modal.showModal("modifySkillsModal");
  searchTerm.value = "";
  skillsWithNumberList.value.sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <ListTable title="Skills" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
        <SectionButton icon="lucide:plus" variant="neutral" :disabled="props.loading" @click="emit('addSpeciesSkills')">
          Add species skills
        </SectionButton>
        <SectionButton icon="lucide:trash-2" variant="danger" :disabled="props.loading" @click="emit('clearAll')">
          Clear all
        </SectionButton>
      </template>
      <template #headers>
        <th class="border-b border-neutral-300 py-2 px-2">Att</th>
        <th class="border-b border-neutral-300 py-2 px-2">Adv</th>
        <th class="border-b border-neutral-300 py-2 px-2">Skill</th>
      </template>
      <tr v-for="src in selectedSkills" :key="src.id" class="bg-white hover:bg-neutral-200">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink routeName="skill" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(src.id)" />
        </td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeName }}</td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.attributeValue + src.number }}</td>
      </tr>
    </ListTable>
    <div class="text-sm text-danger-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow id="modifySkillsModal">
      <template #header> Edit skills </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="skillsWithNumberListFiltered"
        stackBreakpoint="lg"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" routeName="skill" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />
        <EditionFilterSelect v-if="fourEIds" v-model="editionFilter" />

        <template #name="{ id }: { id: string }">
          <TextLink routeName="skill" :params="{ id: id }">{{ skillsWithNumber[id].name }}</TextLink>
          <Edition4eBadge v-if="fourEIds?.has(id)" />
        </template>

        <template #number="{ id }: { id: string }">
          <FormInput
            v-model="skillsWithNumber[id].number"
            type="number"
            :step="step"
            class="min-w-16 w-full"
            @update:modelValue="emit('updated', { id: id, number: skillsWithNumber[id].number })"
          />
        </template>

        <template #description="{ id }: { id: string }">
          <div>
            {{ truncate(skillsWithNumber[id].description, DESC_CHARS) }}
            <div class="mb-1"><span class="font-semibold mr-1">Type</span> {{ skillsWithNumber[id].type }}</div>
            <div class="mb-1">
              <span class="font-semibold mr-1">Attribute</span> {{ skillsWithNumber[id].attributeName }}
            </div>
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
