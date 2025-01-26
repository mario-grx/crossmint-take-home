// Import the TypeScript parser
const parser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "import": require("eslint-plugin-import"),
    },
    rules: {
      indent: ["error", 2],
      "no-unused-vars": "off", // Turn off base rule to avoid conflicts
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" // Also ignore destructured variables starting with _
      }],
      "sort-imports": ["error", {
        ignoreCase: true,
        ignoreDeclarationSort: true, // Because we're using import/order
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
      }],
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }]
    },
  },
]; 