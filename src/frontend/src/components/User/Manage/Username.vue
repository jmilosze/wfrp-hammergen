<template>
  <div class="username">
    <form @submit.prevent="submit" id="update-username">
      <h4>Change username (email).</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-success" v-if="submissionSuccessful">Username (email) updated successfully.</div>

          <div class="form-group">
            <label for="username">New username (email)</label>
            <input class="form-control" type="text" id="username" v-model="email" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-group">
              <input class="form-control valid" id="password" type="password" v-model="password" />
            </div>
          </div>

          <button id="update-username-button" type="submit" class="btn btn-primary">
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
import { emailErrors } from "../../../utils/userValidators";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";

export default {
  name: "UserName",
  data() {
    return {
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      email: "",
      password: "",
    };
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.data.code === 102) {
          this.errors.push("Incorrect password.");
        } else if (response.response.data.code === 101) {
          this.errors.push("User with this email already exists.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.email = "";
      this.password = "";
      this.submissionSuccessful = true;
    },
    submit() {
      this.submitting = false;
      this.submissionSuccessful = false;

      this.errors = [];
      this.errors.push(...emailErrors(this.email));

      if (!this.password) {
        this.errors.push("Password is required");
      }

      if (this.errors.length) {
        return;
      }

      this.submitting = true;

      logoutIfUnauthorized(authRequest.post)("/api/user/secure_update", {
        username: this.email.toLowerCase(),
        current_password: this.password,
      })
        .then(this.onSubmissionSuccessful)
        .catch(this.onSubmissionFailed)
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
