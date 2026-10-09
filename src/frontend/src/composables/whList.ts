import { ContentApi } from "../services/wh/core/api.ts";
import { Edition } from "../services/wh/core/edition.ts";
import { SHORT_DESC_LENGTH } from "../services/wh/core/validators.ts";
import { Visibility, WhProperty } from "../services/wh/core/entity.ts";
import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue";
import { source } from "../services/wh/core/source.ts";
import { useAuth } from "./auth.ts";
import { useRouteQuery } from "@vueuse/router";

const sourceOptions: { text: string; value: string }[] = [{ text: "Any source", value: "" }];
for (const [key, value] of Object.entries(source)) {
  sourceOptions.push({ text: value, value: key });
}

// useSourceQuery is the list's source filter, kept in the "source" query string. It is cleared when the edition
// changes, as the editions share no sources: a filter from the other edition would leave the list empty.
export function useSourceQuery(edition: MaybeRefOrGetter<Edition>): Ref<string> {
  const sourceTerm = useRouteQuery("source", "");
  watch(
    () => toValue(edition),
    () => {
      sourceTerm.value = "";
    },
  );
  return sourceTerm;
}

// useWhList loads one edition of a content type and reloads when the edition changes.
export function useWhList<T extends WhProperty>(elementApi: ContentApi<T>, edition: MaybeRefOrGetter<Edition>) {
  const auth = useAuth();

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
    filteredSourceOptions,
    sourceValues,
  };
}
