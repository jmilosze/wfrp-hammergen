<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import TextLink from "@/components/ui/TextLink.vue";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";
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
// (5e careers open to the species that have a level 1; guided creation makes a level 1 character, so later levels may
// be missing). The roll sequence: keep the first
// roll (two level 2 trappings), or roll two more and take one of the three (one).
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const species = computed(() => guidedSpecies5e(state.value));
const career = computed(() => guidedCareer5e(state.value, props.context));
const stage = computed(() => careerRollStage5e(state.value.careerRolls));
const table = computed(() =>
  species.value === null ? [] : (props.context.generationProps.careerTable[species.value] ?? []),
);

const ROLL_LABEL = { none: "Roll", first: "Roll two more" };

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

const careerName = (id: string) => props.context.careers.find((x) => x.id === id)?.name ?? "Unknown career";

// Choosing: a class, then one of its careers open to the species with a level 1.
const offered = computed(() =>
  props.context.careers
    .filter((x) => species.value !== null && x.allowedForSpeciesWithRegion(species.value))
    .filter((x) => x.level1.exists)
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
    Roll on your species' column of the Random Class and Career Table, or choose a career. Keep your first roll for two
    trappings from the career's second level, or roll two more and take one of the three for one trapping. If you
    choose, there are none.
  </p>
  <!-- Labels of one width, so the columns line up. -->
  <SheetTable :columns="2" class="!font-sans [&_[data-sheet-label]]:w-40 [&_[data-sheet-label]]:min-w-0">
    <SheetCell v-for="(x, index) in state.careerRolls" :key="index" title="Roll" class="@md:col-span-2">
      <template #label>
        <AppButton
          class="w-full"
          icon="lucide:dices"
          disabled
          :aria-label="`Rolled ${String(x.roll).padStart(2, '0')}`"
        >
          {{ String(x.roll).padStart(2, "0") }}
        </AppButton>
      </template>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          {{ careerName(x.career) }}
          <span v-if="x.species !== species" class="text-sm text-neutral-600">
            (rolled for {{ printSpeciesWithRegion(x.species) }})
          </span>
        </span>
        <span v-if="isKept(index)" class="ml-auto font-semibold">Kept</span>
        <AppButton
          v-else-if="canKeep(index)"
          class="ml-auto"
          icon="lucide:check"
          @click="state.career = { fromRoll: index }"
        >
          Keep
        </AppButton>
      </div>
    </SheetCell>
    <SheetCell v-if="stage !== 'three'" title="Roll" class="@md:col-span-2">
      <template #label>
        <AppButton class="w-full" icon="lucide:dices" :disabled="table.length === 0" @click="roll">
          {{ ROLL_LABEL[stage] }}
        </AppButton>
      </template>
    </SheetCell>
    <SheetSelect v-model="chosenClass" title="Or choose: class" :options="classOpts" />
    <SheetSelect v-model="chosenCareer" title="Career" :options="careerOpts" />
  </SheetTable>
  <div v-if="career !== null" class="p-4 border-l-4 border-brand bg-parchment-light rounded">
    <p class="font-semibold">
      <TextLink routeName="career" :params="{ id: career.id }" noColour>{{ career.name }}</TextLink>
      ({{ printClassName(career.careerClass) }})
    </p>
    <p class="mt-1">
      {{ printStatusTier(career.level1.status) }} {{ printStatusStanding(career.level1.standing) }} · Level 1:
      {{ career.level1.name }}
    </p>
    <dl class="mt-2 grid gap-x-3 gap-y-1 @md:grid-cols-[auto_1fr]">
      <dt class="font-semibold">Characteristics</dt>
      <dd>{{ career.level1.attributes.map((x) => printAttributeName(x)).join(", ") }}</dd>
      <dt class="font-semibold">Skills</dt>
      <dd>{{ [...career.level1.skills].map(nameOf(context.skills)).join(", ") }}</dd>
      <dt class="font-semibold">Talents</dt>
      <dd>{{ [...career.level1.talents].map(nameOf(context.talents)).join(", ") }}</dd>
      <dt class="font-semibold">Trappings</dt>
      <dd>
        {{
          [
            ...career.level1.trappings.map((x) => printCareerTrappingEntry(x, nameOf(context.items))),
            ...career.level1.money.map((x) => `${x.number} ${printCareerCoin(x.coin)}`),
          ].join("; ")
        }}
        <span v-if="bonusTrappings > 0">
          · +{{ bonusTrappings }} {{ bonusTrappings === 1 ? "trapping" : "trappings" }} from level 2 (for keeping the
          roll)
        </span>
      </dd>
    </dl>
  </div>
</template>
