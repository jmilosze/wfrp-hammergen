<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import {
  getAllowedLabels,
  getSimplifiedLabels,
  printSpellLabel,
  printSpellType,
  Spell,
  spellApi,
  SpellType,
  spellTypeList,
} from "../../../services/wh/content/spell.ts";
import { authRequest } from "../../../services/auth.ts";
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed, watch } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(spellApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));
// A label is "type:label" ("type:no" for spells of the type without labels), as labels depend on the type.
const typeTerm = useListQuery("type");
const labelTerm = useListQuery("label");

const filters = computed({
  get: () => ({ type: typeTerm.value, label: labelTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    typeTerm.value = value.type ?? [];
    labelTerm.value = value.label ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

// In a section an entry matches any ticked value; the sections combine. Labels only narrow down their own type.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.classification.type.toString()))
    .filter((wh) => matchesLabels(wh))
    .map((x) => formatSpellRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

function matchesLabels(spell: Spell): boolean {
  const prefix = `${spell.classification.type}:`;
  const labels = labelTerm.value.filter((x) => x.startsWith(prefix));
  if (labels.length === 0) {
    return true;
  }
  if (spell.classification.labels.size === 0) {
    return labels.includes(`${prefix}no`);
  }
  return [...spell.classification.labels].some((x) => labels.includes(`${prefix}${x}`));
}

// The meta line is the type and the labels, a full group of lores as one label (e.g. Any Colour Lore).
function formatSpellRow(spell: Spell) {
  const labels = [...getSimplifiedLabels(spell.classification.type, spell.classification.labels)]
    .sort((a, b) => b - a)
    .map((x) => printSpellLabel(x));
  return {
    id: spell.id,
    name: spell.name,
    meta: [printSpellType(spell.classification.type), ...labels].join(", "),
    description: spell.description,
    ownerId: spell.ownerId,
    visibility: spell.visibility,
  };
}

// Types and sources are offered when some spell has them. Labels are offered once a type with labels is ticked, under
// their type.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.classification.type));
  const types = spellTypeList.filter((x) => typesInData.has(x));
  const labelTypes = types.filter((x) => getAllowedLabels(x).length > 0 && typeTerm.value.includes(x.toString()));
  return [
    { key: "type", title: "Type", options: types.map((x) => ({ text: printSpellType(x), value: x.toString() })) },
    {
      key: "label",
      title: "Label",
      options: labelTypes.flatMap((type: SpellType) => [
        ...getAllowedLabels(type)
          .sort((a, b) => a - b)
          .map((x) => ({ text: printSpellLabel(x), value: `${type}:${x}`, heading: printSpellType(type) })),
        { text: "No label", value: `${type}:no`, heading: printSpellType(type) },
      ]),
    },
    {
      key: "source",
      title: "Source",
      collapsed: true,
      options: whList.filteredSourceOptions.value.filter((x) => x.value !== ""),
    },
  ];
});

// Unticking a type drops its labels.
watch(typeTerm, (types) => {
  const kept = labelTerm.value.filter((x) => types.includes(x.split(":")[0]));
  if (kept.length !== labelTerm.value.length) {
    labelTerm.value = kept;
  }
});
</script>

<template>
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @close="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Spells" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="spell" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="spell" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="spell" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <ActionButtonsNonCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
