module.exports = {
  root: true,
  extends: [],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["react"],
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: ["standard-with-typescript", "plugin:react/recommended"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"]
      },
      rules: {
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "comma-dangle": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/consistent-type-assertions": "off",
        "@typescript-eslint/no-extraneous-class": "off", // Cant be bothered rewriting these, maybe later
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/strict-boolean-expressions": "off"
      }
    }
  ]
};
