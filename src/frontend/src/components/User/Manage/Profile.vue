<template>
  <div class="profile">
    <form @submit.prevent="submit" id="profile">
      <h4>Update profile</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-success" v-if="submissionSuccessful">User data updated successfully.</div>

          <div class="form-group">
            <label for="username">Username (email)</label>
            <input class="form-control" disabled="" type="text" id="username" v-model="user.username" />
          </div>

          <b-form-group label="Name" label-for="name-input">
            <b-form-input id="name-input" v-model="user.name" type="text"></b-form-input>
            <b-form-invalid-feedback :state="validInputName[0]"> {{ validInputName[1] }}</b-form-invalid-feedback>
          </b-form-group>

          <button id="update-profile-button" type="submit" class="btn btn-primary">
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
import { validUserName } from "../../../utils/validation/user";
import { authRequest } from "../../../services/auth";
import NavHelpers from "../../NavHelpers.vue";

export default {
  name: "UserProfile",
  mixins: [NavHelpers],
  created() {
    this.callAndLogoutIfUnauthorized(authRequest.get)("/api/user")
      .then(
        (resp) =>
          (this.user = {
            name: resp.data.data.name,
            username: resp.data.data.username,
          })
      )
      .catch(() => this.errors.push("Server Error."));
  },
  data() {
    return {
      validatorOn: false,
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      user: {
        name: "",
        username: "",
      },
    };
  },
  computed: {
    validInputName() {
      if (!this.validatorOn) {
        return [true, null];
      }
      return validUserName(this.user.name);
    },
  },
  methods: {
    onRegistrationSuccessful() {
      this.validatorOn = false;
      this.submissionSuccessful = true;
    },

    submit() {
      this.validatorOn = true;
      this.submitting = false;
      this.submissionSuccessful = false;
      this.errors = [];

      if (!this.validInputName[0]) {
        return;
      }

      this.submitting = true;

      this.callAndLogoutIfUnauthorized(authRequest.post)("/api/user/update", { name: this.user.name })
        .then(() => this.onRegistrationSuccessful())
        .catch(() => this.errors.push("Server Error."))
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
