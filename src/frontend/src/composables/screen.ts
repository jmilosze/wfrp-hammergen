import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

const sizes = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

const screenSize = useWindowSize().width;

export function useScreen() {
  const screenSizeMd = computed(() => {
    return screenSize.value >= sizes.md;
  });

  return { screenSizeMd };
}
