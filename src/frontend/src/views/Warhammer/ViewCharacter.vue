<script setup lang="ts">
import Header from "../../components/PageHeader.vue";
import { ref } from "vue";
import { CharacterApi } from "../../services/wh/character.ts";
import { authRequest } from "../../services/auth.ts";
import {
  CharacterFullItem,
  CharacterFullSpell,
  CharacterFullToCsv,
  newCharacterFull,
} from "../../services/wh/characterFull.ts";
import ActionButton from "../../components/ActionButton.vue";
import { saveAs } from "file-saver";
import { useRouter } from "vue-router";
import { addSpaces } from "../../utils/string.ts";
import { useElSize } from "../../composables/viewSize.ts";
import { ViewSize } from "../../utils/viewSize.ts";
import ViewCharacterTable from "../../components/ViewCharacterTable.vue";
import { usePrint } from "../../composables/print.ts";
import { useAuth } from "../../composables/auth.ts";
import AlertBlock from "../../components/AlertBlock.vue";
import TextLink from "../../components/TextLink.vue";

const props = defineProps<{
  id: string;
}>();

const apiError = ref("");
const showApiError = ref(true);

const router = useRouter();
const auth = useAuth();
const { print, printing } = usePrint();

const characterApi = new CharacterApi(authRequest);

const character = ref(newCharacterFull());
await loadCharacter();

async function loadCharacter() {
  try {
    character.value = await auth.callAndLogoutIfUnauthorized(characterApi.getElementForDisplay)(props.id);
  } catch {
    apiError.value = "Error. Could not pull data from server.";
  }
}

function saveJson() {
  const blob = new Blob([JSON.stringify(character.value, null, 2)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.json`);
}

function saveCsv() {
  const blob = new Blob([CharacterFullToCsv(character.value)], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${character.value.name}.csv`);
}

const contentContainerRef = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, contentContainerRef);

const displayMovement = ref({
  fields: [
    { name: "base", displayName: "Base" },
    { name: "walk", displayName: "Walk" },
    { name: "run", displayName: "Run" },
  ],
  items: [{ base: character.value.movement, walk: character.value.walk, run: character.value.run }],
});

const displayWealth = ref({
  fields: [
    { name: "brass", displayName: "D" },
    { name: "silver", displayName: "SS" },
    { name: "gold", displayName: "GC" },
  ],
  items: [{ brass: character.value.brass, silver: character.value.silver, gold: character.value.gold }],
});

const displayFate = ref({
  fields: [
    { name: "fate", displayName: "Fate" },
    { name: "fortune", displayName: "Fortune" },
  ],
  items: [{ fate: character.value.fate, fortune: character.value.fortune }],
});

const displayResilience = ref({
  fields: [
    { name: "resilience", displayName: "Resilience" },
    { name: "resolve", displayName: "Resolve" },
  ],
  items: [{ resilience: character.value.resilience, resolve: character.value.resolve }],
});

const displayOther = ref({
  fields: [
    { name: "size", displayName: "Size" },
    { name: "wounds", displayName: "Wounds" },
    { name: "sin", displayName: "Sin" },
    { name: "corruption", displayName: "Corruption" },
  ],
  items: [
    {
      size: character.value.size,
      wounds: character.value.wounds,
      sin: character.value.sin,
      corruption: character.value.corruption,
    },
  ],
});

const displayExperience = ref({
  fields: [
    { name: "current", displayName: "Current" },
    { name: "spent", displayName: "Spent" },
    { name: "total", displayName: "Total" },
  ],
  items: [{ current: character.value.currentExp, spent: character.value.spentExp, total: character.value.totalExp }],
});

const displayAttributes1 = ref({
  fields: [
    { name: "type", displayName: "" },
    { name: "ws", displayName: "WS" },
    { name: "bs", displayName: "BS" },
    { name: "s", displayName: "S" },
    { name: "t", displayName: "T" },
    { name: "i", displayName: "I" },
  ],
  items: [
    {
      type: "Base",
      ws: character.value.baseAttributes.WS,
      bs: character.value.baseAttributes.BS,
      s: character.value.baseAttributes.S,
      t: character.value.baseAttributes.T,
      i: character.value.baseAttributes.I,
    },
    {
      type: "Other",
      ws: character.value.otherAttributes.WS,
      bs: character.value.otherAttributes.BS,
      s: character.value.otherAttributes.S,
      t: character.value.otherAttributes.T,
      i: character.value.otherAttributes.I,
    },
    {
      type: "Advances",
      ws: character.value.attributeAdvances.WS,
      bs: character.value.attributeAdvances.BS,
      s: character.value.attributeAdvances.S,
      t: character.value.attributeAdvances.T,
      i: character.value.attributeAdvances.I,
    },
    {
      type: "Total",
      ws: character.value.attributes.WS,
      bs: character.value.attributes.BS,
      s: character.value.attributes.S,
      t: character.value.attributes.T,
      i: character.value.attributes.I,
    },
  ],
});

