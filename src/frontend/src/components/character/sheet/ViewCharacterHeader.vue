<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { Icon } from "@iconify/vue";
import { onClickOutside, onKeyStroke } from "@vueuse/core";
import { saveAs } from "file-saver";
import PageHeader from "@/components/ui/PageHeader.vue";
import TextLink from "@/components/ui/TextLink.vue";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS } from "@/components/ui/buttonStyle.ts";
import { CharacterFull } from "@/services/wh/character/characterFull.ts";
import { usePrint } from "@/composables/print.ts";
import { useAuth } from "@/composables/auth.ts";

// The character view's title with Print and Download (CSV or JSON) as icon buttons at the end of the title row, and
// an Edit character link below it, mirroring the editor's View character link. toCsv: the edition's CSV export.
const props = defineProps<{ character: CharacterFull; toCsv: (character: CharacterFull) => string }>();

const auth = useAuth();
const { print, printing } = usePrint();
const canEdit = computed(() => auth.canEdit(props.character.ownerId));

function download(text: string, extension: string) {
  saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), `${props.character.name}.${extension}`);
  menuOpen.value = false;
}

// The Download menu closes on Escape or a click outside it.
const menuOpen = ref(false);
const downloadGroup = useTemplateRef("downloadGroup");
onClickOutside(downloadGroup, () => (menuOpen.value = false));
onKeyStroke("Escape", () => (menuOpen.value = false));

const iconButtonClass = [BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS.neutral, "p-1.5"];
const menuItemClass =
  "block w-full px-3 py-2 text-left text-sm transition-colors duration-100 hover:bg-neutral-200 cursor-pointer";
</script>

<template>
  <PageHeader :title="character.name">
    <template v-if="!printing" #nextToHeader>
      <div class="flex gap-2 ml-auto">
        <button type="button" :class="iconButtonClass" aria-label="Print" title="Print" @click="print()">
          <Icon icon="lucide:printer" class="size-5" />
        </button>
        <div ref="downloadGroup" class="relative">
          <button
            type="button"
            :class="iconButtonClass"
            aria-label="Download"
            title="Download"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <Icon icon="lucide:download" class="size-5" />
          </button>
          <div
            v-if="menuOpen"
            role="menu"
            class="absolute right-0 top-full mt-1 z-10 min-w-max border border-neutral-400 bg-white shadow"
          >
            <button type="button" role="menuitem" :class="menuItemClass" @click="download(toCsv(character), 'csv')">
              Download CSV
            </button>
            <button
              type="button"
              role="menuitem"
              :class="menuItemClass"
              @click="download(JSON.stringify(character, null, 2), 'json')"
            >
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </template>
  </PageHeader>
  <p v-if="canEdit && !printing" class="mt-2">
    <TextLink routeName="character" :params="{ id: character.id }" sameWindow>Edit character</TextLink>
  </p>
</template>
