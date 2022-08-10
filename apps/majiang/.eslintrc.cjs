require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  "parser": "vue-eslint-parser",
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    '@vue/eslint-config-typescript/recommended',
    "plugin:@typescript-eslint/recommended"
  ],
  "root": true,
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "parserOptions": {
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "globals": {
    "NodeJS": true
  },
  "rules": {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-use-before-define": 1,
    "no-var": 1,
    "no-magic-numbers": "warn",
    "no-undef": "error"
  }
}
