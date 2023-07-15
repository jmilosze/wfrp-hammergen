<template>
  <div class="delete">
    <form @submit.prevent="submit" id="delete">
      <h4>Delete account</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-group">
              <input class="form-control valid" id="password" type="password" v-model="password" />
            </div>
          </div>

          <p>The account and all its data will be deleted. It will be impossible to recover.</p>
          <button id="update-username-button" type="submit" class="btn btn-danger">
            <span v-if="submitting" class="spinner-border spinner-border-sm" />
            Delete
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
import { authRequest } from "../../../services/auth";
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "UserDelete",
  mixins: [NavHelpers],
  data() {
    return {
      errors: [],
      password: "",
      submitting: "",
    };
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.status === 403) {
          this.errors.push("Incorrect password.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
      this.submitting = false;
    },
    submit() {
      this.submitting = false;
      this.errors = [];

      if (!this.password) {
        this.errors.push("Password is required");
      }

      if (this.errors.length) {
        return;
      }

      this.submitting = true;

      this.callAndLogoutIfUnauthorized(authRequest.delete)("/api/user", { data: { password: this.password } })
        .then(this.logout)
        .catch(this.onSubmissionFailed);
    },
  },
};
</script>

<style scoped></style>
