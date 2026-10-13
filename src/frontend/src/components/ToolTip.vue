<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { Visibility } from "../services/wh/core/entity.ts";
import { useAuth } from "../composables/auth";
import { VISIBILITY_KINDS, visibilityKind } from "./visibilityKind.ts";
import InfoTip from "./InfoTip.vue";

const props = defineProps<{
  ownerId?: string;
  visibility?: Visibility;
  // iconOnly: just the coloured icon, sized to the surrounding text (e.g. after an entry's type); tapping or hovering it
  // shows what it means.
  iconOnly?: boolean;
}>();

const auth = useAuth();
const canEdit = computed(() => auth.canEdit(props.ownerId));

const kind = computed(() => VISIBILITY_KINDS[visibilityKind(canEdit.value, props.visibility ?? Visibility.Private)]);
</script>

<template>
  <InfoTip v-if="iconOnly" :label="kind.label" :text="`${kind.label}: ${kind.description}`">
    <Icon :icon="kind.icon" :class="kind.iconClass" class="size-[1em]" />
  </InfoTip>
  <span
    v-else
    :title="kind.description"
    :class="kind.badgeClass"
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap select-none cursor-default"
  >
    <slot name="tile">
      <Icon :icon="kind.icon" class="size-4" />
    </slot>
    <!-- Only the icon on small screens; the label stays for screen readers and the tooltip explains it. -->
    <span class="sr-only @md:not-sr-only">{{ kind.label }}</span>
  </span>
</template>
