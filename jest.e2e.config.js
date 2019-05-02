const config = {
  "automock": false,
  "cacheDirectory": ".jest/cache",
  "testRegex": "./__e2e__/.*-test.js$",
  "preset": "react-native",
  "testPathIgnorePatterns": [
    "/node_modules/"
  ],
  "transformIgnorePatterns": [
    "node_modules/(?!react-native|react-navigation|vargs)/"
  ],
  "moduleNameMapper": {
    "^image![a-zA-Z0-9$_-]+$": "GlobalImageStub",
    "^[@./a-zA-Z0-9$_-]+\\.(png|gif)$": "RelativeImageStub"
  },
  "snapshotSerializers": [
    "./node_modules/enzyme-to-json/serializer"
  ]
}

module.exports = config