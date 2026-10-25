<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";
import { printSpeciesWithRegion, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { getMovement5e, SPECIES_5E } from "@/services/wh/character/rules/rules5e.ts";
import { getFateFortune5e } from "@/services/wh/character/generation/5e/fate5e.ts";
import { rollSpecies5e, speciesFortuneBonus5e } from "@/services/wh/character/generation/5e/species5e.ts";
import { GuidedContext5e, GuidedState5e, guidedSpecies5e } from "@/services/wh/character/generation/5e/guided5e.ts";
import { RANDOM_TALENT, speciesTalentEntries } from "@/services/wh/character/generation/shared/talents.ts";

// Step 1 (p. 23): roll on the Species Table once, or choose. Keeping the roll gives +1 Fortune; a second roll would
// give no more than choosing, so there is none.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const species = computed(() => guidedSpecies5e(state.value));
const chosen = computed({
  get: () => (state.value.species !== null && "chosen" in state.value.species ? state.value.species.chosen : null),
  set: (value: SpeciesWithRegion | null) => {
    state.value.species = value === null ? null : { chosen: value };
  },
});
const chooseOpts = [
  { text: "—", value: null },
  ...SPECIES_5E.map((x) => ({ text: printSpeciesWithRegion(x), value: x })),
];

// The roll, once made (one roll only), and its score as the book writes it (01–00).
const rolled = computed(() => state.value.speciesRolls.at(0));
const rollText = computed(() =>
  rolled.value === undefined ? "" : rolled.value.roll === 100 ? "00" : String(rolled.value.roll).padStart(2, "0"),
);

function roll() {
  state.value.speciesRolls = [...state.value.speciesRolls, rollSpecies5e()];
}

function keep() {
  state.value.species = { fromRoll: 0 };
}

function isKept(index: number): boolean {
  return state.value.species !== null && "fromRoll" in state.value.species && state.value.species.fromRoll === index;
}

const fortuneBonus = computed(() =>
  state.value.species === null ? 0 : speciesFortuneBonus5e(state.value.speciesRolls, state.value.species),
);
const fateFortune = computed(() => (species.value === null ? null : getFateFortune5e(species.value)));
const skillName = (id: string) => props.context.skills.find((x) => x.id === id)?.name ?? id;
const talentName = (id: string) =>
  id === RANDOM_TALENT ? "Random Talent" : (props.context.talents.find((x) => x.id === id)?.name ?? id);

// What the species gives, as its section of the book lists it: languages, the skills to pick from and the talents.
const languages = computed(() =>
  species.value === null
    ? ""
    : (props.context.generationProps.speciesLanguages[species.value] ?? []).map(skillName).join(", "),
);
const speciesSkills = computed(() =>
  species.value === null
    ? ""
    : (props.context.generationProps.speciesSkills[species.value] ?? []).map(skillName).join(", "),
);
// The talents, with the Random Talents counted ("4 Random Talents") rather than listed one by one.
const speciesTalents = computed(() => {
  if (species.value === null) {
    return "";
  }
  const entries = speciesTalentEntries(props.context.generationProps.speciesTalents[species.value] ?? []);
  const random = entries.filter((x) => x.options.length === 1 && x.options[0] === RANDOM_TALENT).length;
  return [
    ...entries
      .filter((x) => !(x.options.length === 1 && x.options[0] === RANDOM_TALENT))
      .map((x) => x.options.map(talentName).join(" or ")),
    ...(random === 0 ? [] : [random === 1 ? "1 Random Talent" : `${random} Random Talents`]),
  ].join(", ");
});
</script>

<template>
  <p>Roll on the Species Table, or choose a species. If you keep your roll, you get an extra point of Fortune.</p>
  <!-- Narrow labels, so the roll, the species and Keep fit beside Roll on a phone. -->
  <SheetTable class="!font-sans [&_[data-sheet-label]]:min-w-24">
    <SheetCell title="Roll">
      <!-- The Roll button is the label; once rolled it shows the score. -->
      <template #label>
        <AppButton v-if="rolled === undefined" class="w-full" icon="lucide:dices" @click="roll">Roll</AppButton>
        <AppButton v-else class="w-full" icon="lucide:dices" disabled :aria-label="`Rolled ${rollText}`">
          {{ rollText }}
        </AppButton>
      </template>
      <div v-if="rolled !== undefined" class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span class="whitespace-nowrap">{{ printSpeciesWithRegion(rolled.species) }}</span>
        <span v-if="isKept(0)" class="ml-auto font-semibold">Kept</span>
        <AppButton v-else class="ml-auto" icon="lucide:check" @click="keep">Keep</AppButton>
      </div>
    </SheetCell>
    <SheetSelect v-model="chosen" title="Or choose" :options="chooseOpts" />
  </SheetTable>
  <div v-if="species !== null && fateFortune !== null" class="p-4 border-l-4 border-brand bg-parchment-light rounded">
    <p class="font-semibold">{{ printSpeciesWithRegion(species) }}</p>
    <p class="mt-1">
      Fate {{ fateFortune.fate }} · Fortune {{ fateFortune.fortune + fortuneBonus }}
      <span v-if="fortuneBonus > 0">(+1 for keeping the roll)</span> · Movement {{ getMovement5e(species, 0) }}
    </p>
    <dl class="mt-2 grid gap-x-3 gap-y-1 @md:grid-cols-[auto_1fr]">
      <dt class="font-semibold">Fluent languages</dt>
      <dd>{{ languages }}</dd>
      <dt class="font-semibold">Skills</dt>
      <dd>{{ speciesSkills }}</dd>
      <dt class="font-semibold">Talents</dt>
      <dd>{{ speciesTalents }}</dd>
    </dl>
  </div>
</template>
