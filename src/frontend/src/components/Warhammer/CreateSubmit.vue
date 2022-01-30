<template>
  <div class="create-submit">
    <b-form-group
      v-if="showAddAnother"
      label="Add another after saving?"
      label-for="and-another-input"
    >
      <b-form-radio-group
        id="and-another-input"
        :disabled="disabled"
        :options="[
          { value: true, text: 'Yes' },
          { value: false, text: 'No' },
        ]"
        :checked="value"
        @input="(newVal) => $emit('input', newVal)"
      >
      </b-form-radio-group>
    </b-form-group>

    <b-button
      :disabled="disabled"
      type="submit"
      variant="primary"
      class="mr-2 mb-1"
    >
      <span v-if="submitting" class="spinner-border spinner-border-sm" />
      Save
    </b-button>
    <b-button @click="$emit('goBack')" variant="primary" class="mr-2 mb-1">
      Back
    </b-button>
  </div>
</template>

<script>
export default {
  name: "CreateSubmit",
  props: {
    showAddAnother: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped></style>
