<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { Visibility } from "../services/wh/common";
import { addSpaces } from "../utils/string";
import { useAuth } from "../composables/auth";

const props = defineProps<{
  ownerId?: string;
  visibility?: Visibility;
  canEdit?: boolean;
}>();

const auth = useAuth();
const canEdit = computed(() => {
  if (props.canEdit !== undefined) {
    return props.canEdit;
  }
  return auth.canEdit(props.ownerId);
});

const tileAndContent = computed(() => {
  const vis = props.visibility ?? Visibility.Private;
  return getSharedItemTooltip(canEdit.value, vis);
});

function getSharedItemTooltip(canEdit: boolean, visibility: Visibility): { tile: string; content: string } {
  let sharedTile;
  let sharedTooltip;

  if (visibility === Visibility.Public) {
    sharedTile = "material-symbols:globe";
    sharedTooltip = "This item is owned by Hammergen";
  } else if (visibility === Visibility.Shared) {
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
