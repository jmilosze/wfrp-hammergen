<script setup lang="ts">
import { computed } from "vue";
import IconButton from "@/components/ui/IconButton.vue";
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import { getAttributeValue } from "@/services/wh/core/attributes.ts";
import {
  careerGroupMembers5e,
  careerSkillAdvanceLimit5e,
  concreteCareerSkills5e,
  CREATION_CAREER_SKILL_ADVANCES_5E,
  guidedSpeciesSkills5e,
  SPECIES_SKILL_COUNT_5E,
} from "@/services/wh/character/generation/5e/skills5e.ts";
import { ADVANCE_POINTS_5E } from "@/services/wh/character/generation/5e/experience5e.ts";
import {
  guidedAttributes5e,
  GuidedContext5e,
  guidedSkillsContext5e,
  GuidedState5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";
import GuidedMagicNote5e from "./GuidedMagicNote5e.vue";

// Step 4 (pp. 23, 38–39): five species skills at +5 (a group, e.g. Stealth, needs a specialisation), the fluent
// languages at +30, and eight Advances over the level 1 career skills (each career group skill specialised first), at
// most +15 per skill counting the species Advance.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const g = computed(() => state.value.skills);
const sctx = computed(() => guidedSkillsContext5e(state.value, props.context));
const attributes = computed(() => guidedAttributes5e(state.value));
const speciesPoints = computed(() => guidedSpeciesSkills5e(g.value, sctx.value));
const careerSkills = computed(() => concreteCareerSkills5e(g.value, sctx.value));
const speciesCount = computed(() => Object.keys(g.value.species).length);
const speciesTarget = computed(() => Math.min(SPECIES_SKILL_COUNT_5E, sctx.value.speciesSkills.length));
const advancesUsed = computed(() => Object.values(g.value.advances).reduce((sum, x) => sum + x, 0));

const skillMap = computed(() => new Map(props.context.skills.map((x) => [x.id, x])));
const nameOf = (id: string) => skillMap.value.get(id)?.name ?? id;
const isGroup = (id: string) => id in sctx.value.skillGroupMap;
// A group's specialisations, by name.
const members = (group: string) =>
  [...sctx.value.skillGroupMap[group]].sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

// The value of a skill: its characteristic plus the species and career Advances.
function value(id: string): number | null {
  const skill = skillMap.value.get(id);
  if (skill === undefined || attributes.value === null) {
    return null;
  }
  const advances = (g.value.advances[id] ?? 0) * ADVANCE_POINTS_5E;
  return getAttributeValue(skill.attribute, attributes.value) + (speciesPoints.value[id] ?? 0) + advances;
}

function toggleSpecies(entry: string, event: Event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const species = { ...g.value.species };
  if (event.target.checked) {
    species[entry] = isGroup(entry) ? "" : entry;
  } else {
    delete species[entry];
  }
  state.value.skills = { ...g.value, species: species };
}

// The specialisations a species group entry can take: not a fluent language and not picked elsewhere.
function speciesMembers(entry: string): string[] {
  const taken = Object.entries(g.value.species)
    .filter(([e]) => e !== entry)
    .map(([, pick]) => pick);
  return members(entry).filter((x) => !sctx.value.speciesLanguages.includes(x) && !taken.includes(x));
}

function setSpeciesPick(entry: string, event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    state.value.skills = { ...g.value, species: { ...g.value.species, [entry]: event.target.value } };
  }
}

function setSpecialisation(group: string, event: Event) {
  if (event.target instanceof HTMLSelectElement) {
    state.value.skills = { ...g.value, specialisations: { ...g.value.specialisations, [group]: event.target.value } };
  }
}

function addAdvance(skill: string, delta: number) {
  const advances = { ...g.value.advances, [skill]: (g.value.advances[skill] ?? 0) + delta };
  if (advances[skill] === 0) {
    delete advances[skill];
  }
  state.value.skills = { ...g.value, advances: advances };
}

// A career group's specialisations, by name, without skills the career lists or other groups took.
const careerMembers = (group: string) =>
  careerGroupMembers5e(g.value, sctx.value, group).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

// The rows of the career skills: a group row's skill is its specialisation, null until one is picked.
const careerRows = computed(() =>
  sctx.value.level1Skills.map((id) => ({ id: id, skill: isGroup(id) ? (g.value.specialisations[id] ?? null) : id })),
);

