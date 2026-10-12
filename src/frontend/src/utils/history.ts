import { Router } from "vue-router";

// returnToPreviousPage goes back in the browser history after an editor saves or deletes. A page opened in a new tab
// (e.g. "Create new" in a picker) has no previous page, so it goes to the list page instead.
export async function returnToPreviousPage(router: Router, listRouteName: string): Promise<void> {
  if (router.options.history.state.back === null) {
    await router.push({ name: listRouteName });
  } else {
    router.back();
  }
}
