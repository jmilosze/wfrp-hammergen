<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import TextLink from "./TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull, CharacterFullItem } from "../services/wh/character/characterFull.ts";

// The character view's trappings in the editor's sections: Equipped (weapons, armour and other), Carried and
// Stored/Assets. Empty sections are left out, and the whole card when there are no trappings.
const props = defineProps<{ character: CharacterFull }>();

const QTY = { name: "number", displayName: "Qty" };
const NAME = { name: "name", displayName: "Name" };
const ENC = { name: "enc", displayName: "Enc" };
const DESCRIPTION = { name: "description", displayName: "Description" };
const QUALITIES = { name: "qualities", displayName: "Qualities and Runes" };

const sections = [
  {
    subtitle: "Equipped weapons",
    items: props.character.equippedWeapon,
    fields: [
      NAME,
      QTY,
      { name: "group", displayName: "Group" },
      ENC,
      { name: "rng", displayName: "Range/Reach" },
      { name: "dmg", displayName: "Damage" },
      QUALITIES,
    ],
  },
  {
    subtitle: "Equipped armour",
    items: props.character.equippedArmor,
    fields: [
      NAME,
      QTY,
      { name: "locations", displayName: "Locations" },
      ENC,
      { name: "ap", displayName: "AP" },
      QUALITIES,
    ],
  },
  { subtitle: "Equipped other", items: props.character.equippedOther, fields: [NAME, QTY, ENC, DESCRIPTION] },
  { subtitle: "Carried", items: props.character.carried, fields: [NAME, QTY, ENC, DESCRIPTION] },
  { subtitle: "Stored/Assets", items: props.character.stored, fields: [NAME, QTY] },
];

const hasItems = sections.some((x) => x.items.length > 0);

function properties(item: CharacterFullItem) {
  return [
    ...item.qualitiesFlaws.map((x) => ({ id: x.id, name: x.name, routeName: "property" })),
    ...item.runes.map((x) => ({ id: x.id, name: `${x.name} x${x.number}`, routeName: "rune" })),
  ];
}
</script>

<template>
  <SectionCard v-if="hasItems" title="Trappings">
    <ViewCharacterTable
      v-for="section in sections"
      :key="section.subtitle"
      :subtitle="section.subtitle"
      :fields="section.fields"
      :items="section.items"
      stackable
    >
      <template #name="item">
        <TextLink routeName="item" :params="{ id: item.id }">{{ item.name }}</TextLink>
      </template>
      <template #locations="item">{{ item.locations?.join(", ") }}</template>
      <template #ap="item">{{ item.ap ?? 0 }}</template>
      <template #qualities="item">
        <span v-for="(property, i) in properties(item)" :key="property.routeName + property.id">
          <TextLink :routeName="property.routeName" :params="{ id: property.id }">{{ property.name }}</TextLink>
          <template v-if="i < properties(item).length - 1">, </template>
        </span>
      </template>
    </ViewCharacterTable>
  </SectionCard>
</template>

<style scoped></style>
