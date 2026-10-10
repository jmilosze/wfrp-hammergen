import { computed, MaybeRefOrGetter, toValue, watch } from "vue";
import { ContentApi } from "../services/wh/core/api.ts";
import { WhProperty } from "../services/wh/core/entity.ts";
import { useWhList } from "./whList.ts";

// useWith4eContentList loads the 5e list of a content type and, while allow4e is on, also the 4e list. withAllowed
// is the 5e list plus the 4e content that has no 5e version; fourEIds are the ids of that 4e content.
// list5e alone is used where 4e content must not count (talent, trait and mutation modifiers).
export function useWith4eContentList<T extends WhProperty>(elementApi: ContentApi<T>, allow4e: MaybeRefOrGetter<boolean>) {
  const list5e = useWhList(elementApi, "5e");
  const list4e = useWhList(elementApi, "4e");

  list5e.loadWhList();
  watch(
    () => toValue(allow4e),
    (newVal) => {
      if (newVal && list4e.whList.value.length === 0) {
        list4e.loadWhList();
      }
    },
    { immediate: true },
  );

  const fourEOnly = computed(() => {
    if (!toValue(allow4e)) {
      return [];
    }
    const ids5e = new Set(list5e.whList.value.map((x) => x.id));
    return list4e.whList.value.filter((x) => !ids5e.has(x.id));
  });

  const withAllowed = computed(() => [...list5e.whList.value, ...fourEOnly.value]);
  const fourEIds = computed(() => (toValue(allow4e) ? new Set(fourEOnly.value.map((x) => x.id)) : undefined));
  const loading = computed(() => list5e.loading.value || list4e.loading.value);

  async function reload(): Promise<void> {
    await Promise.all([list5e.loadWhList(), toValue(allow4e) ? list4e.loadWhList() : Promise.resolve()]);
  }

  return { list5e, list4e, withAllowed, fourEIds, fourEOnly, loading, reload };
}
