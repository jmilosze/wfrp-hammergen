import { ContentApi } from "@/services/wh/core/api.ts";
import { Edition } from "@/services/wh/core/edition.ts";
import { SHORT_DESC_LENGTH } from "@/services/wh/core/validators.ts";
import { Visibility, WhProperty } from "@/services/wh/core/entity.ts";
import { MaybeRefOrGetter, Ref, ref, toValue, watch } from "vue";
import { useAuth } from "./auth.ts";

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
