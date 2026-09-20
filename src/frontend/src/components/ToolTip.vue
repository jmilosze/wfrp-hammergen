<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { Visibility } from "../services/wh/common";
import { useAuth } from "../composables/auth";

const props = defineProps<{
  ownerId?: string;
  visibility?: Visibility;
}>();

const auth = useAuth();
const canEdit = computed(() => auth.canEdit(props.ownerId));

const tileAndContent = computed(() => {
  const vis = props.visibility ?? Visibility.Private;
  return getSharedItemTooltip(canEdit.value, vis);
});

interface TooltipInfo {
  tile: string;
  label: string;
  content: string;
  badgeClass: string;
}

function getSharedItemTooltip(canEdit: boolean, visibility: Visibility): TooltipInfo {
  if (visibility === Visibility.Public) {
    return {
      tile: "material-symbols:globe",
      label: "Public",
      content: "This item is owned by Hammergen",
      badgeClass: "bg-blue-100 text-blue-800 border border-blue-300",
    };
  } else if (visibility === Visibility.Shared) {
    if (canEdit) {
      return {
        tile: "material-symbols:backup",
        label: "Shared",
        content: "This item is shared with linked accounts",
        badgeClass: "bg-green-100 text-green-800 border border-green-300",
      };
    } else {
      return {
        tile: "material-symbols:cloud-download",
        label: "Shared",
        content: "This item is being shared from a linked account",
        badgeClass: "bg-green-100 text-green-800 border border-green-300",
      };
    }
  } else {
    return {
      tile: "material-symbols:lock",
      label: "Private",
      content: "This item is not shared",
      badgeClass: "bg-neutral-100 text-neutral-700 border border-neutral-300",
    };
  }
}
</script>

<template>
  <span
    :title="tileAndContent.content"
    :class="tileAndContent.badgeClass"
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap select-none cursor-default"
  >
    <slot name="tile">
      <Icon :icon="tileAndContent.tile" class="size-4" />
    </slot>
    <span>{{ tileAndContent.label }}</span>
  </span>
</template>
