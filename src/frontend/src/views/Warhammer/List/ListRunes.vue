<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { printRuneLabel, Rune, runeApi, runeLabelList } from "../../../services/wh/content/rune.ts";
import { itemTypeList, printItemType } from "../../../services/wh/content/item.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/ContentListPage.vue";
import { computed } from "vue";
import { FilterSection } from "../../../components/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(runeApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
const labelTerm = useListQuery("label");
const applicableToTerm = useListQuery("applicableTo");

// The label filter's value for runes without labels.
const NO_LABEL = "no";

const filters = useFilterModel({ label: labelTerm, applicableTo: applicableToTerm, source: source.term });

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => labelTerm.value.length === 0 || matchesLabels(wh))
    .filter(
      (wh) =>
        applicableToTerm.value.length === 0 ||
        wh.applicableTo.some((x) => applicableToTerm.value.includes(x.toString())),
    )
    .map((x) => formatRuneRow(x)),
);

function matchesLabels(rune: Rune): boolean {
  if (rune.labels.length === 0) {
    return labelTerm.value.includes(NO_LABEL);
  }
  return rune.labels.some((x) => labelTerm.value.includes(x.toString()));
}

function formatRuneRow(rune: Rune) {
  return {
    id: rune.id,
    name: rune.name,
    meta: rune.labels.map((x) => printRuneLabel(x)).join(", "),
    description: rune.description,
    ownerId: rune.ownerId,
    visibility: rune.visibility,
  };
}

// Labels, trapping types and sources are offered when some rune has them; "No label" when some rune has none.
const sections = computed<FilterSection[]>(() => {
  const labelsInData = new Set(whList.whList.value.flatMap((wh) => wh.labels));
  const applicableInData = new Set(whList.whList.value.flatMap((wh) => wh.applicableTo));
  const labelOptions = runeLabelList
    .filter((x) => labelsInData.has(x))
    .map((x) => ({ text: printRuneLabel(x), value: x.toString() }));
  if (whList.whList.value.some((wh) => wh.labels.length === 0)) {
    labelOptions.push({ text: "No label", value: NO_LABEL });
  }
  return [
    { key: "label", title: "Label", options: labelOptions },
    {
      key: "applicableTo",
      title: "Applicable to",
      options: itemTypeList
        .filter((x) => applicableInData.has(x))
        .map((x) => ({ text: printItemType(x), value: x.toString() })),
    },
    source.section.value,
  ];
});
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Runes"
    routeName="rune"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
