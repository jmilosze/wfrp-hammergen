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

export function nameErrors(name) {
  let errors = [];

  if (!name) {
    errors.push("Name is required.");
  } else if (name.length > 20) {
    errors.push("Name can have a maximum of 20 characters.");
  }

  return errors;
}
