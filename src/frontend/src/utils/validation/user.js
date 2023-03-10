import { checkString } from "./common";

const nameRe = /^.{1,20}$/;
export function validUserName(name) {
  return checkString(name, nameRe, "Name has to have between 1 and 20 characters.");
}

const emailRe =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
export function validEmail(email) {
  return checkString(email, emailRe, "Email address is invalid.");
}

const passwordRe = /^.{5,30}$/;
export function validPassword(pswd) {
  return checkString(pswd, passwordRe, "Name has to have between 5 and 30 characters.");
}

export function validPasswordMatch(pswd1, pswd2) {
  if (pswd1 === pswd2) {
    return [true, null];
  }
  return [false, "Passwords do not match."];
}
