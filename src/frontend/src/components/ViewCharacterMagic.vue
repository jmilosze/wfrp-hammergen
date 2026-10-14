<script setup lang="ts">
import SheetCell from "./SheetCell.vue";
import SheetTable from "./SheetTable.vue";
import TextLink from "./TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull } from "../services/wh/character/characterFull.ts";

// The character view's Magic and Faith (Sin Points, prayers, spells and the spells in carried or stored grimoires)
// beside Traits and Corruption (Corruption Points, mutations and creature traits), as in the editor. A box with no
// points and no entries is left out.
const props = defineProps<{ character: CharacterFull }>();

const grimoires = [...props.character.carried, ...props.character.stored].filter((x) => x.spells);

const hasMagic =
  props.character.sin > 0 ||
  props.character.prayers.length > 0 ||
  props.character.spells.length > 0 ||
  grimoires.length > 0;
const hasCorruption =
  props.character.corruption > 0 || props.character.mutations.length > 0 || props.character.traits.length > 0;

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
const MUTATION_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "type", displayName: "Type" },
  { name: "description", displayName: "Description" },
];
const TRAIT_FIELDS = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
];
</script>

<template>
  <div v-if="hasMagic || hasCorruption" class="flex flex-wrap text-left gap-4">
    <div v-if="hasMagic" class="grow basis-80">
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
    <div v-if="hasCorruption" class="grow basis-80">
      <SheetTable title="Traits and Corruption">
        <SheetCell title="Corruption Points">{{ character.corruption }}</SheetCell>
      </SheetTable>
      <ViewCharacterTable title="Mutations" :fields="MUTATION_FIELDS" :items="character.mutations" class="-mt-px">
        <template #name="item">
          <TextLink routeName="mutation" :params="{ id: item.id }">{{ item.name }}</TextLink>
        </template>
      </ViewCharacterTable>
      <ViewCharacterTable title="Creature Traits" :fields="TRAIT_FIELDS" :items="character.traits" class="-mt-px">
        <template #name="item">
          <TextLink routeName="trait" :params="{ id: item.id }">{{ item.name }}</TextLink>
        </template>
      </ViewCharacterTable>
    </div>
  </div>
</template>

<style scoped></style>
