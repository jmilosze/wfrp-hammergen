<script setup lang="ts">
import { computed, watch } from "vue";
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import FormRadio from "@/components/form/FormRadio.vue";
import { CareerCoin, printCareerCoin, printCareerTrapping } from "@/services/wh/content/careerTrapping.ts";
import { printStatusStanding, printStatusTier } from "@/services/wh/content/career.ts";
import { IdNumberValue, printItemWithValue } from "@/utils/idNumberValue.ts";
import {
  bonusOf5e,
  careerOptionKey5e,
  classOptionKey5e,
  guidedCoins5e,
  rollMissingTrappings5e,
} from "@/services/wh/character/generation/5e/trappings5e.ts";
import {
  GuidedContext5e,
  GuidedState5e,
  guidedTrappingsContext5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";

// Step 6 (pp. 36, 39): the class trappings, the career's level 1 trappings and money, the level 2 bonus trappings of
// the career roll (an entry or a money item), and the starting wealth. Quantities and coins are rolled when they
// first show and kept.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const g = computed(() => state.value.trappings);
const tctx = computed(() => guidedTrappingsContext5e(state.value, props.context));
const career = computed(() => tctx.value.career);

// Whatever the picks need is rolled as soon as it shows.
watch(
  [g, tctx],
  () => {
    const rolled = rollMissingTrappings5e(g.value, tctx.value);
    if (rolled !== g.value) {
      state.value.trappings = rolled;
    }
  },
  { immediate: true },
);

const itemName = (id: string) => props.context.items.find((x) => x.id === id)?.name ?? id;
const printRolled = (list: IdNumberValue[]) =>
  list.map((x) => `${x.number === 1 ? "" : `${x.number} × `}${printItemWithValue(itemName(x.id), x.value)}`).join(", ");
const COINS: CareerCoin[] = ["brass", "silver", "gold"];
const printCoins = (coins: [number, number, number]) =>
  coins
    .map((x, i) => (x === 0 ? "" : `${x} ${printCareerCoin(COINS[i])}`))
    .filter((x) => x !== "")
    .join(", ") || "none";

function setOption(key: string, option: number) {
  state.value.trappings = { ...g.value, options: { ...g.value.options, [key]: option } };
}

function toggleBonus(key: string, event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const bonus = event.target.checked ? [...g.value.bonus, key] : g.value.bonus.filter((x) => x !== key);
    state.value.trappings = { ...g.value, bonus: bonus };
  }
}

const bonusTaken = computed(() => (career.value === null ? [] : bonusOf5e(g.value, career.value)));

const coins = computed(() => (career.value === null ? null : guidedCoins5e(g.value, career.value)));

// What an entry gives as rolled, once its option is taken; null before. For a choice, only when dice were rolled: the
// option itself is already on screen.
function classRolled(index: number): string | null {
  if (career.value === null) {
    return null;
  }
  const entry = tctx.value.classEntries[index];
  if (entry.options.length > 1 && !entry.number.includes("d")) {
    return null;
  }
  const key = classOptionKey5e(career.value.careerClass, index);
  const option = entry.options.length === 1 ? 0 : g.value.options[key];
  const rolled = g.value.rolledClass[`${key}:${option}`];
  return rolled === undefined ? null : printRolled(rolled);
}

// The class trappings without a choice, in one line of text, and the ones with a choice, one per line.
const classFixed = computed(() =>
  tctx.value.classEntries
    .flatMap((entry, index) => (entry.options.length === 1 ? [classRolled(index)] : []))
    .filter((x) => x !== null),
);
const classChoices = computed(() =>
  tctx.value.classEntries.map((entry, index) => ({ entry, index })).filter((x) => x.entry.options.length > 1),
);

// The level 1 career trappings without a choice, in one line of text, and the ones with a choice, one per line.
const careerFixed = computed(() =>
  (career.value?.level1.trappings ?? [])
    .flatMap((entry, index) => (entry.options.length === 1 ? [careerRolled(1, index)] : []))
    .filter((x) => x !== null),
);
const careerChoices = computed(() =>
  (career.value?.level1.trappings ?? [])
    .map((entry, index) => ({ entry, index }))
    .filter((x) => x.entry.options.length > 1),
);

function careerRolled(level: 1 | 2, index: number): string | null {
  if (career.value === null) {
    return null;
  }
  const entry = (level === 1 ? career.value.level1 : career.value.level2).trappings[index];
  const key = careerOptionKey5e(career.value, level, index);
  const option = entry.options.length === 1 ? 0 : g.value.options[key];
  // The level 2 trappings show their option next to the box, and so do the choices of level 1.
  if (
    (level === 2 || entry.options.length > 1) &&
    !(entry.options[option]?.some((x) => x.number.includes("d")) ?? false)
  ) {
    return null;
  }
  const rolled = g.value.rolledCareer[`${key}:${option}`];
  return rolled === undefined ? null : printRolled([...rolled.carried, ...rolled.stored]);
}
</script>

