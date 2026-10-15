<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SheetTable from "./SheetTable.vue";
import SheetCell from "./SheetCell.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Career, printClassName } from "../services/wh/content/career.ts";
import { IdNumber } from "../utils/idNumber.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

// A career level that can be picked; id is the career's id and the level.
type CareerLevelRow = {
  id: string;
  careerId: string;
  name: string;
  careerClass: string;
  level: number;
  levelName: string;
};

const props = defineProps<{
  disabled?: boolean;
  careerList: Career[];
  // The character's current and past careers, read directly (the parent changes them on the emitted events).
  currentCareer: IdNumber | undefined;
  pastCareers: IdNumber[];
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "pastSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "currentSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "reload"): void;
}>();

// Every level of every career, by career name then level.
const levelRows = computed(() =>
  [...props.careerList]
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((career) =>
      ([1, 2, 3, 4, 5] as const)
        .filter((i) => career.getLevel(i).exists)
        .map((i) => ({
          id: `${career.id}_${i}`,
          careerId: career.id,
          name: career.name,
          careerClass: printClassName(career.careerClass),
          level: i,
          levelName: career.getLevel(i).name,
        })),
    ),
);

function isCurrent(row: CareerLevelRow): boolean {
  return props.currentCareer?.id === row.careerId && props.currentCareer.number === row.level;
}

function isPast(row: CareerLevelRow): boolean {
  return props.pastCareers.some((x) => x.id === row.careerId && x.number === row.level);
}

const selectedCurrentCareer = computed(() => levelRows.value.find((x) => isCurrent(x)));
const selectedPastCareers = computed(() => levelRows.value.filter((x) => isPast(x)));

const modalOpen = ref(false);

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}

// One row per career level, with Current and Past ticks; a level can't be both.
// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  levelRows.value.map((x) => ({
    id: x.id,
    linkId: x.careerId,
    name: x.name,
    description: "",
    note: `Level ${x.level}: ${x.levelName} · ${x.careerClass}`,
    get selected() {
      return isCurrent(x) || isPast(x);
    },
    get choices() {
      return [
        { key: "current", label: "Current", checked: isCurrent(x), disabled: isPast(x) },
        { key: "past", label: "Past", checked: isPast(x), disabled: isCurrent(x) },
      ];
    },
  })),
);

// Ticking Current replaces the current career; unticking it leaves none.
function onChoose(id: string, key: string) {
  const row = levelRows.value.find((x) => x.id === id);
  if (row === undefined) {
    return;
  }
  const value = { id: row.careerId, number: row.level };
  if (key === "current") {
    emit("currentSelected", { ...value, selected: !isCurrent(row) });
  } else {
    emit("pastSelected", { ...value, selected: !isPast(row) });
  }
}
</script>

<template>
  <div>
    <SheetTable>
      <div v-if="props.loading" class="flex justify-center bg-white">
        <SpinnerAnimation class="w-14 m-2" />
      </div>
      <template v-else>
        <SheetCell title="Current" :editable="!disabled">
          <div v-if="selectedCurrentCareer">
            <TextLink routeName="career" :params="{ id: selectedCurrentCareer.careerId }">
              {{ selectedCurrentCareer.name }} {{ selectedCurrentCareer.level }}
            </TextLink>
            <Edition4eBadge v-if="fourEIds?.has(selectedCurrentCareer.careerId)" />
          </div>
        </SheetCell>
        <SheetCell title="Past" :editable="!disabled">
          <!-- One line, comma separated, wrapping only when it runs out of room. -->
          <div>
            <span v-for="(pastCareer, i) in selectedPastCareers" :key="pastCareer.id">
              <TextLink routeName="career" :params="{ id: pastCareer.careerId }">
                {{ pastCareer.name }} {{ pastCareer.level }}
              </TextLink>
              <Edition4eBadge v-if="fourEIds?.has(pastCareer.careerId)" />
              <template v-if="i < selectedPastCareers.length - 1">, </template>
            </span>
          </div>
        </SheetCell>
      </template>
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" iconOnlyWhenNarrow :disabled="props.loading" @click="onEditClick">
          Edit
        </SectionButton>
      </template>
    </SheetTable>
    <ModalWindow v-model:open="modalOpen" size="md" fullHeight>
      <template #header> Edit career </template>
      <ChecklistPicker
        :items="modalItems"
        routeName="career"
        :loading="props.loading"
        :fourEIds="fourEIds"
        @choose="(e) => onChoose(e.id, e.key)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
