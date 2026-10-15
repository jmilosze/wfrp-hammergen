<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
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
import ContentListPage from "../../../components/ContentListPage.vue";
import { computed, watch } from "vue";
import { FilterSection } from "../../../components/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(spellApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
// A label is "type:label" ("type:no" for spells of the type without labels), as labels depend on the type.
const typeTerm = useListQuery("type");
const labelTerm = useListQuery("label");

const filters = useFilterModel({ type: typeTerm, label: labelTerm, source: source.term });

// In a section an entry matches any ticked value; the sections combine. Labels only narrow down their own type.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.classification.type.toString()))
    .filter((wh) => matchesLabels(wh))
    .map((x) => formatSpellRow(x)),
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
    source.section.value,
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
  <ContentListPage
    v-model:filters="filters"
    title="Spells"
    routeName="spell"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