const displayAttributes2 = ref({
  fields: [
    { name: "type", displayName: "" },
    { name: "ag", displayName: "Ag" },
    { name: "dex", displayName: "Dex" },
    { name: "int", displayName: "Int" },
    { name: "wp", displayName: "WP" },
    { name: "fel", displayName: "Fel" },
  ],
  items: [
    {
      type: "Base",
      ag: character.value.baseAttributes.Ag,
      dex: character.value.baseAttributes.Dex,
      int: character.value.baseAttributes.Int,
      wp: character.value.baseAttributes.WP,
      fel: character.value.baseAttributes.Fel,
    },
    {
      type: "Other",
      ag: character.value.otherAttributes.Ag,
      dex: character.value.otherAttributes.Dex,
      int: character.value.otherAttributes.Int,
      wp: character.value.otherAttributes.WP,
      fel: character.value.otherAttributes.Fel,
    },
    {
      type: "Advances",
      ag: character.value.attributeAdvances.Ag,
      dex: character.value.attributeAdvances.Dex,
      int: character.value.attributeAdvances.Int,
      wp: character.value.attributeAdvances.WP,
      fel: character.value.attributeAdvances.Fel,
    },
    {
      type: "Total",
      ag: character.value.attributes.Ag,
      dex: character.value.attributes.Dex,
      int: character.value.attributes.Int,
      wp: character.value.attributes.WP,
      fel: character.value.attributes.Fel,
    },
  ],
});

const equippedArmourDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "locations", displayName: "Locations" },
    { name: "enc", displayName: "Enc" },
    { name: "ap", displayName: "AP" },
    { name: "qualities", displayName: "Qualities and runes" },
  ],
  items: character.value.equippedArmor.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    locations: x.locations ? x.locations.map((x) => addSpaces(x)).join(", ") : "",
    enc: x.enc,
    ap: x.ap ? x.ap : 0,
    qualities: x.qualitiesFlawsRunes,
  })),
});

const displayBasicSkills = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "attributeName", displayName: "Attr", colspan: 2 },
    { name: "attributeValue", displayName: "Attr", colspan: 0 },
    { name: "advances", displayName: "Adv" },
    { name: "skill", displayName: "Skill" },
  ],
  items: character.value.basicSkills.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    attributeName: addSpaces(x.attributeName),
    attributeValue: x.attributeValue,
    advances: x.advances,
    skill: x.skill,
  })),
});

const displayAdvancedSkills = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "attributeName", displayName: "Attr", colspan: 2 },
    { name: "attributeValue", displayName: "Attr", colspan: 0 },
    { name: "advances", displayName: "Adv" },
    { name: "skill", displayName: "Skill" },
  ],
  items: character.value.advancedSkills.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    attributeName: addSpaces(x.attributeName),
    attributeValue: x.attributeValue,
    advances: x.advances,
    skill: x.skill,
  })),
});

const displayTalents = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "rank", displayName: "Times taken" },
  ],
  items: character.value.talents.map((x) => ({
    name: addSpaces(x.name),
    rank: x.rank,
    id: x.id,
  })),
});

const equippedWeaponDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "group", displayName: "Group" },
    { name: "enc", displayName: "Enc" },
    { name: "rng", displayName: "Range / reach" },
    { name: "dmg", displayName: "Damage" },
    { name: "qualities", displayName: "Qualities and runes" },
  ],
  items: character.value.equippedWeapon.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    group: addSpaces(x.group),
    enc: x.enc,
    rng: addSpaces(x.rng),
    dmg: addSpaces(x.dmg),
    qualities: x.qualitiesFlawsRunes,
  })),
});

const equippedOtherDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "enc", displayName: "Enc" },
    { name: "description", displayName: "Description" },
  ],
  items: character.value.equippedOther.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    enc: x.enc,
    description: addSpaces(x.description),
  })),
});

const carriedDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "enc", displayName: "Enc" },
    { name: "description", displayName: "Description" },
  ],
  items: character.value.carried.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    enc: x.enc,
    description: addSpaces(x.description),
  })),
});

const storedDisp = ref({
  fields: [{ name: "name", displayName: "Name", colspan: 0 }],
  items: character.value.stored.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
  })),
});

const encDisp = ref({
  fields: [
    { name: "armour", displayName: "Armour" },
    { name: "weapon", displayName: "Weapon" },
    { name: "other", displayName: "Other" },
    { name: "carried", displayName: "Carried" },
  ],
  items: [
    {
      armour: character.value.encArmor,
      weapon: character.value.encWeapon,
      other: character.value.encOther,
      carried: character.value.encCarried,
    },
  ],
});

const mutationDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "type", displayName: "Type" },
    { name: "description", displayName: "Description" },
  ],
  items: character.value.mutations.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    type: x.type,
    description: addSpaces(x.description),
  })),
});

const spellFields = [
  { name: "name", displayName: "Name" },
  { name: "cn", displayName: "CN" },
  { name: "range", displayName: "Range" },
  { name: "target", displayName: "Target" },
  { name: "duration", displayName: "Duration" },
];

function formatSpell(spell: CharacterFullSpell) {
  return {
    id: spell.id,
    name: addSpaces(spell.name),
    cn: spell.cn,
    range: addSpaces(spell.range),
    target: addSpaces(spell.target),
    duration: addSpaces(spell.duration),
  };
}

const spellsDisp = ref({
  fields: spellFields,
  items: character.value.spells.map((x) => formatSpell(x)),
});

const prayerDisp = ref({
  fields: [
    { name: "name", displayName: "Name" },
    { name: "range", displayName: "Range" },
    { name: "target", displayName: "Target" },
    { name: "duration", displayName: "Duration" },
  ],
  items: character.value.prayers.map((x) => ({
    id: x.id,
    name: addSpaces(x.name),
    range: addSpaces(x.range),
    target: addSpaces(x.target),
    duration: addSpaces(x.duration),
  })),
});

const grimoires = ref([] as CharacterFullItem[]);

for (const item of [...character.value.carried, ...character.value.stored]) {
  if (item.spells) {
    grimoires.value.push(item);
  }
}

const grimoiresDisp = ref(
  grimoires.value.map((book: CharacterFullItem) => ({
    name: book.name,
    fields: spellFields,
    items: book.spells ? book.spells.map((spell) => formatSpell(spell)) : [],
  })),
);
</script>

