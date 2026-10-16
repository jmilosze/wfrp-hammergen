<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { getSimplifiedLabels, printSpellLabel, printSpellType, Spell, spellApi } from "@/services/wh/content/spell.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { spellFilters } from "@/components/filter/spellFilters.ts";

const { edition } = useEdition();
const whList = useWhList(spellApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(spellFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatSpellRow(x)));

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
