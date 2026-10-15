<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import SheetCard from "@/components/sheet/SheetCard.vue";
import TextLink from "@/components/ui/TextLink.vue";
import ViewCharacterTable from "./ViewCharacterTable.vue";
import { CharacterFull, CharacterFullItem } from "@/services/wh/character/characterFull.ts";

// The character view's trappings in the editor's sections, each a box of its own as on the paper sheet: Equipped
// weapons, armour and other, and Carried as tables; Stored/Assets as a comma separated list. Empty sections are left
// out.
const props = defineProps<{ character: CharacterFull }>();

const QTY = { name: "number", displayName: "Qty" };
const NAME = { name: "name", displayName: "Name" };
const ENC = { name: "enc", displayName: "Enc" };
const DESCRIPTION = { name: "description", displayName: "Description" };
const QUALITIES = { name: "qualities", displayName: "Qualities and Runes" };

const sections = [
  {
    title: "Equipped weapons",
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
    title: "Equipped armour",
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
  { title: "Equipped other", items: props.character.equippedOther, fields: [NAME, QTY, ENC, DESCRIPTION] },
  { title: "Carried", items: props.character.carried, fields: [NAME, QTY, ENC, DESCRIPTION] },
].filter((x) => x.items.length > 0);

const stored = props.character.stored;

type PropertyLink = { id: string; name: string; routeName: RouteName };

function properties(item: CharacterFullItem): PropertyLink[] {
  return [
    ...item.qualitiesFlaws.map((x): PropertyLink => ({ id: x.id, name: x.name, routeName: "property" })),
    ...item.runes.map((x): PropertyLink => ({ id: x.id, name: `${x.name} x${x.number}`, routeName: "rune" })),
  ];
}
</script>

<template>
  <div v-if="sections.length > 0 || stored.length > 0" class="flex flex-col gap-4">
    <SheetCard v-for="section in sections" :key="section.title" :title="section.title">
      <ViewCharacterTable :fields="section.fields" :items="section.items" stackable>
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
    </SheetCard>
    <SheetCard v-if="stored.length > 0" title="Stored/Assets">
      <p class="px-2 py-2">
        <span v-for="(item, i) in stored" :key="item.id">
          <TextLink routeName="item" :params="{ id: item.id }">{{ item.name }}</TextLink>
          <template v-if="item.number > 1"> x{{ item.number }}</template>
          <template v-if="i < stored.length - 1">, </template>
        </span>
      </p>
    </SheetCard>
  </div>
</template>
