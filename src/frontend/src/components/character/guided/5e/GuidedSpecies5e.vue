<script setup lang="ts">
import { computed } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import { printSpeciesWithRegion, SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { getMovement5e, SPECIES_5E } from "@/services/wh/character/rules/rules5e.ts";
import { getFateFortune5e } from "@/services/wh/character/generation/5e/fate5e.ts";
import { rollSpecies5e, speciesFortuneBonus5e } from "@/services/wh/character/generation/5e/species5e.ts";
import { GuidedContext5e, GuidedState5e, guidedSpecies5e } from "@/services/wh/character/generation/5e/guided5e.ts";

// Step 1 (p. 23): roll on the Species Table or choose. Every roll stays listed; any of them can be kept, and keeping
// the only roll made gives +1 Fortune.
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

const rollLabel = computed(() => (state.value.speciesRolls.length === 0 ? "Roll" : "Roll again"));

function roll() {
  state.value.speciesRolls = [...state.value.speciesRolls, rollSpecies5e()];
}

function isKept(index: number): boolean {
  return state.value.species !== null && "fromRoll" in state.value.species && state.value.species.fromRoll === index;
}

const fortuneBonus = computed(() =>
  state.value.species === null ? 0 : speciesFortuneBonus5e(state.value.speciesRolls, state.value.species),
);
const fateFortune = computed(() => (species.value === null ? null : getFateFortune5e(species.value)));
const languages = computed(() =>
  species.value === null
    ? ""
    : (props.context.generationProps.speciesLanguages[species.value] ?? [])
        .map((id) => props.context.skills.find((x) => x.id === id)?.name ?? id)
        .join(", "),
);
</script>

<template>
  <p>Roll on the Species Table, or choose a species. If you keep your first roll, you get an extra point of Fortune.</p>
  <div class="flex flex-col gap-2">
    <div>
      <AppButton icon="lucide:dices" @click="roll">{{ rollLabel }}</AppButton>
    </div>
    <ol v-if="state.speciesRolls.length > 0" class="flex flex-col gap-1" aria-label="Rolls">
      <li v-for="(x, index) in state.speciesRolls" :key="index" class="flex items-center gap-3">
        <span class="w-10 text-right tabular-nums">{{ String(x.roll).padStart(2, "0") }}</span>
        <span class="flex-1">{{ printSpeciesWithRegion(x.species) }}</span>
        <span v-if="isKept(index)" class="font-semibold">Kept</span>
        <AppButton v-else icon="lucide:check" @click="state.species = { fromRoll: index }">Keep</AppButton>
      </li>
    </ol>
  </div>
  <SheetTable>
    <SheetSelect v-model="chosen" title="Or choose" :options="chooseOpts" />
  </SheetTable>
  <div v-if="species !== null && fateFortune !== null" class="flex flex-col gap-1">
    <div class="font-semibold">{{ printSpeciesWithRegion(species) }}</div>
    <div>
      Fate {{ fateFortune.fate }} · Fortune {{ fateFortune.fortune + fortuneBonus }}
      <span v-if="fortuneBonus > 0">(+1 for keeping the first roll)</span> · Movement {{ getMovement5e(species, 0) }}
    </div>
    <div>Fluent languages (+30): {{ languages }}</div>
  </div>
</template>
