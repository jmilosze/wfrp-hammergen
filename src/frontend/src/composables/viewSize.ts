import { computed, Ref } from "vue";
import { useElementSize, useWindowSize } from "@vueuse/core";
import { ViewSize } from "../utils/viewSize.ts";

const screenSize = useWindowSize().width;
const screenSizeWithoutScrollbar = useWindowSize({ includeScrollbar: false }).width;
const scrollWidth = computed(() => {
  return screenSize.value - screenSizeWithoutScrollbar.value;
});

export function useScreenSize(size: ViewSize) {
  const isEqualOrGreater = computed(() => {
    return screenSize.value >= size;
  });
  return { isEqualOrGreater };
}

export function useElSize(size: ViewSize | number, el: Ref<HTMLDivElement | null>) {
  const { width } = useElementSize(el);

  const isEqualOrGreater = computed(() => {
    return width.value + scrollWidth.value >= size;
  });
  return { isEqualOrGreater };
}