<template>
  <AlertBlock v-if="apiError && showApiError" alertType="red" :centered="true" @close="showApiError = false">
    {{ apiError }}
  </AlertBlock>
  <Header :title="addSpaces(character.name)" />
  <div v-if="!printing" ref="contentContainerRef" class="flex flex-wrap">
    <ActionButton :size="'sm'" class="m-1" @click="saveCsv()">Download CSV</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="saveJson()">Download JSON</ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="print()">Print</ActionButton>
    <ActionButton
      v-if="character.canEdit"
      :size="'sm'"
      class="m-1"
      @click="router.push({ name: 'character', params: { id: id } })"
    >
      Edit
    </ActionButton>
    <ActionButton :size="'sm'" class="m-1" @click="router.push({ name: 'characters' })">Back to list</ActionButton>
  </div>

  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <div class="grow">
      <div class="mb-1">Basic</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Name</span>
                <span class="mr-3"> {{ addSpaces(character.name) }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Species</span>
                <span class="mr-3"> {{ addSpaces(character.species) }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Description</span>
                <span class="mr-3"> {{ addSpaces(character.description) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grow">
      <div class="mb-1">Career</div>
      <table class="border-collapse w-full">
        <tbody>
          <tr>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Current</span>
                <TextLink routeName="career" :params="{ id: character.currentCareer.id }" :noColour="true" class="mr-3">
                  {{ addSpaces(character.currentCareer.name) }}
                </TextLink>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Class</span>
                <span class="mr-3"> {{ addSpaces(character.currentCareer.className) }}</span>
              </div>
            </td>
            <td class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Status</span>
                <span class="mr-3"> {{ addSpaces(character.status + " " + character.standing) }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="border border-neutral-400 p-2">
              <div class="flex flex-wrap">
                <span class="mr-3 font-semibold">Past Careers</span>
                <TextLink
                  v-for="(pastCareer, i) in character.pastCareers"
                  :key="i"
                  routeName="career"
                  :params="{ id: pastCareer.id }"
                  :noColour="true"
                  class="mr-3"
                >
                  {{ addSpaces(pastCareer.name) }}
                </TextLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <ViewCharacterTable title="Movement" :items="displayMovement.items" :fields="displayMovement.fields" class="grow" />
    <ViewCharacterTable title="Wealth" :items="displayWealth.items" :fields="displayWealth.fields" class="grow" />
    <ViewCharacterTable title="Fate" :items="displayFate.items" :fields="displayFate.fields" class="grow" />
    <ViewCharacterTable
      title="Resilience"
      :items="displayResilience.items"
      :fields="displayResilience.fields"
      class="grow"
    />
  </div>
  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <ViewCharacterTable
      title="Experience"
      :items="displayExperience.items"
      :fields="displayExperience.fields"
      class="grow"
    />
    <ViewCharacterTable title="Other" :items="displayOther.items" :fields="displayOther.fields" class="grow" />
  </div>
  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <ViewCharacterTable
      title="Attributes 1"
      :items="displayAttributes1.items"
      :fields="displayAttributes1.fields"
      class="grow"
    />
    <ViewCharacterTable
      title="Attributes 2"
      :items="displayAttributes2.items"
      :fields="displayAttributes2.fields"
      class="grow"
    />
  </div>
  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <ViewCharacterTable
      title="Basic skills 1"
      :items="displayBasicSkills.items.slice(0, Math.floor(character.basicSkills.length / 2))"
      :fields="displayBasicSkills.fields"
      class="grow"
    >
      <template #name="item">
        <TextLink routeName="skill" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
    <ViewCharacterTable
      title="Basic skills 2"
      :items="displayBasicSkills.items.slice(Math.floor(character.basicSkills.length / 2))"
      :fields="displayBasicSkills.fields"
      class="grow"
    >
      <template #name="item">
        <TextLink routeName="skill" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
  </div>
  <div class="flex justify-between text-left gap-5 my-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <ViewCharacterTable
      title="Advanced skills"
      :items="displayAdvancedSkills.items"
      :fields="displayAdvancedSkills.fields"
      class="grow"
    >
      <template #name="item">
        <TextLink routeName="skill" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
    <ViewCharacterTable title="Talents" :items="displayTalents.items" :fields="displayTalents.fields" class="grow">
      <template #name="item">
        <TextLink routeName="talent" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
      </template>
    </ViewCharacterTable>
  </div>

  <ViewCharacterTable
    title="Equipped armour"
    :stack="!isEqualOrGreater && !printing"
    :items="equippedArmourDisp.items"
    :fields="equippedArmourDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="item" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
    <template #qualities="item: Record<string, any>">
      <div v-if="item.qualities">
        <span v-for="(quality, i) in item.qualities" :key="i">
          <TextLink routeName="property" :params="{ id: quality.id }" :noColour="true">
            {{ quality.name }}
          </TextLink>
          <span v-if="i != item.qualities.length - 1">, </span>
        </span>
      </div>
    </template>
  </ViewCharacterTable>

  <ViewCharacterTable
    title="Equipped weapon"
    :stack="!isEqualOrGreater && !printing"
    :items="equippedWeaponDisp.items"
    :fields="equippedWeaponDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="item" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
    <template #qualities="item: Record<string, any>">
      <div v-if="item.qualities">
        <span v-for="(quality, i) in item.qualities" :key="i">
          <TextLink routeName="property" :params="{ id: quality.id }" :noColour="true">
            {{ quality.name }}
          </TextLink>
          <span v-if="i != item.qualities.length - 1">, </span>
        </span>
      </div>
    </template>
  </ViewCharacterTable>

  <ViewCharacterTable
    title="Other equipped trappings"
    :stack="!isEqualOrGreater && !printing"
    :items="equippedOtherDisp.items"
    :fields="equippedOtherDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="item" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>

  <ViewCharacterTable
    title="Carried trappings"
    :stack="!isEqualOrGreater && !printing"
    :items="carriedDisp.items"
    :fields="carriedDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="item" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>

  <div class="flex justify-between text-left gap-5" :class="[isEqualOrGreater ? '' : 'flex-wrap']">
    <div class="text-left grow">
      <div class="mb-1">Owned and stored stuff</div>

      <div class="p-2 border border-neutral-400">
        <span v-for="(item, i) in storedDisp.items" :key="i">
          <TextLink routeName="item" :params="{ id: item.id }" :noColour="true">
            {{ item.name }}
          </TextLink>
          <span v-if="i != storedDisp.items.length - 1">, </span>
        </span>
      </div>
    </div>
    <ViewCharacterTable
      title="Encumbrance (Equipped and Carried)"
      :items="encDisp.items"
      :fields="encDisp.fields"
      class="grow"
    />
  </div>
  <ViewCharacterTable
    title="Mutations"
    :stack="!isEqualOrGreater && !printing"
    :items="mutationDisp.items"
    :fields="mutationDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="mutation" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>
  <ViewCharacterTable
    title="Known spells"
    :stack="!isEqualOrGreater && !printing"
    :items="spellsDisp.items"
    :fields="spellsDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="spell" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>
  <ViewCharacterTable
    title="Known prayers"
    :stack="!isEqualOrGreater && !printing"
    :items="prayerDisp.items"
    :fields="prayerDisp.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="prayer" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>
  <ViewCharacterTable
    v-for="book in grimoiresDisp"
    :key="book.name"
    :title="'Spells in ' + addSpaces(book.name)"
    :stack="!isEqualOrGreater && !printing"
    :items="book.items"
    :fields="book.fields"
    class="my-5"
  >
    <template #name="item">
      <TextLink routeName="spell" :params="{ id: item.id }" :noColour="true">{{ item.name }}</TextLink>
    </template>
  </ViewCharacterTable>
</template>

<style scoped></style>
