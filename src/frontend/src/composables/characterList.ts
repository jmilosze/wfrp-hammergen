import { Edition } from "../services/wh/core/edition.ts";
import { SHORT_DESC_LENGTH } from "../services/wh/core/validators.ts";
import { Visibility } from "../services/wh/core/entity.ts";
import { WhApi, CharacterApiResponse } from "../services/wh/core/api.ts";
import { Ref, ref } from "vue";
import { useAuth } from "./auth.ts";
import { Character, CharacterApiData } from "../services/wh/character/character.ts";

// useCharacterList lists the user's characters of one edition (characters are single-edition).
export function useCharacterList(
  characterApi: WhApi<Character, CharacterApiResponse<CharacterApiData>>,
  edition: Ref<Edition>,
) {
  const auth = useAuth();

  const whList: Ref<Character[]> = ref([]);
  const apiError = ref("");
  const showApiError = ref(true);
  const loading = ref(false);

  async function loadWhList(): Promise<void> {
    if (loading.value) {
      return;
    }

    loading.value = true;
    showApiError.value = true;
    try {
      whList.value = await characterApi.listElements(edition.value);
    } catch {
      apiError.value = "Error. Could not pull data from server.";
    }
    loading.value = false;
  }

  async function copyWh(whId: string): Promise<void> {
    showApiError.value = true;
    try {
      const whCopy = await characterApi.getElement(whId, edition.value);
      whCopy.name = whCopy.name + " - copy";
      if (!whCopy.validateName().valid) {
        whCopy.name = whCopy.name.slice(0, SHORT_DESC_LENGTH);
      }

      whCopy.ownerId = auth.getLoggedUserInfo().userId;

      if (!auth.isAdmin.value && whCopy.visibility === Visibility.Public) {
        whCopy.visibility = Visibility.Private;
      }

      const res = await characterApi.createElement(whCopy);

      whCopy.id = res.id;
      if (res.ownerId) {
        whCopy.ownerId = res.ownerId;
      }
      if (res.visibility !== undefined) {
        whCopy.visibility = res.visibility;
      }
      whList.value.push(whCopy);
    } catch {
      apiError.value = "Error. Could not upload data to server.";
    }
  }

  return { whList, apiError, showApiError, loadWhList, loading, copyWh };
}
