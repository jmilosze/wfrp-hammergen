import { computed, Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { WhApi, WhProperty } from "../services/wh/common.ts";

export function useWhEditUtils<T extends WhProperty, TApiData>(whInstance: T, elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  const wh = ref(whInstance) as Ref<T>;
  const whOriginal = ref(whInstance) as Ref<T>;

  const apiError = ref("");
  const showApiError = ref(true);

  async function loadWh(id: string): Promise<boolean> {
    showApiError.value = true;
    try {
      wh.value = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)(id);
      whOriginal.value = wh.value.copy() as T;
      return true;
    } catch (error) {
      apiError.value = "Error. Could not pull data from server.";
      return false;
    }
  }

  const hasChanged = computed(() => !wh.value.isEqualTo(whOriginal.value));

  async function submitForm(): Promise<void> {}

  return { wh, whOriginal, apiError, showApiError, loadWh, submitForm, hasChanged };
}
