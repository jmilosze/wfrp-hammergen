import { ref } from "vue";

const show = ref(false);

export function useAfterSubmit() {
  return {
    show,
    showAfterSubmit: (): void => {
      show.value = true;
    },
    hideAfterSubmit: (): void => {
      show.value = false;
    },
  };
}
