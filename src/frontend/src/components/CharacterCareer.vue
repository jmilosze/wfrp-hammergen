<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import { useModal } from "../composables/modal.ts";
import SheetTable from "./SheetTable.vue";
import SheetCell from "./SheetCell.vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { Career, printClassName } from "../services/wh/content/career.ts";
import { IdNumber } from "../utils/idNumber.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

type CareerWithSelect = {
  id: string;
  careerId: string;
  name: string;
  description: string;
  careerClass: string;
  level: number;
  levelName: string;
  current: boolean;
  past: boolean;
};

function anySelected(careerWithSelect: CareerWithSelect): boolean {
  return careerWithSelect.current || careerWithSelect.past;
}

const props = defineProps<{
  disabled?: boolean;
  careerList: Career[];
  initSelectedCurrentCareer: IdNumber | undefined;
  initSelectedPastCareers: IdNumber[];
  loading?: boolean;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "pastSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "currentSelected", value: { id: string; number: number; selected: boolean }): void;
  (e: "reload"): void;
}>();

const careersWithSelect: Ref<Record<string, CareerWithSelect>> = ref({});
const careersWithSelectList: Ref<CareerWithSelect[]> = ref([]);
let currentId = "";

// A new current career only updates the ticks, so rows don't move while the modal is open (selected careers go to
// the top when it is opened again).
watch(
  () => props.initSelectedCurrentCareer,
  (newVal) => {
    markCurrentCareer(newVal);
  },
);

watch(
  () => props.initSelectedPastCareers,
  (newVal) => {
    updateCareersWithSelect(props.initSelectedCurrentCareer, newVal, props.careerList);
  },
  { immediate: true },
);

watch(
  () => props.careerList,
  (newVal) => {
    updateCareersWithSelect(props.initSelectedCurrentCareer, props.initSelectedPastCareers, newVal);
  },
  { immediate: true },
);

function markCurrentCareer(selectedCurrentCareer: IdNumber | undefined) {
  currentId = "";
  for (const careerWithSelect of Object.values(careersWithSelect.value)) {
    careerWithSelect.current =
      selectedCurrentCareer !== undefined &&
      careerWithSelect.careerId === selectedCurrentCareer.id &&
      careerWithSelect.level === selectedCurrentCareer.number;
    if (careerWithSelect.current) {
      currentId = careerWithSelect.id;
    }
  }
}

function updateCareersWithSelect(
  selectedCurrentCareer: IdNumber | undefined,
  selectedPastCareers: IdNumber[],
  careerList: Career[],
) {
  careersWithSelect.value = {};
  currentId = "";
  for (const career of careerList) {
    for (const i of [1, 2, 3, 4, 5]) {
      const lvl = career.getLevel(i as 1 | 2 | 3 | 4 | 5);
      if (lvl.exists) {
        careersWithSelect.value[career.id + "_" + i] = {
          id: career.id + "_" + i,
          careerId: career.id,
          name: career.name,
          description: career.description,
          careerClass: printClassName(career.careerClass),
          level: i,
          levelName: lvl.name,
          current: false,
          past: false,
        };

        if (selectedCurrentCareer && selectedCurrentCareer.id === career.id && selectedCurrentCareer.number === i) {
          currentId = career.id + "_" + i;
          careersWithSelect.value[career.id + "_" + i].current = true;
        }
        if (selectedPastCareers) {
          for (const pastCareer of selectedPastCareers) {
            if (pastCareer.id === career.id && pastCareer.number === i) {
              careersWithSelect.value[career.id + "_" + i].past = true;
            }
          }
        }
      }
    }
  }
  careersWithSelectList.value = Object.values(careersWithSelect.value).sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
}

const selectedPastCareers = computed(() => careersWithSelectList.value.filter((x) => x.past));
const selectedCurrentCareer = computed(() => careersWithSelectList.value.find((x) => x.current));

const modal = useModal();
const openedCounter = ref(0);

function onEditClick() {
  if (props.loading) {
    return;
  }
  careersWithSelectList.value.sort((a, b) => {
    return anySelected(a) === anySelected(b) ? a.name.localeCompare(b.name) : anySelected(a) ? -1 : 1;
  });
  openedCounter.value += 1;
  modal.showModal("modifyCareersModal");
}

// One row per career level, with Current and Past ticks; a level can't be both.
// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  careersWithSelectList.value.map((x) => ({
    id: x.id,
    linkId: x.careerId,
    name: x.name,
    description: "",
    note: `Level ${x.level}: ${x.levelName} · ${x.careerClass}`,
    get selected() {
      return anySelected(x);
    },
    get choices() {
      return [
        { key: "current", label: "Current", checked: x.current, disabled: x.past },
        { key: "past", label: "Past", checked: x.past, disabled: x.current },
      ];
    },
  })),
);

function onChoose(id: string, key: string) {
  if (key === "current") {
    selectNewCurrent(id);
  } else {
    emitPastSelected(id);
    careersWithSelect.value[id].past = !careersWithSelect.value[id].past;
  }
}

function selectNewCurrent(id: string) {
  if (id === currentId) {
    careersWithSelect.value[currentId].current = false;
    emitCurrentSelected(currentId);
    currentId = "";
    return;
  }

  if (currentId in careersWithSelect.value) {
    careersWithSelect.value[currentId].current = false;
    emitCurrentSelected(currentId);
  }
  currentId = id;
  careersWithSelect.value[currentId].current = true;
  emitCurrentSelected(currentId);
}

function emitCurrentSelected(id: string) {
  emit("currentSelected", {
    id: careersWithSelect.value[id].careerId,
    number: careersWithSelect.value[id].level,
    selected: careersWithSelect.value[id].current,
  });
}

function emitPastSelected(id: string) {
  emit("pastSelected", {
    id: careersWithSelect.value[id].careerId,
    number: careersWithSelect.value[id].level,
    selected: !careersWithSelect.value[id].past,
  });
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
    <ModalWindow id="modifyCareersModal" size="md" fullHeight>
      <template #header> Edit career </template>
      <ChecklistPicker
        :items="modalItems"
        routeName="career"
        :opened="openedCounter"
        :loading="props.loading"
        :fourEIds="fourEIds"
        @choose="(e) => onChoose(e.id, e.key)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
