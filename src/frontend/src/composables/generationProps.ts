import { ref } from "vue";
import { GenerationProps, getGenerationProps } from "../services/wh/generationProps.ts";
import { AxiosInstance } from "axios";

export function useGenerationProps(axiosInstance: AxiosInstance) {
  const generationProps = ref<GenerationProps>({
    classItems: [],
    randomTalents: [],
    speciesTalents: {},
    speciesSkills: {},
  });

  const apiError = ref("");
  const showApiError = ref(true);
  const loading = ref(false);

  async function loadGenerationProps(): Promise<void> {
    if (loading.value) {
      return;
    }

    loading.value = true;
    showApiError.value = true;
    try {
      generationProps.value = await getGenerationProps(axiosInstance);
    } catch {
      apiError.value = "Error. Could not pull data from server.";
    } finally {
      loading.value = false;
    }
  }

  return {
    generationProps,
    apiError,
    showApiError,
    loadGenerationProps,
    loading,
  };
}
