import { computed, Ref } from "vue";

const emailRegex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const pwdRegex = /^.{5,30}$/;

export function useEmailValidator(email: Ref<string>) {
  const validEmail = computed(() => {
    return emailRegex.test(email.value);
  });

  return {
    validEmail,
    invalidEmailMsg: "Email address is invalid.",
  };
}

export function usePasswordValidator(password: Ref<string>, retypedPassword: Ref<string>) {
  const validPassword = computed(() => {
    return pwdRegex.test(password.value);
  });

  const passwordMatch = computed(() => {
    return password.value === retypedPassword.value;
  });

  return {
    validPassword,
    passwordMatch,
    invalidPasswordMsg: "Password has to have between 5 and 30 characters.",
    passwordDoNotMatchMsg: "Passwords do not match.",
  };
}
