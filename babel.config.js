module.exports = function (api) {
  api.cache(false);
  return {
    "presets": ["react-native"],
    "plugins": [
      ["@babel/plugin-proposal-decorators", {
        "legacy": true
      }]
    ]
  }
}
