/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:vue/vue3-recommended", "prettier",],
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "@typescript-eslint/parser",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "vue/max-attributes-per-line": "off"
  },
  root: true,
};
