import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: "readonly",
        document: "readonly",
        localStorage: "readonly",
        process: "readonly",
        window: "readonly"
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react-refresh/only-export-components": "off"
    }
  }
];
