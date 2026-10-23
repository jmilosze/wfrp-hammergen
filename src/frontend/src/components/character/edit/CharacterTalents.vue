<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { Talent } from "@/services/wh/content/talent.ts";
import { computed, ref } from "vue";
import { Attributes } from "@/services/wh/core/attributes.ts";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import ChecklistPicker from "@/components/picker/ChecklistPicker.vue";
import AppButton from "@/components/ui/AppButton.vue";
import SheetCard from "@/components/sheet/SheetCard.vue";
import { ValidationStatus } from "@/utils/validation.ts";
import { truncate } from "@/utils/string.ts";
import TextLink from "@/components/ui/TextLink.vue";
import Edition4eBadge from "@/components/edition/Edition4eBadge.vue";
import MarksHelp from "./MarksHelp.vue";
import { Edition } from "@/services/wh/core/edition.ts";
import { Marks, printMarks } from "@/services/wh/character/marks.ts";

const DESC_CHARS = 100;

const props = defineProps<{
  disabled?: boolean;
  talentList: Talent[];
  // The character's talents: id to rank, read directly (the parent changes them on the emitted events).
  talents: Record<string, number>;
  loading?: boolean;
  attributes: Attributes;
  validationStatus: ValidationStatus;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
  // What the character's career, species or class give, marked in the popup.
  marks: Marks;
  // The character's edition, for the popup's help on the marks.
  edition: Edition;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "addSpeciesTalents"): void;
}>();

function rankOf(id: string): number {
  return props.talents[id] ?? 0;
}

// The talents that can be taken (not groups), by name.
const takeableTalents = computed(() =>
  props.talentList.filter((x) => !x.isGroup).sort((a, b) => a.name.localeCompare(b.name)),
);

const selectedTalents = computed(() =>
  takeableTalents.value
    .filter((x) => rankOf(x.id) !== 0)
    .map((x) => ({ id: x.id, name: x.name, number: rankOf(x.id) })),
);

const modalOpen = ref(false);

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}

// Popup rows are made once per list; each reads its live values through getters (the max rank follows the
// characteristics), so a change redraws only its own row.
const modalItems = computed(() =>
  takeableTalents.value.map((x) => {
    const maxRankFormula = x.getMaxRankDisplay();
    return {
      id: x.id,
      name: x.name,
      description: truncate(x.description, DESC_CHARS),
      get selected() {
        return rankOf(x.id) !== 0;
      },
      get number() {
        return rankOf(x.id);
      },
      get note() {
        const maxRank = x.getMaxRank(props.attributes);
        const maxRankNote = `Max rank ${maxRank}` + (maxRankFormula.includes("Bonus") ? ` (${maxRankFormula})` : "");
        return [maxRankNote, ...printMarks(props.marks, x.id)].join(" · ");
      },
    };
  }),
);
</script>

<template>
  <div>
    <SheetCard title="Talents" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</AppButton>
        <AppButton icon="lucide:plus" variant="neutral" :disabled="props.loading" @click="emit('addSpeciesTalents')">
          Add species talents
        </AppButton>
      </template>
      <table class="w-full">
        <thead>
          <tr class="text-left" :class="{ 'bg-editable': !disabled }">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th v-if="!disabled" class="border-b border-neutral-300 py-2 px-2 w-0" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="src in selectedTalents"
            :key="src.id"
            class="bg-white transition-colors duration-100 hover:bg-neutral-100"
          >
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink routeName="talent" :params="{ id: src.id }">
                {{ src.name }}
              </TextLink>
              <span v-if="src.number > 1" class="ml-1">x{{ src.number }}</span>
              <Edition4eBadge v-if="fourEIds?.has(src.id)" />
            </td>
            <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
              <IconButton
                icon="lucide:x"
                :label="`Remove ${src.name}`"
                @click="emit('updated', { id: src.id, number: 0 })"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </SheetCard>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header>
        <span class="flex items-center gap-2">Edit talents <MarksHelp kind="talents" :edition="edition" /></span>
      </template>
      <ChecklistPicker
        :items="modalItems"
        routeName="talent"
        :loading="props.loading"
        :fourEIds="fourEIds"
        :marks="marks"
        numberLabel="Rank"
        @setNumber="(e) => emit('updated', e)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>
