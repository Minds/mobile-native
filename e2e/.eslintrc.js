module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'wdio'],
  extends: ['eslint:recommended', 'plugin:wdio/recommended'],
  env: {
    node: true,
    es6: true,
    jasmine: true,
  },
  globals: {
    browser: true,
    document: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        // see https://stackoverflow.com/questions/55280555/typescript-eslint-eslint-plugin-error-route-is-defined-but-never-used-no-un
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-undef': 'off',
        // allow overloads
        'no-redeclare': 'off',
      },
    },
  ],
};
