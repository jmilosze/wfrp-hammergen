export function emailErrors(email) {
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;

  let errors = [];

  if (!email) {
    errors.push("Email is required.");
  } else if (!re.test(email)) {
    errors.push("Email address is invalid.");
  }
  return errors;
}

export function passwordErrors(password, passwordConfirmation) {
  let errors = [];

  if (!password) {
    errors.push("Password is required.");
  } else if (password.length < 5) {
    errors.push("Password has to have at least 5 characters.");
  }

  if (password !== passwordConfirmation) {
    errors.push("Passwords do not match.");
  }

  return errors;
}

function checkString(testValue, label, regex, msg) {
  if (regex.test(testValue)) {
    return [true, null];
  }
  return [false, msg];
}

export function nameErrors(name) {
  let errors = [];

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > 20) {
    errors.push("Name can have a maximum of 20 characters.");
  }

  return errors;
}

const nameRe = /^.{1,20}$/;
export function validUserName(name) {
  return checkString(name, "Name", nameRe, "Name has to have between 1 and 20 characters.");
}

const emailRe =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
export function validEmail(email) {
  return checkString(email, "Email", emailRe, "Email address is invalid.");
}

const passwordRe = /^.{5,30}$/;
export function validPassword(pswd) {
  return checkString(pswd, "Password", passwordRe, "Name has to have between 5 and 30 characters.");
}

export function validPasswordMatch(pswd1, pswd2) {
  if (pswd1 === pswd2) {
    return [true, null];
  }
  return [false, "Passwords do not match."];
}
