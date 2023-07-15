<template>
  <div class="username">
    <form @submit.prevent="submit" id="update-username">
      <h4>Change username (email)</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-success" v-if="submissionSuccessful">Username (email) updated successfully.</div>

          <b-form-group label="New username (email)" label-for="email-input">
            <b-form-input id="email-input" v-model="email" type="text"></b-form-input>
            <b-form-invalid-feedback :state="validInputEmail[0]"> {{ validInputEmail[1] }}</b-form-invalid-feedback>
          </b-form-group>

          <div class="form-group">
            <label for="password">Current password</label>
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
import { validEmail } from "../../../utils/validation/user";
import { authRequest } from "../../../services/auth";
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "UserName",
  mixins: [NavHelpers],
  data() {
    return {
      validatorOn: false,
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      email: "",
      password: "",
    };
  },
  computed: {
    validInputEmail() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validEmail(this.email);
    },
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.status === 403) {
          this.errors.push("Incorrect password.");
        } else if (response.response.status === 409) {
          this.errors.push("User with this email already exists.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.validatorOn = false;
      this.email = "";
      this.password = "";
      this.submissionSuccessful = true;
    },
    submit() {
      this.validatorOn = true;
      this.submitting = false;
      this.submissionSuccessful = false;
      this.errors = [];

      if (!this.validInputEmail[0]) {
        return;
      }

      this.submitting = true;

      this.callAndLogoutIfUnauthorized(authRequest.put)("/api/user/credentials", {
        username: this.email.toLowerCase(),
        password: this.password,
        currentPassword: this.password,
      })
        .then(this.onSubmissionSuccessful)
        .catch(this.onSubmissionFailed)
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
