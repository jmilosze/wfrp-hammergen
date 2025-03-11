<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Talent, TalentApi } from "../../../services/wh/talent.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { computed } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import DeleteModal from "../../../components/DeleteModal.vue";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";

const whList = useWhList(new TalentApi(authRequest));
await whList.loadWhList();

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "maxRank", displayName: "Max rank", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .map((x) => formatTalentRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatTalentRow(talent: Talent) {
  return {
    name: addSpaces(talent.name),
    maxRank: talent.getMaxRankDisplay(),
    source: Object.keys(talent.source)
      .map((x) => source[x])
      .join(", "),
    description: talent.description,
    canEdit: talent.canEdit,
    id: talent.id,
    shared: talent.shared,
    ownerId: talent.ownerId,
  };
}

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
  <Header title="Talents" />
  <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="mb-2 mx-1" />
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="talent" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="talent" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="talent"
        @copy="(copiedId) => whList.copyWh(copiedId, userId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>

    <template #maxRank="{ maxRank }">
      <div class="text-nowrap">
        {{ maxRank }}
      </div>
    </template>

    <template #tooltip="{ shared, canEdit, ownerId }: { shared: boolean; canEdit: boolean; ownerId: string }">
      <ToolTip :shared="shared" :canEdit="canEdit" :ownerId="ownerId" />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
