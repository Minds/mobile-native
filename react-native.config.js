module.exports = {
  dependencies: {
    'react-native-notifications': {
      platforms: {
        android: null,
      },
    },
    '@stripe/stripe-react-native': {
      platforms: {
        ios: null, // disable ios platform, other platforms will still autolink if provided
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts/', './src/assets/stickers'],
};
