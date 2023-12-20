const emailRegex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const pwdRegex = /^.{5,30}$/;

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

  validateEmail() {
    return emailRegex.test(this.email);
  }

  validateCurrentPassword() {
    return this.currentPassword !== "";
  }

  validatePassword() {
    return pwdRegex.test(this.password);
  }

  passwordMatch() {
    return this.password == this.retypedPassword;
  }
}

export const invalidEmailMsg = "Email address is invalid.";
export const invalidPasswordMsg = "Password has to have between 5 and 30 characters.";
export const passwordDoNotMatchMsg = "Passwords do not match.";
