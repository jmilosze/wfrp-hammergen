import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";

export const enum ViewSize {
  zero = 0,
  sm = 640,
  md = 768,
  lg = 1024,
  xl = 1280,
  xxl = 1536,
}

const screenSize = useWindowSize().width;

export function useScreen(size: ViewSize) {
  const isEqualOrGreater = computed(() => {
    return screenSize.value >= size;
  });

  return { isEqualOrGreater };
}
