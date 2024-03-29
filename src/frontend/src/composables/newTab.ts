import { RouteParamsRaw, useRouter } from "vue-router";

export function useNewTab() {
  const router = useRouter();
  function openInNewTab(routeName: string, params: RouteParamsRaw) {
    const routePath = router.resolve({
      name: routeName,
      params: params,
    }).href;

    window.open(routePath, "_blank");
  }
  return { openInNewTab };
}
