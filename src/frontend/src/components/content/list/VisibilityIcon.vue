<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { Visibility } from "@/services/wh/core/entity.ts";
import { useAuth } from "@/composables/auth";
import { VISIBILITY_KINDS, visibilityKind } from "./visibilityKind.ts";
import InfoTip from "@/components/ui/InfoTip.vue";

// An entry's visibility (public, mine, shared by me, shared with me) as a coloured icon, sized to the surrounding text
// (e.g. after an entry's type); tapping or hovering it shows what it means.
const props = defineProps<{
  ownerId?: string;
  visibility?: Visibility;
}>();

const auth = useAuth();
const canEdit = computed(() => auth.canEdit(props.ownerId));

const kind = computed(() => VISIBILITY_KINDS[visibilityKind(canEdit.value, props.visibility ?? Visibility.Private)]);
</script>

<template>
  <InfoTip :label="kind.label" :text="`${kind.label}: ${kind.description}`">
    <Icon :icon="kind.icon" :class="kind.iconClass" class="size-[1em]" />
  </InfoTip>
</template>
