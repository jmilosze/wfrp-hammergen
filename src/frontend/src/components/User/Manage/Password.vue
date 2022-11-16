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

          <div class="form-group">
            <label for="new-password">New password</label>
            <input v-model="newPassword" type="password" id="new-password" class="form-control" />
          </div>

          <div class="form-group">
            <label for="retyped-password">Confirm new password</label>
            <input v-model="retypedPassword" type="password" id="retyped-password" class="form-control" />
          </div>

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
import { passwordErrors } from "../../../utils/userValidators";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";

export default {
  name: "UserPassword",
  data() {
    return {
      errors: [],
      submissionSuccessful: false,
      submitting: false,
      currentPassword: "",
      newPassword: "",
      retypedPassword: "",
    };
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.data.code === 102) {
          this.errors.push("Incorrect current password.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.currentPassword = "";
      this.newPassword = "";
      this.retypedPassword = "";
      this.submissionSuccessful = true;
    },
    submit() {
      this.submitting = false;
      this.submissionSuccessful = false;

      this.errors = [];
      this.errors.push(...passwordErrors(this.newPassword, this.retypedPassword));

      if (!this.currentPassword) {
        this.errors.push("Current password is required");
      }

      if (this.errors.length) {
        return;
      }

      this.submitting = true;

      logoutIfUnauthorized(authRequest.post)("/api/user/secure_update", {
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
