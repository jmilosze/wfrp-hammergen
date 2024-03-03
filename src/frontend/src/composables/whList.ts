import { ApiResponse, SHORT_DESC_REGEX, WhApi, WhProperty } from "../services/wh/common.ts";
import { computed, Ref, ref } from "vue";
import { source } from "../services/wh/source.ts";
import { useAuth } from "./auth.ts";

const sourceOptions: { text: string; value: string }[] = [{ text: "Any source", value: "" }];
for (const [key, value] of Object.entries(source)) {
  sourceOptions.push({ text: value, value: key });
}

export function useWhListUtils<T extends WhProperty, TApiData>(elementApi: WhApi<T, TApiData>) {
  const auth = useAuth();

  const whToDelete = ref({ id: "", name: "" });
  const whList: Ref<T[]> = ref([]);
  const apiError = ref("");

  async function loadWhList(): Promise<void> {
    try {
      whList.value = await auth.callAndLogoutIfUnauthorized(elementApi.listElements)();
    } catch (error) {
      console.log(error);
      apiError.value = "Error. Could not pull data from server.";
    }
  }

  async function copyWh(whId: string): Promise<void> {
    try {
      const whCopy: T = await auth.callAndLogoutIfUnauthorized(elementApi.getElement)(whId);
      whCopy.name = whCopy.name + " - copy";
      if (!whCopy.validateName().valid) {
        whCopy.name = whCopy.name.slice(-SHORT_DESC_REGEX);
      }
      const { id } = (await auth.callAndLogoutIfUnauthorized(elementApi.createElement)(
        whCopy,
      )) as ApiResponse<TApiData>;

      whCopy.id = id;
      whCopy.canEdit = true;
      whList.value.push(whCopy);
    } catch (error) {
      apiError.value = "Error. Could not upload data to server.";
    }
  }

  async function deleteWh() {
    try {
      await auth.callAndLogoutIfUnauthorized(elementApi.deleteElement)(whToDelete.value.id);
      for (let i = 0; i < whList.value.length; i++) {
        if (whList.value[i]["id"] === whToDelete.value.id) {
          whList.value.splice(i, 1);
          break;
        }
      }
    } catch (error) {
      apiError.value = "Error. Could not delete data from server.";
    }
  }

  const filteredSourceOptions = computed(() => {
    const sourcesInData: Set<string> = new Set();
    for (const wh of whList.value) {
      for (const source of Object.keys(wh.source)) {
        sourcesInData.add(source);
      }
    }
    return sourceOptions.filter((x) => sourcesInData.has(x.value) || x.value === "");
  });

  return { whList, apiError, loadWhList, copyWh, deleteWh, filteredSourceOptions, whToDelete };
}
