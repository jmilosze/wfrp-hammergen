<template>
  <div class="table-common"></div>
</template>

<script>
export default {
  name: "TableCommon",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    canSave: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onFiltered: function (filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    showEdit: function (id) {
      this.editFilter = null;
      this.totalRows = this.listOfItems.length;
      this.currentPage = 1;
      this.sortListOfItems(false);
      this.$bvModal.show(id);
    },
  },
  computed: {
    resultRange: function () {
      const beginRange = Math.min(1 + (this.currentPage - 1) * this.perPage, this.totalRows);
      const endRange = Math.min(this.currentPage * this.perPage, this.totalRows);
      return `Results ${beginRange} - ${endRange} of ${this.totalRows}`;
    },
  },
};
</script>

<style scoped></style>
