<template>
  <div class="reset-password">
    <div class="container">
      <form @submit.prevent="submit" id="reset-password">
        <h1>Reset password</h1>
        <h4>Create a new password.</h4>
        <hr />
        <div class="alert alert-success" v-if="submissionSuccessful">
          Password reset successful, redirecting to login...
        </div>
        <div class="row">
          <div class="col-md-4">
            <b-form-group label="New password" label-for="password-input">
              <b-form-input id="password-input" v-model="password" type="password"></b-form-input>
              <b-form-invalid-feedback :state="validInputPassword[0]">
                {{ validInputPassword[1] }}</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group label="Confirm password" label-for="retyped-password-input">
              <b-form-input id="retyped-password-input" v-model="retypedPassword" type="password"></b-form-input>
              <b-form-invalid-feedback :state="validInputPasswordMatch[0]">
                {{ validInputPasswordMatch[1] }}</b-form-invalid-feedback
              >
            </b-form-group>

            <div class="form-group">
              <button type="submit" form="reset-password" value="Submit" class="btn btn-primary">
                <span v-if="submitting" class="spinner-border spinner-border-sm" />
                Submit
              </button>
            </div>
          </div>
          <div class="col-md-8">
            <div v-if="errors.length" class="text-danger field-validation-error">
              <ul>
                <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { validPassword, validPasswordMatch } from "../../utils/validation/user";
import { anonRequest } from "../../services/auth";

export default {
  name: "UserNewPassword",
  props: {
    token: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      validatorOn: false,
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      password: "",
      retypedPassword: "",
    };
  },
  computed: {
    validInputPassword() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPassword(this.password);
    },
    validInputPasswordMatch() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validPasswordMatch(this.password, this.retypedPassword);
    },
  },
  methods: {
    onSubmissionFailed(response) {
      if (response.response) {
        if (response.response.data.code === 105) {
          this.errors.push("Reset link has expired. Send another reset password link.");
        } else {
          this.errors.push("Server Error.");
        }
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.validatorOn = false;
      this.password = "";
      this.retypedPassword = "";
      this.submissionSuccessful = true;

      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
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

      anonRequest
        .post("/api/user/reset_password", {
          password: this.password,
          reset_token: this.token,
        })
        .then(this.onSubmissionSuccessful)
        .catch(this.onSubmissionFailed)
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
