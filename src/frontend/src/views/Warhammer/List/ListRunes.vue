<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { printRuneLabel, Rune, runeApi, runeLabelList } from "../../../services/wh/content/rune.ts";
import { itemTypeList, printItemType } from "../../../services/wh/content/item.ts";
import { authRequest } from "../../../services/auth.ts";
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed } from "vue";
import CopyButton from "../../../components/CopyButton.vue";
import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(runeApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));
const labelTerm = useListQuery("label");
const applicableToTerm = useListQuery("applicableTo");

// The label filter's value for runes without labels.
const NO_LABEL = "no";

const filters = computed({
  get: () => ({ label: labelTerm.value, applicableTo: applicableToTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    labelTerm.value = value.label ?? [];
    applicableToTerm.value = value.applicableTo ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => labelTerm.value.length === 0 || matchesLabels(wh))
    .filter(
      (wh) =>
        applicableToTerm.value.length === 0 ||
        wh.applicableTo.some((x) => applicableToTerm.value.includes(x.toString())),
    )
    .map((x) => formatRuneRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
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
    {
      key: "source",
      title: "Source",
      collapsed: true,
      options: whList.filteredSourceOptions.value.filter((x) => x.value !== ""),
    },
  ];
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
  <Header title="Runes" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="rune" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="rune" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="rune" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <CopyButton class="my-1" @copy="whList.copyWh(id)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
