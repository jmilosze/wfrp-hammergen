import { computed, ref } from "vue";
import { useAuth } from "./auth.ts";
import { ApiHeaders, WhApi } from "../services/wh/core/api.ts";
import { Edition } from "../services/wh/core/edition.ts";
import { Visibility, WhProperty } from "../services/wh/core/entity.ts";
import { SubmissionState } from "../utils/submission.ts";
import { copySource } from "../services/wh/core/source.ts";

// useCharacterEdit edits a single-edition entity (a character of the given edition): the loaded one, or a new one
// started from whInstance when nothing is loaded.
export function useCharacterEdit<T extends WhProperty, TResponse extends ApiHeaders>(
  whInstance: T,
  loaded: T | undefined,
  elementApi: WhApi<T, TResponse>,
  edition: Edition,
) {
  const auth = useAuth();

  if (auth.isAdmin.value && whInstance.id === "create") {
    whInstance.visibility = Visibility.Public;
  }

  const wh = ref((loaded ?? whInstance).copy());
  const whOriginal = ref(wh.value.copy());
  const initSources = ref(copySource(wh.value.source));

  const submissionState = ref(new SubmissionState());
  const showSubmissionStatus = ref(false);

  const hasChanged = computed(() => !wh.value.isEqualTo(whOriginal.value));

  const canEdit = computed(() => wh.value.id === "create" || auth.canEdit(wh.value.ownerId));

  async function submitForm(): Promise<boolean> {
    submissionState.value.setInProgress();

    if (!wh.value.isValid(edition)) {
      submissionState.value.setValidationError();
      return false;
    }

    showSubmissionStatus.value = true;

    try {
      if (wh.value.id === "create") {
        await elementApi.createElement(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} created successfully.`);
        return true;
      } else {
        await elementApi.updateElement(wh.value);
        submissionState.value.setSuccess(`${wh.value.name} updated successfully.`);
        return true;
      }
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      return false;
    }
  }

  async function deleteItem(): Promise<boolean> {
    if (wh.value.id === "create") {
      return false;
    }

    submissionState.value.setInProgress();
    try {
      await elementApi.deleteElement(wh.value.id, edition);
      whOriginal.value = wh.value.copy() as T;
      return true;
    } catch (error) {
      submissionState.value.setFailureFromError(error);
      showSubmissionStatus.value = true;
      return false;
    }
  }

  function resetForm() {
    wh.value = whInstance.copy() as T;
    whOriginal.value = whInstance.copy() as T;
    initSources.value = copySource(wh.value.source);
  }

  return {
    wh,
    canEdit,
    whOriginal,
    initSources,
    submitForm,
    deleteItem,
    hasChanged,
    submissionState,
    resetForm,
    showSubmissionStatus,
  };
}
