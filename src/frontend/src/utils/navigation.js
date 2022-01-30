import { router } from "../router";
import { store } from "../store";

function logoutIfUnauthorized(apiCall, routerLocName = "login") {
  return async function () {
    try {
      return await apiCall.apply(this, arguments);
    } catch (e) {
      if (e.response?.status === 401) {
        await store.dispatch("auth/logout");
        if (router.currentRoute.name !== routerLocName) {
          await router.push({ name: routerLocName });
        }
      }
      throw e;
    }
  };
}

export { logoutIfUnauthorized };
