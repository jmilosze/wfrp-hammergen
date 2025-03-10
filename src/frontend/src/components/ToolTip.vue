<script setup lang="ts">
import { addSpaces } from "../utils/string";
import { computed } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps<{ shared: boolean; canEdit: boolean; ownerId: string }>();

const tileAndContent = computed(() => getSharedItemTooltip(props.shared, props.canEdit, props.ownerId));

function getSharedItemTooltip(shared: boolean, canEdit: boolean, ownerId: string): { tile: string; content: string } {
  let sharedTile;
  let sharedTooltip;

  if (shared) {
    if (canEdit) {
      sharedTile = "material-symbols:backup";
      sharedTooltip = "This item is shared with linked accounts";
    } else {
      sharedTile = "material-symbols:cloud-download";
      sharedTooltip = "This item is being shared from a linked account";
    }
  } else {
    sharedTile = "material-symbols:lock";
    sharedTooltip = "This item is not shared";
  }

  if (ownerId == "admin") {
    sharedTile = "material-symbols:globe";
    sharedTooltip = "This item is owned by Hammergen";
  }
  return { tile: sharedTile, content: sharedTooltip };
}
</script>

<template>
  <div class="relative group inline-block">
    <span class="cursor-pointer focus:outline-none text-lg" tabindex="0">
      <slot name="tile">
        <Icon :icon="tileAndContent.tile" class="size-6" />
      </slot>
    </span>
    <div
      class="absolute left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-sm rounded px-2 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-200 min-w-[1px] max-w-[25vw] md:max-w-[10vw] w-max z-10"
    >
      <slot name="content">
        {{ addSpaces(tileAndContent.content) }}
      </slot>
    </div>
  </div>
</template>
