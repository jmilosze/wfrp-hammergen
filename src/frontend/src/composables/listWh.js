import { useAuthStore } from "../stores/auth";
import { ref } from "vue";

export function useListWh(elementApi) {
  const authStore = useAuthStore();

  const loaded = ref(false);
  const errors = ref([]);
  const listOfWh = ref([]);

  async function deleteWh(whIndex) {
    try {
      const whId = listOfWh[whIndex]["id"];
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

  return { deleteWh, loadWhList, loaded, errors, listOfWh };
}
