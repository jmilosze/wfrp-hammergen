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
  <span :title="tileAndContent.content" class="cursor-pointer inline-block text-lg">
    <slot name="tile">
      <Icon :icon="tileAndContent.tile" class="size-6" />
    </slot>
  </span>
</template>
