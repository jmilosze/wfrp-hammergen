import { ref } from "vue";
import { useAuth } from "./auth.ts";
import { RandomTalents } from "../services/wh/characterGeneration/generateSpeciesTalents.ts";
import { getGenerationProps } from "../services/wh/generationProps.ts";
import { AxiosInstance } from "axios";

export function useGenerationProps(axiosInstance: AxiosInstance) {
  const auth = useAuth();

  const generationProps = ref({
    classItems: [] as { equipped: Record<string, string>; carried: Record<string, string> }[],
    randomTalents: [] as RandomTalents,
    speciesTalents: {} as Record<string, string[]>,
    speciesSkills: {} as Record<string, string[]>,
  });

  const apiError = ref("");
  const showApiError = ref(true);

  async function loadGenerationProps(): Promise<void> {
    showApiError.value = true;
    try {
      generationProps.value = await auth.callAndLogoutIfUnauthorized(getGenerationProps)(axiosInstance);
    } catch {
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  return {
    generationProps,
    apiError,
    showApiError,
    loadGenerationProps,
  };
}
