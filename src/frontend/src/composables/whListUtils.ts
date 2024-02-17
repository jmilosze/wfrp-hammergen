import { SHORT_DESC_REGEX, validNameFn, WhApi, WhProperty } from "../services/wh/common.ts";
import { useAuthStore } from "../stores/auth.ts";
import { ref } from "vue";

export function useWhListUtils<T extends WhProperty, TApiData>(elementApi: WhApi<T, TApiData>) {
  const authStore = useAuthStore();

  const loaded = ref(false);
  const errors = ref([] as string[]);
  const whList = ref([] as T[]);

  async function loadWhList(): Promise<void> {
    errors.value = [];
    try {
      whList.value = await authStore.callAndLogoutIfUnauthorized(elementApi.listElements)();
      loaded.value = true;
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  async function copyWh(whId: string): Promise<void> {
    try {
      const whCopy: T = await authStore.callAndLogoutIfUnauthorized(elementApi.getElement)(whId);
      whCopy.name = whCopy.name + " - copy";
      if (!validNameFn(whCopy.name).valid) {
        whCopy.name = whCopy.name.slice(-SHORT_DESC_REGEX);
      }
      const createdId = await authStore.callAndLogoutIfUnauthorized(elementApi.createElement)(whCopy);

      let newListEntry;
      for (let i = 0; i < whList.value.length; i++) {
        if (whList.value[i].id === whId) {
          newListEntry = JSON.parse(JSON.stringify(whList.value[i]));
          break;
        }
      }

      newListEntry.name = whCopy.name;
      newListEntry.id = createdId.id;
      newListEntry.canEdit = true;

      whList.value.push(newListEntry);
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  return { loaded, errors, whList, loadWhList, copyWh };
}
