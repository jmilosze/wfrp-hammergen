import { nextTick, ref } from "vue";

const show = ref(false);
const modalId = ref("");

export function useModal() {
  return {
    modalId,
    show,
    showModal: (id: string): void => {
      show.value = true;
      modalId.value = id;
      nextTick().then(() => {
        const modal = document.querySelector("#modal") as Element;
        modal.scroll(0, 0);
      });
    },
    hideModal: (): void => {
      show.value = false;
    },
  };
}
