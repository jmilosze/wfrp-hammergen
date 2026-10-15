<script setup lang="ts">
import SheetTitle from "./SheetTitle.vue";
import router from "../router.ts";
import { returnToPreviousPage } from "../utils/history.ts";
import { onBeforeRouteLeave } from "vue-router";
import { onBeforeUnmount, ref, watch } from "vue";
import SectionButton from "./SectionButton.vue";
import { Icon } from "@iconify/vue";
import { SubmissionState } from "../utils/submission.ts";

// submissionState / showSubmissionStatus: the result of the last save, shown as a short line in the table.
const props = defineProps<{
  propertyName: string;
  submissionState: SubmissionState;
  showSubmissionStatus: boolean;
  readOnly: boolean;
  confirmExit: boolean;
  allowAddAnother?: boolean;
  saving: boolean;
  list: string;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
}>();

const leaveWithoutConfirmation = ref(false);

onBeforeRouteLeave((_, __, next) => {
  if (props.readOnly || !props.confirmExit || leaveWithoutConfirmation.value) {
    next();
  } else {
    const answer = window.confirm("Changes that you made may not be saved.");
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});

async function leaveAfterSave() {
  leaveWithoutConfirmation.value = true;
  await returnToPreviousPage(router, props.list);
}

async function onSave(addAnother: boolean) {
  menuOpen.value = false;
  if (props.saving) {
    return;
  }
  if (!(await props.submitForm())) {
    return;
  }
  if (addAnother) {
    props.resetForm();
  } else {
    await leaveAfterSave();
  }
}

// The menu of the split Save button ("Save and add another") closes on Escape or a click outside it.
const menuOpen = ref(false);
const saveGroup = ref<HTMLElement | null>(null);

function onDocumentClick(event: MouseEvent) {
  if (saveGroup.value && event.target instanceof Node && !saveGroup.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    menuOpen.value = false;
  }
}

watch(menuOpen, (open) => {
  if (open) {
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKeydown);
  } else {
    document.removeEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKeydown);
  }
});

// A success message disappears after a few seconds; an error stays until the next save.
const STATUS_TIMEOUT_MS = 5000;
const statusExpired = ref(false);
let statusTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => [props.showSubmissionStatus, props.submissionState.status, props.submissionState.message],
  () => {
    clearTimeout(statusTimer);
    statusExpired.value = false;
    if (props.submissionState.status === "success") {
      statusTimer = setTimeout(() => (statusExpired.value = true), STATUS_TIMEOUT_MS);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
  document.removeEventListener("keydown", onKeydown);
  clearTimeout(statusTimer);
});
</script>

<template>
  <div class="flex flex-col border border-neutral-400 bg-white text-left">
    <SheetTitle class="border-b border-neutral-300">
      {{ readOnly ? propertyName : `Save ${propertyName.toLowerCase()}` }}
    </SheetTitle>
    <div class="flex flex-wrap grow items-center justify-end gap-2 px-2 py-1.5">
      <p
        v-if="showSubmissionStatus && submissionState.message !== '' && !statusExpired"
        role="status"
        class="mr-auto flex items-center gap-1 text-sm"
        :class="submissionState.status === 'success' ? 'text-success' : 'text-error'"
      >
        <Icon
          :icon="submissionState.status === 'success' ? 'lucide:circle-check' : 'lucide:circle-alert'"
          class="size-4 shrink-0"
        />
        {{ submissionState.message }}
      </p>
      <SectionButton icon="lucide:arrow-left" variant="neutral" @click="router.go(-1)">Back</SectionButton>
      <div v-if="!readOnly" ref="saveGroup" class="relative flex">
        <SectionButton
          icon="lucide:save"
          variant="light"
          :busy="saving"
          :class="{ 'rounded-r-none': allowAddAnother }"
          @click="onSave(false)"
        >
          Save
        </SectionButton>
        <template v-if="allowAddAnother">
          <button
            type="button"
            aria-label="More save options"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            :disabled="saving"
            class="px-1 rounded-r border border-l-brand/20 border-parchment-dark bg-parchment text-brand-dark transition-colors duration-150 hover:bg-parchment-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            @click="menuOpen = !menuOpen"
          >
            <Icon icon="lucide:chevron-down" class="size-4" />
          </button>
          <div
            v-if="menuOpen"
            role="menu"
            class="absolute right-0 bottom-full mb-1 z-10 min-w-max border border-neutral-400 bg-white shadow"
          >
            <button
              type="button"
              role="menuitem"
              class="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-200 cursor-pointer"
              @click="onSave(true)"
            >
              Save and add another
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