function canAdd(skill: string): boolean {
  return (
    advancesUsed.value < CREATION_CAREER_SKILL_ADVANCES_5E &&
    (g.value.advances[skill] ?? 0) < careerSkillAdvanceLimit5e(speciesPoints.value, skill)
  );
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <h4 class="font-semibold">Species skills</h4>
    <p>Pick {{ speciesTarget }} of your species' skills; each gets one Advance (+5).</p>
    <ul class="flex flex-col gap-1">
      <li v-for="entry in sctx.speciesSkills" :key="entry" class="flex flex-wrap items-center gap-2">
        <label class="flex items-center gap-2">
          <FormCheckbox
            :checked="entry in g.species"
            :disabled="!(entry in g.species) && speciesCount >= speciesTarget"
            @change="toggleSpecies(entry, $event)"
          />
          {{ nameOf(entry) }}
        </label>
        <select
          v-if="isGroup(entry) && entry in g.species"
          class="rounded border border-neutral-300 bg-editable px-1 py-0.5"
          :value="g.species[entry]"
          :aria-label="`${nameOf(entry)} specialisation`"
          @change="setSpeciesPick(entry, $event)"
        >
          <option value="" disabled>Pick a specialisation</option>
          <option v-for="member in speciesMembers(entry)" :key="member" :value="member">{{ nameOf(member) }}</option>
        </select>
      </li>
    </ul>
    <p>Picked: {{ speciesCount }} of {{ speciesTarget }}.</p>
    <p v-if="sctx.speciesLanguages.length > 0">
      Fluent languages (+30): {{ sctx.speciesLanguages.map(nameOf).join(", ") }}.
    </p>
  </section>
  <section class="flex flex-col gap-2">
    <h4 class="font-semibold">Career skills</h4>
    <p>
      Spend {{ CREATION_CAREER_SKILL_ADVANCES_5E }} Advances (+5 each) on your career skills. At creation no skill can
      go above +15, counting the species Advance.
    </p>
    <div class="overflow-x-auto">
      <table class="w-full max-w-xl border-collapse">
        <thead>
          <tr class="border-b border-neutral-400 text-left">
            <th class="py-1 pr-2">Skill</th>
            <th class="py-1 px-2 text-center">Advances</th>
            <th class="py-1 pl-2 text-right">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in careerRows" :key="row.id" class="border-b border-neutral-200">
            <td class="py-1 pr-2">
              <select
                v-if="isGroup(row.id)"
                class="rounded border border-neutral-300 bg-editable px-1 py-0.5"
                :value="row.skill ?? ''"
                :aria-label="`${nameOf(row.id)} specialisation`"
                @change="setSpecialisation(row.id, $event)"
              >
                <option value="" disabled>{{ nameOf(row.id) }}: pick one</option>
                <option v-for="member in careerMembers(row.id)" :key="member" :value="member">
                  {{ nameOf(member) }}
                </option>
              </select>
              <template v-else>{{ nameOf(row.id) }}</template>
            </td>
            <td class="py-1 px-2">
              <span v-if="row.skill !== null" class="flex items-center justify-center gap-1">
                <IconButton
                  icon="lucide:minus"
                  :label="`Remove an Advance from ${nameOf(row.skill)}`"
                  :disabled="(g.advances[row.skill] ?? 0) === 0"
                  @click="addAdvance(row.skill, -1)"
                />
                <span class="w-6 text-center tabular-nums">{{ g.advances[row.skill] ?? 0 }}</span>
                <IconButton
                  icon="lucide:plus"
                  :label="`Add an Advance to ${nameOf(row.skill)}`"
                  :disabled="!canAdd(row.skill)"
                  @click="addAdvance(row.skill, 1)"
                />
              </span>
            </td>
            <td class="py-1 pl-2 text-right tabular-nums">{{ row.skill === null ? "" : value(row.skill) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>
      Advances left: {{ CREATION_CAREER_SKILL_ADVANCES_5E - advancesUsed }} of {{ CREATION_CAREER_SKILL_ADVANCES_5E }}.
    </p>
    <p v-if="careerSkills.length < sctx.level1Skills.length" class="text-sm text-neutral-700">
      Pick a specialisation for each group skill to give it Advances.
    </p>
  </section>
  <GuidedMagicNote5e />
</template>
