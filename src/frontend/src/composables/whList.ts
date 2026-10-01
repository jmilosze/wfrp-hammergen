import { ContentApi, Edition, SHORT_DESC_LENGTH, Visibility, WhProperty } from "../services/wh/common.ts";
import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue";
import { source } from "../services/wh/source.ts";
import { useAuth } from "./auth.ts";

const sourceOptions: { text: string; value: string }[] = [{ text: "Any source", value: "" }];
for (const [key, value] of Object.entries(source)) {
  sourceOptions.push({ text: value, value: key });
}

// useWhList loads one edition of a content type and reloads when the edition changes.
export function useWhList<T extends WhProperty>(elementApi: ContentApi<T>, edition: MaybeRefOrGetter<Edition>) {
  const auth = useAuth();

  const whToDelete = ref({ id: "", name: "" });
  const whList: Ref<T[]> = ref([]);
  const apiError = ref("");
  const showApiError = ref(true);
  const loading = ref(false);

  async function loadWhList(): Promise<void> {
    if (loading.value) {
      return;
    }

    loading.value = true;
    showApiError.value = true;
    try {
      whList.value = await elementApi.listElements(toValue(edition));
    } catch {
      apiError.value = "Error. Could not pull data from server.";
    }
    loading.value = false;
  }

  // copyWh copies the whole document (all variants) and adds the listed edition's copy to the list.
  async function copyWh(whId: string): Promise<void> {
    showApiError.value = true;
    try {
      const variants = await elementApi.getDocument(whId);
      const copies = Object.values(variants);
      for (const whCopy of copies) {
        whCopy.name = whCopy.name + " - copy";
        if (!whCopy.validateName().valid) {
          whCopy.name = whCopy.name.slice(0, SHORT_DESC_LENGTH);
        }
        whCopy.ownerId = auth.getLoggedUserInfo().userId;
        if (!auth.isAdmin.value && whCopy.visibility === Visibility.Public) {
          whCopy.visibility = Visibility.Private;
        }
      }

      const listed = variants[toValue(edition)];
      if (listed === undefined) {
        return;
      }
      const res = await elementApi.createDocument(listed.visibility, variants);

      listed.id = res.id;
      if (res.ownerId) {
        listed.ownerId = res.ownerId;
      }
      if (res.visibility !== undefined) {
        listed.visibility = res.visibility;
      }
      whList.value.push(listed);
    } catch {
      apiError.value = "Error. Could not upload data to server.";
    }
  }

  async function deleteWh() {
    showApiError.value = true;
    try {
      await elementApi.deleteElement(whToDelete.value.id);
      for (let i = 0; i < whList.value.length; i++) {
        if (whList.value[i]["id"] === whToDelete.value.id) {
          whList.value.splice(i, 1);
          break;
        }
      }
    } catch {
      apiError.value = "Error. Could not delete data from server.";
    }
  }

  const filteredSourceOptions = computed(() => {
    const sourcesInData: Set<string> = new Set();
    for (const wh of whList.value) {
      for (const source of Object.keys(wh.source)) {
        sourcesInData.add(source);
      }
    }
    return sourceOptions
      .filter((x) => sourcesInData.has(x.value) || x.value === "")
      .sort((a, b) => {
        if (a.text === "Any source") return -1;
        if (b.text === "Any source") return 1;
        if (a.text === "Custom") return -1;
        if (b.text === "Custom") return 1;
        return a.text.localeCompare(b.text);
      });
  });

  const sourceValues = sourceOptions.map((x) => x.value);

  watch(
    () => toValue(edition),
    () => loadWhList(),
  );

  return {
    whList,
    apiError,
    showApiError,
    loadWhList,
    loading,
    copyWh,
    deleteWh,
    filteredSourceOptions,
    whToDelete,
    sourceValues,
  };
}
