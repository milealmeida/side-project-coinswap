module.exports = {
  env: { browser: true, es2020: true },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ["commitlint.config.js", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh', "react", "react-hooks", "@typescript-eslint"],
  rules: {
    'react-refresh/only-export-components': 'warn',
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
}