<template>
  <template v-if="career !== null">
    <section class="flex flex-col gap-2">
      <h4 class="text-lg font-semibold">Class trappings</h4>
      <p v-if="classFixed.length > 0">{{ classFixed.join(", ") }}</p>
      <ul v-if="classChoices.length > 0" class="flex flex-col gap-1">
        <li v-for="{ entry, index } in classChoices" :key="index">
          <fieldset class="flex flex-wrap gap-x-4">
            <legend class="sr-only">Choose one</legend>
            <label v-for="(option, o) in entry.options" :key="option" class="flex items-center gap-1">
              <FormRadio
                :name="`class-${index}`"
                :checked="g.options[classOptionKey5e(career.careerClass, index)] === o"
                @change="setOption(classOptionKey5e(career.careerClass, index), o)"
              />
              {{ itemName(option) }}
            </label>
          </fieldset>
          <div v-if="classRolled(index) !== null">{{ classRolled(index) }}</div>
        </li>
      </ul>
    </section>
    <section class="flex flex-col gap-2 border-t border-neutral-300 pt-4 mt-2">
      <h4 class="text-lg font-semibold">Career trappings</h4>
      <p v-if="career.level1.trappings.length === 0">Your career has no trappings at its first level.</p>
      <p v-if="careerFixed.length > 0">{{ careerFixed.join(", ") }}</p>
      <ul v-if="careerChoices.length > 0" class="flex flex-col gap-1">
        <li v-for="{ index, entry } in careerChoices" :key="index">
          <fieldset class="flex flex-col gap-1">
            <legend class="sr-only">Choose one</legend>
            <label v-for="(option, o) in entry.options" :key="o" class="flex items-center gap-1">
              <FormRadio
                :name="`career-${index}`"
                :checked="g.options[careerOptionKey5e(career, 1, index)] === o"
                @change="setOption(careerOptionKey5e(career, 1, index), o)"
              />
              {{ option.map((x) => printCareerTrapping(x, itemName(x.id))).join(", ") }}
            </label>
          </fieldset>
          <div v-if="careerRolled(1, index) !== null">{{ careerRolled(1, index) }}</div>
        </li>
      </ul>
    </section>
    <section v-if="tctx.bonusTrappings > 0" class="flex flex-col gap-2 border-t border-neutral-300 pt-4 mt-2">
      <h4 class="text-lg font-semibold">From level 2 ({{ career.level2.name }})</h4>
      <p>
        Your career roll gives you {{ tctx.bonusTrappings === 2 ? "two trappings" : "one trapping" }} from the career's
        second level. Each one ticks a box on your Career Advancement Tracker.
      </p>
      <ul class="flex flex-col gap-1">
        <li v-for="(entry, index) in career.level2.trappings" :key="`entry-${index}`" class="flex flex-col gap-1">
          <label class="flex items-center gap-2">
            <FormCheckbox
              :checked="bonusTaken.includes(`${career.id}:entry:${index}`)"
              :disabled="
                !bonusTaken.includes(`${career.id}:entry:${index}`) && bonusTaken.length >= tctx.bonusTrappings
              "
              @change="toggleBonus(`${career.id}:entry:${index}`, $event)"
            />
            {{
              entry.options
                .map((option) => option.map((x) => printCareerTrapping(x, itemName(x.id))).join(", "))
                .join(" or ")
            }}
          </label>
          <fieldset
            v-if="entry.options.length > 1 && bonusTaken.includes(`${career.id}:entry:${index}`)"
            class="flex flex-col gap-1 pl-7"
          >
            <legend class="sr-only">Choose one</legend>
            <label v-for="(option, o) in entry.options" :key="o" class="flex items-center gap-1">
              <FormRadio
                :name="`bonus-${index}`"
                :checked="g.options[careerOptionKey5e(career, 2, index)] === o"
                @change="setOption(careerOptionKey5e(career, 2, index), o)"
              />
              {{ option.map((x) => printCareerTrapping(x, itemName(x.id))).join(", ") }}
            </label>
          </fieldset>
          <div
            v-if="bonusTaken.includes(`${career.id}:entry:${index}`) && careerRolled(2, index) !== null"
            class="pl-7"
          >
            {{ careerRolled(2, index) }}
          </div>
        </li>
        <li v-for="(money, index) in career.level2.money" :key="`money-${index}`">
          <label class="flex items-center gap-2">
            <FormCheckbox
              :checked="bonusTaken.includes(`${career.id}:money:${index}`)"
              :disabled="
                !bonusTaken.includes(`${career.id}:money:${index}`) && bonusTaken.length >= tctx.bonusTrappings
              "
              @change="toggleBonus(`${career.id}:money:${index}`, $event)"
            />
            {{ money.number }} {{ printCareerCoin(money.coin) }}
          </label>
        </li>
      </ul>
      <p>Picked: {{ bonusTaken.length }} of {{ tctx.bonusTrappings }}.</p>
    </section>
    <section class="flex flex-col gap-2 border-t border-neutral-300 pt-4 mt-2">
      <h4 class="text-lg font-semibold">Wealth</h4>
      <p>
        Your starting coins follow your status ({{ printStatusTier(career.level1.status) }}
        {{ printStatusStanding(career.level1.standing) }}), plus any money your career gives.
      </p>
      <p v-if="coins !== null" class="font-semibold">{{ printCoins(coins) }}</p>
    </section>
  </template>
</template>
