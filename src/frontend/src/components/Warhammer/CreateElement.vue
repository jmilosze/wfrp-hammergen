<template>
  <div class="element"></div>
</template>

<script>
import { logoutIfUnauthorized } from "../../utils/navigation";

const leaveConfirmation = "Changes that you made may not be saved.";

export default {
  name: "CreateElement2",
  props: {
    id: {
      type: String,
      default: "create",
    },
    goBackChain: {
      type: Array,
      default: () => [],
    },
  },
  data: function () {
    return {
      errors: [],
      submitting: false,
      element: null,
      elementOriginal: null,
      nameValid: { required: true, max: 200, regex: /^[^<>]+$/ },
      descShortValid: { max: 200, regex: /^[^<>]+$/ },
      descValid: { max: 100000, regex: /^[^<>]+$/ },
      saveSuccessCountdown: 0,
      addAnother: false,
      checkIfModified: true,
    };
  },
  created() {
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  },
  beforeRouteLeave(to, from, next) {
    if (!this.checkIfModified || !this.formModified()) {
      next();
    } else {
      const answer = window.confirm(leaveConfirmation);
      if (answer) {
        next();
      } else {
        next(false);
      }
    }
  },
  methods: {
    async initializeElement() {
      if (this.id === "create") {
        this.setElementToNew(this.$store.state.auth.isLoggedIn);
        this.resetTables();
      } else {
        logoutIfUnauthorized(this.elementApi.getElement)(this.id)
          .then((element) => {
            this.element = element;
            this.elementOriginal = JSON.parse(JSON.stringify(this.element));
            this.resetTables();
          })
          .catch(() => {
            this.addError();
          });
      }
    },
    resetTables() {},
    invFeedState: function (errors, valid) {
      return errors[0] ? false : valid ? true : null;
    },
    addError() {
      this.errors.push("Server Error.");
    },
    goBack() {
      if (this.goBackChain.length === 0) {
        this.$router.push({ name: `list_${this.elementType}` }).catch(() => {});
      } else {
        const goTo = this.goBackChain.pop();

        this.$router
          .push({
            name: goTo.name,
            params: { id: goTo.id, goBackChain: this.goBackChain },
          })
          .catch(() => {});
      }
    },
    beforeUnloadHandler(event) {
      if (this.checkIfModified && this.formModified()) {
        return (event.returnValue = "zxc");
      }
    },
    async submitForm(redirectElementType = null) {
      this.beforeSubmit();

      try {
        let serverResp = null;
        if (this.id === "create") {
          serverResp = await logoutIfUnauthorized(this.elementApi.createElement)(this.element);
        } else {
          serverResp = await logoutIfUnauthorized(this.elementApi.updateElement)(this.element);
        }
        if (redirectElementType) {
          this.redirectAfterSubmit(serverResp.id, redirectElementType);
        } else if (!this.addAnother) {
          this.goBack();
        } else {
          this.setElementToNew(true);
          this.resetTables();
          this.afterSuccessfulSubmit();
        }
      } catch {
        this.addError();
      }
      this.afterSubmit();
    },
    redirectAfterSubmit(elementId, redirectElementName) {
      this.goBackChain.push({ name: this.elementType, id: elementId });
      this.$router
        .push({
          name: redirectElementName,
          params: { id: "create", goBackChain: this.goBackChain },
        })
        .catch(() => {});
    },
    beforeSubmit() {
      this.errors = [];
      this.submitting = true;
      this.checkIfModified = false;
    },
    afterSubmit() {
      this.submitting = false;
    },
    afterSuccessfulSubmit() {
      this.checkIfModified = true;
      this.saveSuccessCountdown = 2;
    },
  },
  computed: {
    titlePrefix: function () {
      return this.id === "create" ? "Create" : "Edit";
    },
    showAddAnother: function () {
      return this.id === "create";
    },
  },
};
</script>

<style scoped></style>
