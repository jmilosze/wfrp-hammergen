// Warns before leaving a page that has work not saved anywhere (e.g. guided creation in progress): navigation inside
// the app asks for confirmation, and reloading or closing the tab gets the browser's own warning.
import { onBeforeUnmount, onMounted, Ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const LEAVE_WARNING = "Changes that you made may not be saved.";

export function useLeaveWarning(active: Ref<boolean>) {
  onBeforeRouteLeave(() => !active.value || window.confirm(LEAVE_WARNING));

  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (active.value) {
      event.preventDefault();
    }
  }
  onMounted(() => window.addEventListener("beforeunload", onBeforeUnload));
  onBeforeUnmount(() => window.removeEventListener("beforeunload", onBeforeUnload));
}
