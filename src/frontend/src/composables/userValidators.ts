import { computed, Ref } from "vue";

const emailRegex =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
const pwdRegex = /^.{5,30}$/;

export function useUserValidator(
  validatorOn: Ref<boolean>,
  email: Ref<string>,
  password: Ref<string>,
  retypedPassword: Ref<string>,
) {
  const validEmail = computed(() => {
    return !validatorOn.value ? true : emailRegex.test(email.value);
  });

  const validPassword = computed(() => {
    return !validatorOn.value ? true : pwdRegex.test(password.value);
  });

  const passwordMatch = computed(() => {
    return !validatorOn.value ? true : password.value === retypedPassword.value;
  });

  return {
    validEmail,
    validPassword,
    passwordMatch,
    invalidEmailMsg: "Email address is invalid.",
    invalidPasswordMsg: "Password has to have between 5 and 30 characters.",
    passwordDoNotMatchMsg: "Passwords do not match.",
  };
}
