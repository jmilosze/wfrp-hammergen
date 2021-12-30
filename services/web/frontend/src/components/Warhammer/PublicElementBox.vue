<template>
  <div class="public-element-box">
    <div class="flex-container">
      <div class="mr-2 align-center">Public {{ elementName }}?</div>
      <b-button size="sm" variant="info" @click="activateTooltip">What does it mean?</b-button>
    </div>
    <b-collapse v-model="publicTooltip" class="mt-2 mb-2">
      <p>
        When an element (character, skill, item, etc.) is marked as <b>Public</b> anyone you give your username to, can
        see that element in read-only mode. Element sharing is explained in the Linked Users tab in
        <b-link :to="{ name: 'manage' }" target="_blank">Manage Account</b-link> section.
      </p>
    </b-collapse>
    <div class="border mt-2 mb-2">
      <b-form-checkbox id="make-public" class="m-2" :checked="value" @input="(newVal) => $emit('input', newVal)">
        Public
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicElementBox",
  props: {
    value: {
      type: Boolean,
    },
    elementName: {
      type: String,
    },
  },
  data() {
    return {
      publicTooltip: false,
    };
  },
  methods: {
    activateTooltip() {
      this.publicTooltip = !this.publicTooltip;
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-wrap: wrap;
}
.align-center {
  align-self: center;
}
</style>
