import { ref, watch } from "vue";
import { Edition, EDITIONS } from "../services/wh/core/edition.ts";

const LOCAL_STORAGE_KEY_EDITION = "edition";
const DEFAULT_EDITION: Edition = "4e";

function storedEdition(): Edition {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_EDITION);
  return EDITIONS.find((e) => e === stored) ?? DEFAULT_EDITION;
}

// The edition content lists and editors use, shared across the app and remembered in the browser.
const edition = ref<Edition>(storedEdition());

watch(edition, (newEdition) => localStorage.setItem(LOCAL_STORAGE_KEY_EDITION, newEdition));

export function useEdition() {
  return { edition };
}
