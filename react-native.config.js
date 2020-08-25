module.exports = {
  dependencies: {
    'react-native-notifications': {
      platforms: {
        android: null,
      },
    },
    'tipsi-stripe': {
      platforms: {
        ios: null, // disable ios platform, other platforms will still autolink if provided
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/'],
};
