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
const screenSizeWithoutScrollbar = useWindowSize({ includeScrollbar: false }).width;

export function useScreen(size: ViewSize = ViewSize.zero) {
  const isEqualOrGreater = computed(() => {
    return screenSize.value >= size;
  });

  const scrollWidth = computed(() => {
    return screenSize.value - screenSizeWithoutScrollbar.value;
  });

  return { isEqualOrGreater, scrollWidth };
}
