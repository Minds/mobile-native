// const expoPreset = require('jest-expo/jest-preset');

const config = {
  automock: false,
  cacheDirectory: '.jest/cache',
  testRegex: ['./__tests__/.*.js$', './src/.*\\.spec\\.[tj]sx?$'],
  preset: 'react-native',
  setupFiles: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|react-native-gesture-handler|react-navigation)/',
    'jest-runner',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  snapshotSerializers: ['./node_modules/enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

module.exports = config;
