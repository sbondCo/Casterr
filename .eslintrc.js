module.exports = {
  root: true,
  extends: [],
  ignorePatterns: ["*.config.js", "dist/**"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["react"],
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: ["standard-with-typescript", "plugin:react/recommended", "prettier"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.entry.json"]
      },
      rules: {
        "comma-dangle": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/consistent-type-assertions": "off",
        "@typescript-eslint/no-extraneous-class": "off", // Cant be bothered rewriting these, maybe later
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: false
          }
        ],
        "@typescript-eslint/indent": "off"
      }
    }
  ]
};
