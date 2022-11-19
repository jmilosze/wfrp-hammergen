import { between, integer, max, regex, required } from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/en.json";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: messages["required"],
});

extend("regex", {
  ...regex,
  message: "The {_field_} contains invalid character",
});

extend("max", {
  ...max,
  message: messages["max"],
});

extend("between", {
  ...between,
  message: messages["between"],
});

extend("integer", {
  ...integer,
  message: messages["integer"],
});
