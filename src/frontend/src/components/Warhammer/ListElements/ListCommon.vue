<template>
  <div class="element"></div>
</template>

<script>
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "ListCommon",
  mixins: [NavHelpers],
  methods: {
    async deleteElement(elementIndex) {
      try {
        const elementId = this.listOfElements[elementIndex]["id"];
        await this.callAndLogoutIfUnauthorized(this.elementApi.deleteElement)(elementId);
        this.listOfElements.splice(elementIndex, 1);
      } catch (error) {
        this.errors.push("Server Error.");
        throw error;
      }
    },
    async loadData() {
      this.errors = [];
      try {
        const rawElementList = await this.callAndLogoutIfUnauthorized(this.elementApi.listElements)();
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
