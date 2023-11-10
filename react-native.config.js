module.exports = {
  dependencies: {
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
