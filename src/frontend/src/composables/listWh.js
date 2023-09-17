import { useAuthStore } from "../stores/auth";
import { ref } from "vue";
import { shortDescMaxChars, validWhShortDesc } from "../utils/validation/wh";
import { useRouter } from "vue-router/composables";

export function useListWh(elementApi) {
  const authStore = useAuthStore();
  const router = useRouter();

  const loaded = ref(false);
  const errors = ref([]);
  const listOfWh = ref([]);

  const queryParams = ref({});

  async function deleteWh(whId) {
    try {
      await authStore.callAndLogoutIfUnauthorized(elementApi.deleteElement)(whId);
      for (let i = 0; i < listOfWh.value.length; i++) {
        if (listOfWh.value[i]["id"] === whId) {
          listOfWh.value.splice(i, 1);
          break;
        }
      }
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  async function copyWh(whId) {
    try {
      const whCopy = await authStore.callAndLogoutIfUnauthorized(elementApi.getElement)(whId);
      whCopy.name = whCopy.name + " - copy";
      if (!validWhShortDesc(whCopy.name)) {
        whCopy.name = whCopy.name.slice(-shortDescMaxChars);
      }
      const createdId = await authStore.callAndLogoutIfUnauthorized(elementApi.createElement)(whCopy);

      let newListEntry;
      for (let i = 0; i < listOfWh.value.length; i++) {
        if (listOfWh.value[i]["id"] === whId) {
          newListEntry = JSON.parse(JSON.stringify(listOfWh.value[i]));
          break;
        }
      }

      newListEntry.name = whCopy.name;
      newListEntry.id = createdId.id;
      newListEntry.canEdit = true;

      listOfWh.value.push(newListEntry);
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  async function loadWhList() {
    errors.value = [];
    try {
      listOfWh.value = await authStore.callAndLogoutIfUnauthorized(elementApi.listElements)();
      loaded.value = true;
    } catch (error) {
      errors.value.push("Server Error.");
      throw error;
    }
  }

  function addParamsToLocation(path, params) {
    queryParams.value = params;

    history.pushState(
      {},
      null,
      path +
        "?" +
        Object.keys(params)
          .map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
          })
          .join("&")
    );
  }

  function createNewWh(elementType) {
    const goBackChain = [
      {
        name: "list_" + elementType,
        params: {},
        query: queryParams.value,
      },
    ];
    router.push({ name: elementType, params: { id: "create", goBackChain: goBackChain } });
  }

  return { copyWh, deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation, createNewWh };
}
