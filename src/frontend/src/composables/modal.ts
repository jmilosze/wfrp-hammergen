import { ref } from "vue";

const show = ref(false);
const modalId = ref("");

export function useModal() {
  return {
    modalId,
    show,
    showModal: (id: string): void => {
      show.value = true;
      modalId.value = id;
    },
    hideModal: () => {
      show.value = false;
    },
  };
}
