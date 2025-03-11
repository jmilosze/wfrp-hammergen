<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Mutation, MutationApi, mutationTypeList, printMutationType } from "../../../services/wh/mutation.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { computed } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import DeleteModal from "../../../components/DeleteModal.vue";
import { getListOfAllValues, getOptions } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";
import ActionButtonsCharacter from "../../../components/ActionButtonsCharacter.vue";

const whList = useWhList(new MutationApi(authRequest));
await whList.loadWhList();

const allMutationTypes = getListOfAllValues(mutationTypeList);

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);
const typeTerm = useQueryParams("type", allMutationTypes);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .filter((wh) => typeTerm.value === "" || typeTerm.value === wh.type.toString())
    .map((x) => formatMutationRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatMutationRow(mutation: Mutation) {
  return {
    name: addSpaces(mutation.name),
    type: printMutationType(mutation.type),
    source: Object.keys(mutation.source)
      .map((x) => source[x])
      .join(", "),
    description: mutation.description,
    canEdit: mutation.canEdit,
    id: mutation.id,
    shared: mutation.shared,
    ownerId: mutation.ownerId,
  };
}

const filteredTypeOptions = computed(() => {
  return getOptions(
    mutationTypeList,
    whList.whList.value.map((wh) => wh.type),
    printMutationType,
    "Any type",
  );
});

const userId = auth.getLoggedUserInfo().userId;
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
  <Header title="Mutations" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="typeTerm" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton
      v-if="auth.loggedIn.value"
      class="mr-2 mb-2 shrink-0 btn"
      routeName="mutation"
      :params="{ id: 'create' }"
    >
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="mutation" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="mutation"
        @copy="(copiedId) => whList.copyWh(copiedId, userId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>

    <template #tooltip="{ shared, canEdit, ownerId }: { shared: boolean; canEdit: boolean; ownerId: string }">
      <ToolTip :shared="shared" :canEdit="canEdit" :ownerId="ownerId" />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
