<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import {
  ItemProperty,
  itemPropertyApi,
  itemPropertyTypeList,
  printItemPropertyType,
} from "../../../services/wh/content/itemproperty.ts";
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
const whList = useWhList(itemPropertyApi(authRequest), edition);
await whList.loadWhList();

const auth = useAuth();

// The filters, kept in the query string.
const searchTerm = useRouteQuery("search", "");
const sourceTerm = splitQuery(useSourceQuery(edition));
const typeTerm = useListQuery("type");
const applicableToTerm = useListQuery("applicableTo");

const filters = computed({
  get: () => ({ type: typeTerm.value, applicableTo: applicableToTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    typeTerm.value = value.type ?? [];
    applicableToTerm.value = value.applicableTo ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter(
      (wh) =>
        applicableToTerm.value.length === 0 ||
        wh.applicableTo.some((x) => applicableToTerm.value.includes(x.toString())),
    )
    .map((x) => formatItemPropertyRow(x))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

function formatItemPropertyRow(itemProperty: ItemProperty) {
  return {
    id: itemProperty.id,
    name: itemProperty.name,
    meta: printItemPropertyType(itemProperty.type),
    description: itemProperty.description,
    ownerId: itemProperty.ownerId,
    visibility: itemProperty.visibility,
  };
}

// Types, trapping types and sources are offered when some entry has them.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.type));
  const applicableInData = new Set(whList.whList.value.flatMap((wh) => wh.applicableTo));
  return [
    {
      key: "type",
      title: "Type",
      options: itemPropertyTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printItemPropertyType(x), value: x.toString() })),
    },
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
  <Header title="Qualities and Flaws" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" variant="dark" routeName="property" :params="{ id: 'create' }">
          Create new
        </SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="property" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" variant="dark" routeName="property" :params="{ id: 'create' }">
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
