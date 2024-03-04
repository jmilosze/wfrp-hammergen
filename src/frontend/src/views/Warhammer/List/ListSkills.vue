<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Skill, SkillApi, skillTypeList, printSkillType } from "../../../services/wh/skill.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ListWh/ActionButtonsNonCharacter.vue";
import { useRouter } from "vue-router";

import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { getOptions, queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";
import { attributeNameList, printAttributeName } from "../../../services/wh/attributes.ts";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";

const whList = useWhList(new SkillApi(authRequest));
await whList.loadWhList();

const router = useRouter();
const queryParams = ref({ search: "", source: "", type: "", attribute: "" });
queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "type", displayName: "Type" },
  { name: "attribute", displayName: "Attr" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .filter((wh) => queryParams.value.attribute === "" || queryParams.value.attribute === wh.attribute.toString())
    .map((x) => formatSkillRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatSkillRow(skill: Skill): TableRow {
  return {
    name: addSpaces(skill.name),
    type: printSkillType(skill.type),
    attribute: printAttributeName(skill.attribute),
    source: Object.keys(skill.source)
      .map((x) => source[x])
      .join(", "),
    description: skill.description,
    canEdit: skill.canEdit,
    id: skill.id,
  };
}

const filteredTypeOptions = computed(() => {
  return getOptions(
    skillTypeList,
    whList.whList.value.map((wh) => wh.type),
    printSkillType,
    "Any type",
  );
});

const filteredAttributeOptions = computed(() => {
  return getOptions(
    attributeNameList,
    whList.whList.value.map((wh) => wh.attribute),
    printAttributeName,
    "Any attribute",
  );
});
</script>

<template>
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @click="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Skills" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.attribute" :options="filteredAttributeOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="auth.loggedIn.value"
    class="mx-1"
    @createNew="router.push({ name: 'skill', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
        @edit="router.push({ name: 'skill', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
