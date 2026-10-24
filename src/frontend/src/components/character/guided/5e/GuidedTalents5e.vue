<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
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
// Talent rolled, Q4) and one level 1 career talent still under its maximum rank.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const g = computed(() => state.value.talents);
const tctx = computed(() => guidedTalentsContext5e(state.value, props.context));
const rows = computed(() => speciesTalentRows5e(g.value, tctx.value));
const canRoll = computed(() => canRollRandomTalents5e(rows.value));
const careerChoices = computed(() => careerTalentChoices5e(g.value, tctx.value));

const talentMap = computed(() => new Map(props.context.talents.map((x) => [x.id, x])));
const nameOf = (id: string) => (id === RANDOM_TALENT ? "Random Talent" : (talentMap.value.get(id)?.name ?? id));

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

// A roll kept for this entry that is now a talent the character has from elsewhere (p. 23: roll again).
function clashingRoll(row: SpeciesTalentRow5e): string | null {
  const rolled = row.randomIndex === null ? undefined : g.value.randomRolls[row.randomIndex];
  return rolled !== undefined && row.talent === null ? rolled : null;
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <h4 class="font-semibold">Species talents</h4>
    <p>Settle each of your species' talents. Random Talents are rolled once the others are settled.</p>
    <ul class="flex flex-col gap-2">
      <li v-for="row in rows" :key="row.index" class="flex flex-col gap-1">
        <fieldset v-if="row.options.length > 1" class="flex flex-wrap gap-x-4 gap-y-1">
          <legend class="sr-only">Choose one</legend>
          <label v-for="option in row.options" :key="option" class="flex items-center gap-1">
            <input
              type="radio"
              :name="`species-talent-${row.index}`"
              :checked="row.option === option"
              :disabled="optionTaken(row, option)"
              @change="setOption(row, option)"
            />
            {{ nameOf(option) }}
          </label>
        </fieldset>
        <div v-if="row.kind === 'talent' && row.options.length === 1">{{ nameOf(row.option ?? "") }}</div>
        <select
          v-else-if="row.kind === 'group' && row.option !== null"
          class="w-fit rounded border border-neutral-300 bg-editable px-1 py-0.5"
          :value="row.talent ?? ''"
          :aria-label="`${nameOf(row.option)}: pick one`"
          @change="setMember(row, $event)"
        >
          <option value="" disabled>{{ nameOf(row.option) }}: pick one</option>
          <option v-for="member in speciesGroupMembers5e(row, rows, tctx)" :key="member" :value="member">
            {{ nameOf(member) }}
          </option>
        </select>
        <div v-else-if="row.kind === 'random'" class="flex flex-wrap items-center gap-2">
          <template v-if="row.talent !== null">Random Talent: {{ nameOf(row.talent) }}</template>
          <template v-else>
            <AppButton icon="lucide:dices" :disabled="!canRoll" @click="roll(row)">Roll a Random Talent</AppButton>
            <span v-if="clashingRoll(row) !== null" class="text-sm">
              You rolled {{ nameOf(clashingRoll(row) ?? "") }}, which you now have already: roll again.
            </span>
            <span v-else-if="!canRoll" class="text-sm text-neutral-600">Settle the other talents first.</span>
          </template>
        </div>
      </li>
    </ul>
  </section>
  <section class="flex flex-col gap-2">
    <h4 class="font-semibold">Career talent</h4>
    <template v-if="careerChoices.length > 0">
      <p>Take one talent from your career's first level.</p>
      <fieldset class="flex flex-col gap-1">
        <legend class="sr-only">Career talent</legend>
        <label v-for="id in careerChoices" :key="id" class="flex items-center gap-2">
          <input
            type="radio"
            name="career-talent"
            :checked="g.career === id"
            @change="state.talents = { ...g, career: id }"
          />
          {{ nameOf(id) }}
        </label>
      </fieldset>
    </template>
    <p v-else-if="tctx.attributes === null">
      Settle your characteristics first: they decide how many ranks you can take.
    </p>
    <p v-else>You have every talent of your career's first level at its highest rank, so there is none to take.</p>
  </section>
  <GuidedMagicNote5e />
</template>
