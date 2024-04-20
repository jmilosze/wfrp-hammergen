import { ref, nextTick } from "vue";

const printing = ref(false);

export function usePrint() {
  function print() {
    printing.value = true;
    nextTick().then(() => {
      window.print();
      printing.value = false;
    });
  }

  return {
    printing,
    print,
  };
}
