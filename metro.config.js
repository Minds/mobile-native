/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const defaultSourceExts = require('metro-config/src/defaults/defaults')
  .sourceExts;

const nodelibs = require('node-libs-react-native');
nodelibs.vm = require.resolve('vm-browserify');

module.exports = {
  resolver: {
    extraNodeModules: nodelibs,
    sourceExts: process.env.RN_SRC_EXT
      ? process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts)
      : defaultSourceExts,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
};
