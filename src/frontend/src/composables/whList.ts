import { ContentApi } from "../services/wh/core/api.ts";
import { Edition } from "../services/wh/core/edition.ts";
import { SHORT_DESC_LENGTH } from "../services/wh/core/validators.ts";
import { Visibility, WhProperty } from "../services/wh/core/entity.ts";
import { computed, MaybeRefOrGetter, Ref, ref, toValue, watch, WritableComputedRef } from "vue";
import { source } from "../services/wh/core/source.ts";
import { useAuth } from "./auth.ts";
import { useRouteQuery } from "@vueuse/router";
import { FilterSection } from "../components/filterSection.ts";

// splitQuery views a comma-separated query string value as a list, e.g. the ticked options of a list filter.
function splitQuery(term: Ref<string>): WritableComputedRef<string[]> {
  return computed({
    get: () => (term.value === "" ? [] : term.value.split(",")),
    set: (values) => {
      term.value = values.join(",");
    },
  });
}

// useListQuery is a multi-value list filter kept in the named query string value.
export function useListQuery(name: string): WritableComputedRef<string[]> {
  return splitQuery(useRouteQuery(name, ""));
}

// useFilterModel joins a list page's filters into the value of its FilterSidebar: each key is a section's key.
export function useFilterModel(terms: Record<string, Ref<string[]>>): WritableComputedRef<Record<string, string[]>> {
  return computed({
    get: () => Object.fromEntries(Object.entries(terms).map(([key, term]) => [key, term.value])),
    set: (value) => {
      for (const [key, term] of Object.entries(terms)) {
        term.value = value[key] ?? [];
      }
    },
  });
}

// useSourceFilter is a list's Source filter: the ticked sources, kept in the "source" query string; matches, whether
// an entry has one of them; and the filter section, offering the sources some entry has (Custom first). The ticked
// sources are cleared when the edition changes, as the editions share no sources: a filter from the other edition
// would leave the list empty. collapsed: the section starts folded (it is not the list's only filter).
export function useSourceFilter<T extends WhProperty>(
  whList: Ref<T[]>,
  edition: MaybeRefOrGetter<Edition>,
  collapsed: boolean,
) {
  const sourceQuery = useRouteQuery("source", "");
  watch(
    () => toValue(edition),
    () => {
      sourceQuery.value = "";
    },
  );
  const term = splitQuery(sourceQuery);

  function matches(wh: T): boolean {
    return term.value.length === 0 || term.value.some((x) => x in wh.source);
  }

  const section = computed<FilterSection>(() => {
    const sourcesInData = new Set(whList.value.flatMap((wh) => Object.keys(wh.source)));
    const options = Object.entries(source)
      .filter(([key]) => sourcesInData.has(key))
      .map(([key, text]) => ({ text, value: key }))
      .sort((a, b) => {
        if (a.text === "Custom") return -1;
        if (b.text === "Custom") return 1;
        return a.text.localeCompare(b.text);
      });
    return { key: "source", title: "Source", collapsed, options };
  });

  return { term, matches, section };
}

// LoadState is the load error of a list (or other loaded data): the message, and whether it is still shown.
export type LoadState = { apiError: Ref<string>; showApiError: Ref<boolean> };

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
  };
}
