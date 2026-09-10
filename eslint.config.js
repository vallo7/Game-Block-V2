export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "android/**"
    ],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  }
];
