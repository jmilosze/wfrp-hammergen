<template>
  <div class="password">
    <form @submit.prevent="submit" id="update-username">
      <h4>Change password.</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-success" v-if="submissionSuccessful">Password updated successfully.</div>

          <div class="form-group">
            <label for="current-password">Current password</label>
            <div class="input-group">
              <input class="form-control valid" id="current-password" type="password" v-model="currentPassword" />
            </div>
          </div>

          <b-form-group label="New password" label-for="new-password-input">
            <b-form-input id="new-password-input" v-model="newPassword" type="password"></b-form-input>
            <b-form-invalid-feedback :state="validInputPassword[0]">
              {{ validInputPassword[1] }}</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group label="Confirm new password" label-for="retyped-password-input">
            <b-form-input id="retyped-password-input" v-model="retypedPassword" type="password"></b-form-input>
            <b-form-invalid-feedback :state="validInputPasswordMatch[0]">
              {{ validInputPasswordMatch[1] }}</b-form-invalid-feedback
            >
          </b-form-group>
          <button id="update-password-button" type="submit" class="btn btn-primary">
            <span v-if="submitting" class="spinner-border spinner-border-sm" />
            Save
          </button>
        </div>

        <div class="col-md-6">
          <div v-if="errors.length" class="text-danger field-validation-error">
            <ul>
              <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { validPassword, validPasswordMatch } from "../../../utils/validation/user";
import { authRequest } from "../../../services/auth";
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "UserPassword",
  mixins: [NavHelpers],
  data() {
    return {
      validatorOn: false,
      errors: [],
      submissionSuccessful: false,
      submitting: false,
      currentPassword: "",
      newPassword: "",
      retypedPassword: "",
    };
  },
  computed: {
    validInputPassword() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPassword(this.newPassword);
    },
    validInputPasswordMatch() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPasswordMatch(this.newPassword, this.retypedPassword);
    },
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.data.code === 107) {
          this.errors.push("Incorrect current password.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.validatorOn = false;
      this.currentPassword = "";
      this.newPassword = "";
      this.retypedPassword = "";
      this.submissionSuccessful = true;
    },
    submit() {
      this.validatorOn = true;
      this.submitting = false;
      this.submissionSuccessful = false;
      this.errors = [];

      if (!this.validInputPassword[0] || !this.validInputPasswordMatch[0]) {
        return;
      }

      this.submitting = true;

      this.callAndLogoutIfUnauthorized(authRequest.post)("/api/user/secure_update", {
        current_password: this.currentPassword,
        password: this.newPassword,
      })
        .then(this.onSubmissionSuccessful)
        .catch(this.onSubmissionFailed)
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
