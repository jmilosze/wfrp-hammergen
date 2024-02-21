<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Spell, SpellApi } from "../../../services/wh/spell.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch, Ref } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtons from "../../../components/ListWh/ActionButtons.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth.ts";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { queryParamsFromRouterQuery, queryParamsToRouterQuery, SimpleQuery } from "../../../utils/queryParams.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";

const MAX_CHARS = 15;
const PER_PAGE = 25;

interface SpellRow extends TableRow {
  name: string;
  source: string;
  description: string;
  canEdit: boolean;
  id: string;
}

const whList = useWhListUtils(new SpellApi(authRequest));
await whList.loadWhList();

const elementToDelete = ref({ id: "", name: "" });

const router = useRouter();
const queryParams = ref({ search: "", source: "" }) as Ref<SimpleQuery>;
queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

const authStore = useAuthStore();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "cn", displayName: "CN" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .map((x) => formatSpellRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatSpellRow(spell: Spell): SpellRow {
  return {
    name: addSpaces(spell.name, MAX_CHARS),
    source: Object.keys(spell.source)
      .map((x) => source[x])
      .join(", "),
    cn: spell.cn,
    description: spell.description,
    canEdit: spell.canEdit,
    id: spell.id,
  };
}
</script>

<template>
  <Header title="Spells"> </Header>
  <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" />
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :perPage="PER_PAGE"
    :stackedViewSize="ViewSize.md"
    :addCreateNewBtn="authStore.loggedIn"
    @createNew="router.push({ name: 'spell', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="elementToDelete = { name: name, id: id }"
        @edit="router.push({ name: 'spell', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="whList.deleteWh(elementToDelete.id)" />
</template>

<style scoped></style>
