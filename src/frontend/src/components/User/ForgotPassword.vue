<template>
  <div class="forgot-password">
    <div class="container">
      <form @submit.prevent="submit" id="login">
        <h1>Forgot your password?</h1>
        <h4>Enter your email.</h4>
        <hr />
        <p>
          Please submit email address you used as a account login. We will send you password reset link. If you cannot
          see the email please check your junk/spam folders.
        </p>
        <h5>Please be advised</h5>
        <p>
          Occasionally when using "Forgot your password" you might not get the email at all. This is because email
          provides (for example Microsoft or Google) sometimes block IP addresses of the service Hammergen uses to send
          emails. If that happens to you, please wait a minute or two and try again few more times. If you still do not
          see any email from us, please contact us at
          <a href="mailto:admin@hammergen.net">admin@hammergen.net</a> to restore your account.
        </p>
        <div class="alert alert-success" v-if="submissionSuccessful">
          To reset you password please check your email and follow instructions.
        </div>
        <div class="row">
          <div class="col-md-4">
            <b-form-group label="Email" label-for="email-input">
              <b-form-input id="email-input" v-model="username" type="text"></b-form-input>
              <b-form-invalid-feedback :state="validInputEmail[0]"> {{ validInputEmail[1] }}</b-form-invalid-feedback>
            </b-form-group>

            <div class="form-group">
              <button type="submit" form="login" value="Submit" class="btn btn-primary">
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
import { validEmail } from "../../utils/validation/user";
import { anonRequest } from "../../services/auth";

export default {
  name: "UserForgotPassword",
  created() {
    this.$recaptchaLoaded().then(() => {
      this.$recaptchaInstance.showBadge();
    });
  },
  destroyed() {
    this.$recaptchaInstance.hideBadge();
  },
  data() {
    return {
      validatorOn: false,
      username: "",
      errors: [],
      submitting: false,
      submissionSuccessful: false,
    };
  },
  computed: {
    validInputEmail() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validEmail(this.username);
    },
  },
  methods: {
    onSubmissionFailed(error) {
      if (error.response && error.response.data.code === 106) {
        this.errors.push("We suspect you might be a robot. Please try again.");
      } else {
        this.errors.push("Server Error.");
      }
    },
    onSubmissionSuccessful() {
      this.validatorOn = false;
      this.username = "";
      this.submissionSuccessful = true;
    },
    async submit() {
      this.validatorOn = true;
      this.submitting = false;
      this.submissionSuccessful = false;
      this.errors = [];

      if (!this.validInputEmail[0]) {
        return;
      }

      this.submitting = true;

      await this.$recaptchaLoaded();
      const token = await this.$recaptcha("resetpassword");

      try {
        await anonRequest.post("/api/user/send_reset_password", {
          username: this.username.toLowerCase(),
          recaptcha: token,
        });
        this.onSubmissionSuccessful();
      } catch (error) {
        this.onSubmissionFailed(error);
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped></style>
