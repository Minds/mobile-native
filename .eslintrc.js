module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'detox'],
  globals: {
    JSX: 'readonly',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
