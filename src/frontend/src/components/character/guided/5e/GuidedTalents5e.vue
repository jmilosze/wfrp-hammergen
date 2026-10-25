<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import FormRadio from "@/components/form/FormRadio.vue";
import { RANDOM_TALENT } from "@/services/wh/character/generation/shared/talents.ts";
import {
  canRollRandomTalents5e,
  careerTalentChoices5e,
  rollGuidedRandomTalent5e,
  SpeciesTalentRow5e,
  speciesGroupMembers5e,
  speciesTalentRows5e,
} from "@/services/wh/character/generation/5e/talents5e.ts";
import {
  GuidedContext5e,
  GuidedState5e,
  guidedTalentsContext5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";
import GuidedMagicNote5e from "./GuidedMagicNote5e.vue";

// Step 5 (pp. 23, 39): the species talents (each "A or B" chosen, each group settled by a member, then each Random
// Talent rolled) and one level 1 career talent still under its maximum rank.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const g = computed(() => state.value.talents);
const tctx = computed(() => guidedTalentsContext5e(state.value, props.context));
const rows = computed(() => speciesTalentRows5e(g.value, tctx.value));
const canRoll = computed(() => canRollRandomTalents5e(rows.value));
const careerChoices = computed(() => careerTalentChoices5e(g.value, tctx.value));

const talentMap = computed(() => new Map(props.context.talents.map((x) => [x.id, x])));
const nameOf = (id: string) => (id === RANDOM_TALENT ? "Random Talent" : (talentMap.value.get(id)?.name ?? id));

// The career talent choices as the radio list shows them: a talent, or a group (e.g. Striding Gait) with the members
// still open to take, picked in a list once the group is selected.
const careerEntries = computed(() => {
  const choices = new Set(careerChoices.value);
  const entries: { id: string; members: string[] }[] = [];
  for (const id of tctx.value.level1Talents) {
    if (id in tctx.value.talentGroupMap) {
      const members = tctx.value.talentGroupMap[id].filter((x) => choices.has(x));
      if (members.length > 0) {
        entries.push({ id, members: members.sort((a, b) => nameOf(a).localeCompare(nameOf(b))) });
      }
    } else if (choices.has(id)) {
      entries.push({ id, members: [] });
    }
  }
  return entries;
});
// The group selected before a member is picked.
const selectedGroup = ref<string | null>(null);
const careerGroup = computed(
  () =>
    careerEntries.value.find(
      (x) => x.members.length > 0 && (x.id === selectedGroup.value || x.members.includes(g.value.career ?? "")),
    )?.id ?? null,
);

function takeCareerTalent(id: string) {
  selectedGroup.value = null;
  state.value.talents = { ...g.value, career: id };
}

function takeCareerGroup(id: string) {
  selectedGroup.value = id;
  state.value.talents = { ...g.value, career: null };
}

function takeCareerMember(event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    state.value.talents = { ...g.value, career: event.target.value };
  }
}

// A member as its group's list shows it: without the group's name ("Wetland", not "Striding Gait - Wetland").
function memberName(group: string, member: string): string {
  const prefix = `${nameOf(group)} - `;
  return nameOf(member).startsWith(prefix) ? nameOf(member).slice(prefix.length) : nameOf(member);
}

// An option of a choice taken by another entry can't be chosen.
function optionTaken(row: SpeciesTalentRow5e, option: string): boolean {
  return rows.value.some((x) => x.index !== row.index && x.talent === option);
}

function setOption(row: SpeciesTalentRow5e, option: string) {
  state.value.talents = { ...g.value, options: { ...g.value.options, [row.index]: option } };
}

function setMember(row: SpeciesTalentRow5e, event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    state.value.talents = { ...g.value, members: { ...g.value.members, [row.index]: event.target.value } };
  }
}

function roll(row: SpeciesTalentRow5e) {
  if (row.randomIndex !== null) {
    state.value.talents = rollGuidedRandomTalent5e(g.value, tctx.value, row.randomIndex);
  }
}

// A roll kept for this entry that is now a talent the character has from elsewhere, or a group with no member left
// (p. 23: roll again).
function clashingRoll(row: SpeciesTalentRow5e): string | null {
  const rolled = row.randomIndex === null ? undefined : g.value.randomRolls[row.randomIndex];
  const clashes = row.group === null ? row.talent === null : members(row).length === 0;
  return rolled !== undefined && clashes ? rolled : null;
}

// A group's members to pick from, by name.
const members = (row: SpeciesTalentRow5e) =>
  speciesGroupMembers5e(row, rows.value, tctx.value).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

