<script setup lang="ts">
import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { Icon } from "@iconify/vue";

const LOCAL_STORAGE_KEY_SEEN_ANNOUNCEMENT = "seenAnnouncement";

const props = defineProps<{ text: string }>();

// Holds the text of the last announcement the visitor opened or dismissed.
const seenAnnouncement = useLocalStorage(LOCAL_STORAGE_KEY_SEEN_ANNOUNCEMENT, "");
const show = computed(() => seenAnnouncement.value !== props.text);

function markSeen() {
  seenAnnouncement.value = props.text;
}
</script>

<template>
  <div v-if="show" class="bg-danger-900 text-primary-100 text-sm">
    <div class="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-2">
      <div class="flex-auto flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-center">
        <span class="flex items-center gap-2 font-semibold">
          <Icon icon="lucide:megaphone" class="size-4 shrink-0" />
          {{ text }}
        </span>
        <RouterLink
          :to="{ name: 'about', query: { view: 'updates' } }"
          class="underline underline-offset-2 whitespace-nowrap hover:text-white"
          @click="markSeen"
        >
          Read more
        </RouterLink>
      </div>
      <button type="button" class="p-1 rounded hover:bg-danger-800" aria-label="Dismiss announcement" @click="markSeen">
        <Icon icon="lucide:x" class="size-4" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
