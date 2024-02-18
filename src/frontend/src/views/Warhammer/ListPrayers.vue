<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/string.ts";
import { source } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/table.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../composables/sizeUtils.ts";
import { ViewSize } from "../../utils/viewSize.ts";
import ListWhButtons from "../../components/ListWhButtons.vue";
import ModalWindow from "../../components/ModalWindow.vue";
import { useModal } from "../../composables/modal.ts";

const MAX_CHARS = 15;
const PER_PAGE = 25;

interface PrayerRow extends TableRow {
  name: string;
  source: string;
  description: string;
  canEdit: boolean;
  id: string;
}

const whListUtils = useWhListUtils(new PrayerApi(authRequest));
await whListUtils.loadWhList();

const modal = useModal();

const el = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, el);

const columns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

function formatPrayerRow(prayer: Prayer): PrayerRow {
  return {
    name: addSpaces(prayer.name, MAX_CHARS),
    source: Object.keys(prayer.source)
      .map((x) => source[x])
      .join(", "),
    description: prayer.description,
    canEdit: prayer.canEdit,
    id: prayer.id,
  };
}

const items = computed(() => {
  return whListUtils.whList.value.map((x) => formatPrayerRow(x)).sort((a, b) => (a.name > b.name ? 1 : -1));
});
</script>

<template>
  <div ref="el">
    <Header title="Prayers"> </Header>
    <TableWithSearch :fields="columns" :items="items" :perPage="PER_PAGE" :stacked="!isEqualOrGreater">
      <template #actions="{ canEdit, id }">
        <ListWhButtons
          :id="id"
          :canEdit="canEdit"
          @copy="(copiedId) => whListUtils.copyWh(copiedId)"
          @delete="modal.showModal('deleteModal')"
        />
      </template>
    </TableWithSearch>
  </div>
  <ModalWindow id="deleteModal">
    <div>zxc</div>
    <div>
      He secured his second world title at the 1971 World Championship in Sydney, Australia, defeating Warren Simpson
      37–29 in the final to become the first player to win the world title at a knockout event staged overseas. He
      reached the final again in 1972 but lost 31–37 to Alex Higgins. He won his third world title in 1977, beating
      Cliff Thorburn 25–21 in the final to become the first player to win the World Championship at Sheffield's Crucible
      Theatre, where the tournament has been staged annually ever since. Spencer's other notable victories include the
      inaugural Masters in 1975, where he defeated Reardon on a re-spotted black in the deciding frame of the final, the
      inaugural Irish Masters in 1978, and three editions of the BBC's Pot Black series. In 1979, he became the first
      player to compile a maximum break at a professional tournament, although it was not recorded as an official
      maximum because the pockets on the table had not been measured against the required specifications.
    </div>
    <div>
      He secured his second world title at the 1971 World Championship in Sydney, Australia, defeating Warren Simpson
      37–29 in the final to become the first player to win the world title at a knockout event staged overseas. He
      reached the final again in 1972 but lost 31–37 to Alex Higgins. He won his third world title in 1977, beating
      Cliff Thorburn 25–21 in the final to become the first player to win the World Championship at Sheffield's Crucible
      Theatre, where the tournament has been staged annually ever since. Spencer's other notable victories include the
      inaugural Masters in 1975, where he defeated Reardon on a re-spotted black in the deciding frame of the final, the
      inaugural Irish Masters in 1978, and three editions of the BBC's Pot Black series. In 1979, he became the first
      player to compile a maximum break at a professional tournament, although it was not recorded as an official
      maximum because the pockets on the table had not been measured against the required specifications.
    </div>
  </ModalWindow>
</template>

<style scoped></style>
