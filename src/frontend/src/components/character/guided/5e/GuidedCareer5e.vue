<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import { printSpeciesWithRegion } from "@/services/wh/core/species.ts";
import { printAttributeName } from "@/services/wh/core/attributes.ts";
import {
  CareerClass,
  careerClassList,
  printClassName,
  printStatusStanding,
  printStatusTier,
} from "@/services/wh/content/career.ts";
import { printCareerCoin, printCareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import {
  canKeepCareerRoll5e,
  careerBonusTrappings5e,
  careerRollStage5e,
  rollCareers5e,
} from "@/services/wh/character/generation/5e/career5e.ts";
import {
  GuidedContext5e,
  guidedCareer5e,
  GuidedState5e,
  guidedSpecies5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";

// Step 2 (pp. 36–37): roll on the species' column of the Random Class and Career Table, or choose a class and a career
// (the careers the generator offers: open to the species, with all four levels). The roll sequence: keep the first
// roll (two level 2 trappings), or roll two more and take one of the three (one), or roll on one at a time (none).
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const species = computed(() => guidedSpecies5e(state.value));
const career = computed(() => guidedCareer5e(state.value, props.context));
const stage = computed(() => careerRollStage5e(state.value.careerRolls));
const table = computed(() =>
  species.value === null ? [] : (props.context.generationProps.careerTable[species.value] ?? []),
);

const ROLL_LABEL = { none: "Roll", first: "Roll two more", three: "Roll again", later: "Roll again" };
const KEEP_GIVES = ["no trappings", "1 trapping from level 2", "2 trappings from level 2"];

function roll() {
  if (species.value === null) {
    return;
  }
  // Rolling on means the current roll is not kept.
  if (state.value.career !== null && "fromRoll" in state.value.career) {
    state.value.career = null;
  }
  state.value.careerRolls = rollCareers5e(state.value.careerRolls, table.value, species.value);
}

function canKeep(index: number): boolean {
  return species.value !== null && canKeepCareerRoll5e(state.value.careerRolls, index, species.value);
}

function isKept(index: number): boolean {
  return state.value.career !== null && "fromRoll" in state.value.career && state.value.career.fromRoll === index;
}

function keepGives(index: number): string {
  return KEEP_GIVES[careerBonusTrappings5e(state.value.careerRolls, { fromRoll: index })];
}

const careerName = (id: string) => props.context.careers.find((x) => x.id === id)?.name ?? "Unknown career";

// Choosing: a class, then one of its careers open to the species.
const offered = computed(() =>
  props.context.careers
    .filter((x) => species.value !== null && x.allowedForSpeciesWithRegion(species.value))
    .filter((x) => x.level1.exists && x.level2.exists && x.level3.exists && x.level4.exists)
    .sort((a, b) => a.name.localeCompare(b.name)),
);
const classOpts = computed(() =>
  careerClassList
    .filter((c) => offered.value.some((x) => x.careerClass === c))
    .map((c) => ({ text: printClassName(c), value: c })),
);
const chosenId = computed(() =>
  state.value.career !== null && "chosen" in state.value.career ? state.value.career.chosen : null,
);
// The class only narrows the career list: the class picked here, else the career's, else the first.
const browsedClass = ref<CareerClass | null>(null);
const chosenClass = computed({
  get: (): CareerClass | null => browsedClass.value ?? career.value?.careerClass ?? classOpts.value[0]?.value ?? null,
  set: (value: CareerClass | null) => {
    browsedClass.value = value;
  },
});
const classCareers = computed(() => offered.value.filter((x) => x.careerClass === chosenClass.value));
const careerOpts = computed(() => [
  { text: "—", value: null },
  ...classCareers.value.map((x) => ({ text: x.name, value: x.id })),
]);
const chosenCareer = computed({
  get: () => (classCareers.value.some((x) => x.id === chosenId.value) ? chosenId.value : null),
  set: (value: string | null) => {
    state.value.career = value === null ? null : { chosen: value };
  },
});

const bonusTrappings = computed(() =>
  state.value.career === null ? 0 : careerBonusTrappings5e(state.value.careerRolls, state.value.career),
);
const nameOf = (list: { id: string; name: string }[]) => (id: string) => list.find((x) => x.id === id)?.name ?? id;
</script>

<template>
  <p>
    Roll on your species' column of the Random Class and Career Table, or choose a career. Keeping your first roll gives
    you two trappings from the career's second level; if you roll two more and take one of the three rolls, you get one.
    After that, or if you choose, there are no extra trappings.
  </p>
  <div class="flex flex-col gap-2">
    <div>
      <AppButton icon="lucide:dices" :disabled="table.length === 0" @click="roll">{{ ROLL_LABEL[stage] }}</AppButton>
    </div>
    <ol v-if="state.careerRolls.length > 0" class="flex flex-col gap-1" aria-label="Rolls">
      <li v-for="(x, index) in state.careerRolls" :key="index" class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span class="w-10 text-right tabular-nums">{{ String(x.roll).padStart(2, "0") }}</span>
        <span class="flex-1 min-w-40">
          {{ careerName(x.career) }}
          <span v-if="x.species !== species" class="text-sm text-neutral-600">
            (rolled for {{ printSpeciesWithRegion(x.species) }})
          </span>
        </span>
        <span v-if="isKept(index)" class="font-semibold">Kept</span>
        <AppButton v-else-if="canKeep(index)" icon="lucide:check" @click="state.career = { fromRoll: index }">
          Keep ({{ keepGives(index) }})
        </AppButton>
      </li>
    </ol>
  </div>
  <SheetTable :columns="2">
    <SheetSelect v-model="chosenClass" title="Or choose: class" :options="classOpts" />
    <SheetSelect v-model="chosenCareer" title="Career" :options="careerOpts" />
  </SheetTable>
  <div v-if="career !== null" class="flex flex-col gap-1">
    <div class="font-semibold">
      {{ career.name }} ({{ printClassName(career.careerClass) }}) · {{ printStatusTier(career.level1.status) }}
      {{ printStatusStanding(career.level1.standing) }}
    </div>
    <div>
      Level 1: {{ career.level1.name }}. Characteristics:
      {{ career.level1.attributes.map((x) => printAttributeName(x)).join(", ") }}
    </div>
    <div>Skills: {{ [...career.level1.skills].map(nameOf(context.skills)).join(", ") }}</div>
    <div>Talents: {{ [...career.level1.talents].map(nameOf(context.talents)).join(", ") }}</div>
    <div>
      Trappings:
      {{
        [
          ...career.level1.trappings.map((x) => printCareerTrappingEntry(x, nameOf(context.items))),
          ...career.level1.money.map((x) => `${x.number} ${printCareerCoin(x.coin)}`),
        ].join("; ")
      }}
    </div>
    <div v-if="bonusTrappings > 0">
      You also get {{ bonusTrappings === 2 ? "two trappings" : "one trapping" }} from level 2 ({{
        career.level2.name
      }}), picked in Trappings and wealth.
    </div>
  </div>
</template>
