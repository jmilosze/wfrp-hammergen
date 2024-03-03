import { Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { WhApi, WhProperty } from "../services/wh/common.ts";

export function useWhEditUtils<T extends WhProperty, TApiData>(whInstance: T, elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  const wh = ref(whInstance) as Ref<T>;
  const whOriginal = ref(whInstance) as Ref<T>;

  const apiError = ref("");
  const showApiError = ref(true);

  async function loadWh(id: string): Promise<void> {
    showApiError.value = true;
    try {
      wh.value = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)(id);
      whOriginal.value = wh.value.copy() as T;
    } catch (error) {
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  return { wh, whOriginal, apiError, showApiError, loadWh };
}
