<script setup lang="ts">
import SheetCell from "@/components/sheet/SheetCell.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import TextLink from "@/components/ui/TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull } from "@/services/wh/character/characterFull.ts";

// The character view's Magic and Faith: Sin Points, prayers, spells and the spells in carried or stored grimoires.
// Left out when there are no points and no entries.
const props = defineProps<{ character: CharacterFull }>();

const grimoires = [...props.character.carried, ...props.character.stored].filter((x) => x.spells);

const hasMagic =
  props.character.sin > 0 ||
  props.character.prayers.length > 0 ||
  props.character.spells.length > 0 ||
  grimoires.length > 0;

const SPELL_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "cn", displayName: "CN" },
  { name: "range", displayName: "Range" },
  { name: "target", displayName: "Target" },
  { name: "duration", displayName: "Duration" },
];
const PRAYER_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "range", displayName: "Range" },
  { name: "target", displayName: "Target" },
  { name: "duration", displayName: "Duration" },
];
</script>

<template>
  <div v-if="hasMagic" class="text-left">
    <SheetTable title="Magic and Faith">
      <SheetCell title="Sin Points">{{ character.sin }}</SheetCell>
    </SheetTable>
    <ViewCharacterTable title="Prayers" :fields="PRAYER_FIELDS" :items="character.prayers" stackable class="-mt-px">
      <template #name="item">
        <TextLink routeName="prayer" :params="{ id: item.id }">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
    <ViewCharacterTable title="Spells" :fields="SPELL_FIELDS" :items="character.spells" stackable class="-mt-px">
      <template #name="item">
        <TextLink routeName="spell" :params="{ id: item.id }">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
    <ViewCharacterTable
      v-for="book in grimoires"
      :key="book.id"
      :title="`Spells in ${book.name}`"
      :fields="SPELL_FIELDS"
      :items="book.spells ?? []"
      stackable
      class="-mt-px"
    >
      <template #name="item">
        <TextLink routeName="spell" :params="{ id: item.id }">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
  </div>
</template>
