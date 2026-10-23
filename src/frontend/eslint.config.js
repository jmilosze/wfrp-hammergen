import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    rules: {
      "vue/attribute-hyphenation": [1, "never"],
      "vue/v-on-event-hyphenation": [1, "never"],
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      // As in TypeScript, an argument named with a leading underscore may be unused (e.g. a base method's parameter).
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // Test code (specs, fixtures, src/testing.ts) must not end up in the app bundle.
    files: ["src/**/*.{ts,vue}"],
    ignores: ["src/**/*.spec.ts", "src/**/fixtures*.ts", "src/testing.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "vitest", message: "Only spec and fixture files may import vitest." }],
          patterns: [
            {
              group: ["**/*.spec.ts", "**/fixtures*.ts", "**/testing.ts"],
              message: "App code must not import spec, fixture or testing files.",
            },
          ],
        },
      ],
    },
  },
];
