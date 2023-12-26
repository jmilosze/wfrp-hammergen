import { setValidationStatus, ValidationStatus } from "./validation.ts";

const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const PASSWORD_REGEX = /^.{5,30}$/;

export class User {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  sharedAccounts: string[];

  constructor() {
    this.email = "";
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmNewPassword = "";
    this.sharedAccounts = [];
  }

  reset() {
    this.email = "";
    this.currentPassword = "";
    this.newPassword = "";
    this.confirmNewPassword = "";
    this.sharedAccounts = [];
  }

  validateEmail(): ValidationStatus {
    return setValidationStatus(EMAIL_REGEX.test(this.email), "Email address is invalid.");
  }

  validateCurrentPassword(): ValidationStatus {
    return setValidationStatus(this.currentPassword !== "", "Password is required.");
  }

  validatePassword(): ValidationStatus {
    return setValidationStatus(
      PASSWORD_REGEX.test(this.newPassword),
      "Password has to have between 5 and 30 characters.",
    );
  }

  validatePasswordMatch(): ValidationStatus {
    return setValidationStatus(this.newPassword == this.confirmNewPassword, "Passwords do not match.");
  }

  validateNewSharedAccount(newSharedAccount: string): ValidationStatus {
    if (!newSharedAccount) {
      return setValidationStatus(false, "Please specify username.");
    }

    if (newSharedAccount == this.email) {
      return setValidationStatus(false, "You cannot add your own username.");
    }

    if (this.sharedAccounts.includes(newSharedAccount)) {
      return setValidationStatus(false, `Username ${newSharedAccount} is already on the list.`);
    }

    return setValidationStatus(true);
  }
}
