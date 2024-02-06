import { WhApi } from "../services/wh/common.ts";
import { useAuthStore } from "../stores/auth.ts";
import { ref } from "vue";

export function useListWh<T, TApiData>(elementApi: WhApi<T, TApiData>) {
  const authStore = useAuthStore();

  const loaded = ref(false);
  const errors = ref([] as string[]);
  const listOfWh = ref([] as T[]);

  async function loadWhList(): Promise<void> {
    errors.value = [];
    try {
      listOfWh.value = await authStore.callAndLogoutIfUnauthorized(elementApi.listElements)();
      loaded.value = true;
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  return { loaded, errors, listOfWh, loadWhList };
}
