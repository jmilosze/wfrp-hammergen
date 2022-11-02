<template>
  <div class="element"></div>
</template>

<script>
import { logoutIfUnauthorized } from "../../../utils/navigation";

export default {
  name: "ListCommon",
  methods: {
    async deleteElement(elementId, elementIndex) {
      try {
        await logoutIfUnauthorized(this.elementApi.deleteElement)(elementId);
        this.listOfElements.splice(elementIndex, 1);
      } catch (error) {
        this.errors.push("Server Error.");
        throw error;
      }
    },
    async loadData() {
      this.errors = [];
      try {
        const rawElementList = await logoutIfUnauthorized(this.elementApi.listElements)();
        this.listOfElements = rawElementList.map((x) => this.formatList(x));
        this.loaded = true;
      } catch (error) {
        this.errors.push("Server Error.");
        throw error;
      }
    },
  },
};
</script>

<style scoped></style>
