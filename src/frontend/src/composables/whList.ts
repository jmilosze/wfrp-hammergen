import { ApiResponse, SHORT_DESC_REGEX, WhApi, WhProperty } from "../services/wh/common.ts";
import { UnauthorizedError, useAuthStore } from "../stores/auth.ts";
import { computed, Ref, ref } from "vue";
import { source } from "../services/wh/source.ts";

const sourceOptions: { text: string; value: string }[] = [{ text: "Any source", value: "" }];
for (const [key, value] of Object.entries(source)) {
  sourceOptions.push({ text: value, value: key });
}

export function useWhListUtils<T extends WhProperty, TApiData>(elementApi: WhApi<T, TApiData>) {
  const authStore = useAuthStore();

  const loaded = ref(false);
  const errors: Ref<string[]> = ref([]);
  const whList: Ref<T[]> = ref([]);

  async function loadWhList(): Promise<void> {
    errors.value = [];
    try {
      whList.value = await authStore.callAndLogoutIfUnauthorized(elementApi.listElements)();
      loaded.value = true;
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        errors.value.push("Server Error.");
        throw error;
      }
    }
  }

  async function copyWh(whId: string): Promise<void> {
    try {
      const whCopy: T = await authStore.callAndLogoutIfUnauthorized(elementApi.getElement)(whId);
      whCopy.name = whCopy.name + " - copy";
      if (!whCopy.validateName().valid) {
        whCopy.name = whCopy.name.slice(-SHORT_DESC_REGEX);
      }
      const { id } = (await authStore.callAndLogoutIfUnauthorized(elementApi.createElement)(
        whCopy,
      )) as ApiResponse<TApiData>;

      whCopy.id = id;
      whCopy.canEdit = true;
      whList.value.push(whCopy);
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  async function deleteWh(whId: string) {
    try {
      await authStore.callAndLogoutIfUnauthorized(elementApi.deleteElement)(whId);
      for (let i = 0; i < whList.value.length; i++) {
        if (whList.value[i]["id"] === whId) {
          whList.value.splice(i, 1);
          break;
        }
      }
    } catch (error) {
      if (!(error instanceof UnauthorizedError)) {
        errors.value.push("Server Error.");
        throw error;
      }
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

  return { loaded, errors, whList, loadWhList, copyWh, deleteWh, filteredSourceOptions };
}
