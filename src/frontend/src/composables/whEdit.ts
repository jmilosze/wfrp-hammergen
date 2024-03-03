import { Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { WhApi, WhProperty } from "../services/wh/common.ts";

export function useWhEditUtils<T extends WhProperty, TApiData>(makeZero: () => T, elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  const wh: Ref<WhProperty> = ref(makeZero());
  const whOriginal: Ref<WhProperty> = ref(makeZero());

  const apiError = ref("");
  const showApiError = ref(true);

  async function loadWh(): Promise<void> {
    showApiError.value = true;
    try {
      wh.value = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)();
      whOriginal.value = wh.value.copy();
    } catch (error) {
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  return { wh, apiError, showApiError, loadWh };
}
