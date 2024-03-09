import { computed, Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { WhApi, WhProperty } from "../services/wh/common.ts";
import { SubmissionState } from "../utils/submission.ts";

export function useWhEdit<T extends WhProperty, TApiData>(whInstance: T, elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  const wh = ref(whInstance.copy()) as Ref<T>;
  const whOriginal = ref(whInstance.copy()) as Ref<T>;

  const apiError = ref("");
  const showApiError = ref(true);

  const submissionState = ref(new SubmissionState());
  const showSubmissionStatus = ref(false);

  async function loadWh(id: string): Promise<void> {
    showApiError.value = true;
    try {
      wh.value = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)(id);
      whOriginal.value = wh.value.copy() as T;
    } catch (error) {
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  const hasChanged = computed(() => !wh.value.isEqualTo(whOriginal.value));

  async function submitForm(): Promise<boolean> {
    submissionState.value.setInProgress();

    if (!wh.value.isValid()) {
      submissionState.value.setValidationError();
      return false;
    }

    showSubmissionStatus.value = true;

    try {
      if (wh.value.id === "create") {
        await auth.callAndLogoutIfUnauthorized(elementApi.createElement)(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} created successfully.`);
        return true;
      } else {
        await auth.callAndLogoutIfUnauthorized(elementApi.updateElement)(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} updated successfully.`);
        return true;
      }
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      return false;
    }
  }

  function resetForm() {
    wh.value = whInstance.copy() as T;
    whOriginal.value = whInstance.copy() as T;
  }

  return {
    wh,
    whOriginal,
    apiError,
    showApiError,
    loadWh,
    submitForm,
    hasChanged,
    submissionState,
    resetForm,
    showSubmissionStatus,
  };
}
