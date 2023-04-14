import { useAuthStore } from "../stores/auth";
import { ref } from "vue";

export function useListWh(elementApi) {
  const authStore = useAuthStore();

  const loaded = ref(false);
  const errors = ref([]);
  const listOfWh = ref([]);

  async function deleteWh(whIndex) {
    try {
      const whId = listOfWh.value[whIndex]["id"];
      await authStore.callAndLogoutIfUnauthorized(elementApi.deleteElement)(whId);
      listOfWh.value.splice(whIndex, 1);
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

  return { deleteWh, loadWhList, loaded, errors, listOfWh, addParamsToLocation };
}
