import { useAuthStore } from "../stores/auth";

export function useListWh() {
  const authStore = useAuthStore();

  async function deleteWh(whIndex, listOfWh, errors) {
    try {
      const whId = listOfWh[whIndex]["id"];
      await authStore.callAndLogoutIfUnauthorized(this.elementApi.deleteElement)(whId);
      listOfWh.splice(whIndex, 1);
    } catch (error) {
      errors.push("Server Error.");
      throw error;
    }
  }

  async function loadWhList(errors) {
    errors = [];
    try {
      const rawElementList = await authStore.callAndLogoutIfUnauthorized(this.elementApi.listElements)();
      return rawElementList.map((x) => this.formatList(x));
    } catch (error) {
      errors.push("Server Error.");
      throw error;
    }
  }

  return { deleteWh, loadWhList };
}
