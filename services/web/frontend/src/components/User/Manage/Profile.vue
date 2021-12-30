<template>
  <div class="profile">
    <form @submit.prevent="submit" id="profile">
      <h4>Update profile.</h4>
      <div class="row">
        <div class="col-md-6">
          <div class="alert alert-success" v-if="submissionSuccessful">User data updated successfully.</div>

          <div class="form-group">
            <label for="username">Username (email)</label>
            <input class="form-control" disabled="" type="text" id="username" v-model="user.username" />
          </div>

          <div class="form-group">
            <label for="name-of-user">Name</label>
            <div class="input-group">
              <input class="form-control valid" id="name-of-user" v-model="user.name" />
            </div>
          </div>

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
import { nameErrors } from "../../../utils/userValidators";
import { authRequest } from "../../../services/auth";
import { logoutIfUnauthorized } from "../../../utils/navigation";

export default {
  name: "Profile",
  created() {
    logoutIfUnauthorized(authRequest.get)("/api/user")
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
      errors: [],
      submitting: false,
      submissionSuccessful: false,
      user: {
        name: "",
        username: "",
      },
    };
  },
  methods: {
    submit() {
      this.submitting = false;
      this.submissionSuccessful = false;

      this.errors = [];
      this.errors.push(...nameErrors(this.user.name));

      if (this.errors.length) {
        return;
      }

      this.submitting = true;

      logoutIfUnauthorized(authRequest.post)("/api/user/update", { name: this.user.name })
        .then(() => (this.submissionSuccessful = true))
        .catch(() => this.errors.push("Server Error."))
        .then(() => (this.submitting = false));
    },
  },
};
</script>

<style scoped></style>
