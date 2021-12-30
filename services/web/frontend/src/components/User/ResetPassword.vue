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
            <div class="form-group">
              <label for="password">New password</label>
              <input v-model="password" type="password" id="password" class="form-control" />
            </div>

            <div class="form-group">
              <label for="retyped-password">Confirm password</label>
              <input v-model="retypedPassword" type="password" id="retyped-password" class="form-control" />
            </div>

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
import { passwordErrors } from "../../utils/userValidators";
import { anonRequest } from "../../services/auth";

export default {
  name: "NewPasswordWithToken",
  props: {
    token: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      password: "",
      retypedPassword: "",
    };
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
      this.password = "";
      this.retypedPassword = "";
      this.submissionSuccessful = true;

      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 1000);
    },
    submit() {
      this.submitting = false;
      this.submissionSuccessful = false;

      this.errors = [];
      this.errors.push(...passwordErrors(this.password, this.retypedPassword));

      if (this.errors.length) {
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
