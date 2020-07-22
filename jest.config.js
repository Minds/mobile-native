const expoPreset = require('jest-expo/jest-preset');

const config = {
  ...expoPreset,
  automock: false,
  cacheDirectory: '.jest/cache',
  testRegex: './__tests__/.*.js$',
  preset: 'react-native',
  setupFiles: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: ['node_modules/(?!react-native|react-navigation)/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
    // "^[@./a-zA-Z0-9$_-]+\\.(png|gif)$": "RelativeImageStub"
  },
  snapshotSerializers: ['./node_modules/enzyme-to-json/serializer'],
};

module.exports = config;
