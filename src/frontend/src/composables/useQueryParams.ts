import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useQueryParams(paramName: string, allowedValues: string[]) {
  const router = useRouter();
  const route = useRoute();

  const param = ref(allowedValues[0]);

  if (route.query[paramName] && allowedValues.includes(route.query[paramName] as string)) {
    param.value = route.query[paramName] as string;
  }

  watch(
    () => param.value,
    (newVal) => {
      router.replace({ query: { ...route.query, [paramName]: newVal } });
    },
  );

  return param;
}
