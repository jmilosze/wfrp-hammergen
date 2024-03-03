import { Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { WhApi, WhProperty } from "../services/wh/common.ts";

export function useWhEditUtils<T extends WhProperty, TApiData>(elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  // const wh: Ref<T | null> = ref(null);
  // const whOriginal: Ref<T | null> = ref(null);

  const apiError = ref("");
  const showApiError = ref(true);

  async function loadWh(): Promise<void> {
    showApiError.value = true;
    try {
      wh.value = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)();
      if (wh.value !== null) {
        whOriginal.value = wh.value?.copy() as T;
      }
    } catch (error) {
      console.log(error);
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  return { wh, apiError, showApiError, loadWh };
}