// How a row shows under its choice: a fixed talent, a member to pick of a group (a group option or a roll on a group
// row), a rolled talent, or a roll to make; nothing while a choice is not made.
function show(row: SpeciesTalentRow5e): "fixed" | "pick" | "rolled" | "roll" | null {
  if (row.kind === "talent") {
    return row.options.length === 1 ? "fixed" : null;
  } else if (row.kind === "group") {
    return "pick";
  } else if (row.kind === "random") {
    if (clashingRoll(row) !== null || (row.group === null && row.talent === null)) {
      return "roll";
    }
    return row.group === null ? "rolled" : "pick";
  }
  return null;
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <h4 class="text-lg font-semibold">Species talents</h4>
    <p>Make the choices your species gives and/or roll each Random Talent.</p>
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-x-4 gap-y-2">
      <li v-for="row in rows" :key="row.index" class="flex flex-col gap-1">
        <fieldset v-if="row.options.length > 1" class="flex flex-wrap gap-x-4 gap-y-1">
          <legend class="sr-only">Choose one</legend>
          <label v-for="option in row.options" :key="option" class="flex items-center gap-1">
            <FormRadio
              :name="`species-talent-${row.index}`"
              :checked="row.option === option"
              :disabled="optionTaken(row, option)"
              @change="setOption(row, option)"
            />
            {{ nameOf(option) }}
          </label>
        </fieldset>
        <div v-if="show(row) === 'fixed'">{{ nameOf(row.talent ?? "") }}</div>
        <div v-else-if="show(row) === 'rolled'">Random Talent: {{ nameOf(row.talent ?? "") }}</div>
        <div v-else-if="show(row) === 'pick'" class="flex flex-wrap items-center gap-2">
          <span v-if="row.kind === 'random'">Random Talent: {{ nameOf(row.group ?? "") }}</span>
          <select
            class="w-fit rounded border border-neutral-300 bg-editable px-1 py-0.5"
            :value="row.talent ?? ''"
            :aria-label="`${nameOf(row.group ?? '')}: pick one`"
            @change="setMember(row, $event)"
          >
            <option value="" disabled>{{ nameOf(row.group ?? "") }}: pick one</option>
            <option v-for="member in members(row)" :key="member" :value="member">{{ nameOf(member) }}</option>
          </select>
        </div>
        <div v-else-if="show(row) === 'roll'" class="flex flex-wrap items-center gap-2">
          <AppButton icon="lucide:dices" :disabled="!canRoll" @click="roll(row)">Roll a Random Talent</AppButton>
          <span v-if="clashingRoll(row) !== null" class="text-sm">
            You rolled {{ nameOf(clashingRoll(row) ?? "") }}, which you now have already: roll again.
          </span>
          <span v-else-if="!canRoll" class="text-sm text-neutral-600">Make the other choices first.</span>
        </div>
      </li>
    </ul>
  </section>
  <section class="flex flex-col gap-2 border-t border-neutral-300 pt-4 mt-2">
    <h4 class="text-lg font-semibold">Career talent</h4>
    <template v-if="careerChoices.length > 0">
      <p>Take one talent from your career's first level.</p>
      <fieldset class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-x-4 gap-y-2">
        <legend class="sr-only">Career talent</legend>
        <div v-for="entry in careerEntries" :key="entry.id" class="flex flex-col gap-1">
          <label class="flex items-center gap-1">
            <FormRadio
              name="career-talent"
              :checked="entry.members.length === 0 ? g.career === entry.id : careerGroup === entry.id"
              @change="entry.members.length === 0 ? takeCareerTalent(entry.id) : takeCareerGroup(entry.id)"
            />
            {{ nameOf(entry.id) }}
          </label>
          <select
            v-if="entry.members.length > 0 && careerGroup === entry.id"
            class="w-fit max-w-full rounded border border-neutral-300 bg-editable px-1 py-0.5"
            :value="g.career ?? ''"
            :aria-label="`${nameOf(entry.id)} specialisation`"
            @change="takeCareerMember"
          >
            <option value="" disabled>Pick</option>
            <option v-for="member in entry.members" :key="member" :value="member">
              {{ memberName(entry.id, member) }}
            </option>
          </select>
        </div>
      </fieldset>
    </template>
    <p v-else-if="tctx.attributes === null">
      Finish your characteristics first: they decide how many ranks of a talent you can take.
    </p>
    <p v-else-if="tctx.level1Talents.length === 0">
      Your career has no talents at its first level, so there is none to take.
    </p>
    <p v-else>You have every talent of your career's first level at its highest rank, so there is none to take.</p>
  </section>
  <GuidedMagicNote5e />
</template>
