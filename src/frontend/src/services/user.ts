import { setValidationStatus, ValidationStatus } from "./validation.ts";

const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const PASSWORD_REGEX = /^.{5,30}$/;

export class User {
  email: string;
  currentPassword: string;
  password: string;
  retypedPassword: string;

  constructor() {
    this.email = "";
    this.currentPassword = "";
    this.password = "";
    this.retypedPassword = "";
    this.retypedPassword = "";
  }

  reset() {
    this.email = "";
    this.currentPassword = "";
    this.password = "";
    this.retypedPassword = "";
  }

  validateEmail(): ValidationStatus {
    return setValidationStatus(EMAIL_REGEX.test(this.email), "Email address is invalid.");
  }

  validateCurrentPassword(): ValidationStatus {
    return setValidationStatus(this.currentPassword !== "", "Password is required.");
  }

  validatePassword(): ValidationStatus {
    return setValidationStatus(PASSWORD_REGEX.test(this.password), "Password has to have between 5 and 30 characters.");
  }

  passwordMatch(): ValidationStatus {
    return setValidationStatus(this.password == this.retypedPassword, "Passwords do not match.");
  }
}
