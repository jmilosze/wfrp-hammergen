import { ref, shallowRef } from "vue";
import { GenerationProps, GenerationProps5e, getGenerationProps, getGenerationProps5e } from "../services/wh/character/generation/shared/generationProps.ts";
import { AxiosInstance } from "axios";

function useLoadedGenerationProps<T>(initial: T, load: () => Promise<T>) {
  const generationProps = shallowRef<T>(initial);

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
      generationProps.value = await load();
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

export function useGenerationProps(axiosInstance: AxiosInstance) {
  return useLoadedGenerationProps<GenerationProps>(
    { classItems: [], randomTalents: [], speciesTalents: {}, speciesSkills: {} },
    () => getGenerationProps(axiosInstance),
  );
}

export function useGenerationProps5e(axiosInstance: AxiosInstance) {
  return useLoadedGenerationProps<GenerationProps5e>(
    { classItems: [], randomTalents: [], speciesTalents: {}, speciesSkills: {}, speciesLanguages: {} },
    () => getGenerationProps5e(axiosInstance),
  );
}
