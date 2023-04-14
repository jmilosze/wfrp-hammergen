<script>
import NavHelpers from "../NavHelpers.vue";
import { validWhDesc, validWhShortDesc } from "../../utils/validation/wh";

const leaveConfirmation = "Changes that you made may not be saved.";

export default {
  name: "CreateElement2",
  mixins: [NavHelpers],
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
        this.setElementToNew(this.authStore.loggedIn);
        this.resetTables();
      } else {
        this.callAndLogoutIfUnauthorized(this.elementApi.getElement)(this.id)
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
    addError() {
      this.errors.push("Server Error.");
    },
    goBack(toList = false) {
      if (this.goBackChain.length === 0) {
        if (toList) {
          this.$router.push({ name: `list_${this.elementType}` }).catch(() => {});
        } else {
          this.$router.back();
        }
      } else {
        // eslint-disable-next-line vue/no-mutating-props
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
    // eslint-disable-next-line no-unused-vars
    async submit(event) {
      await this.submitForm();
    },
    async submitForm(redirectElementType = null) {
      this.beforeSubmit();

      if (!this.validate()) {
        this.afterSubmit();
        return;
      }
      try {
        let serverResp = null;
        if (this.id === "create") {
          serverResp = await this.callAndLogoutIfUnauthorized(this.elementApi.createElement)(this.element);
        } else {
          serverResp = await this.callAndLogoutIfUnauthorized(this.elementApi.updateElement)(this.element);
        }
        if (redirectElementType) {
          console.log("Hello");
          console.log(redirectElementType);
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
    validate() {
      return this.validName[0] && this.validDesc[0];
    },
    redirectAfterSubmit(elementId, redirectElementName) {
      // eslint-disable-next-line vue/no-mutating-props
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
    validName() {
      return validWhShortDesc(this.element.name);
    },
    validDesc() {
      return validWhDesc(this.element.description);
    },
  },
};
</script>
