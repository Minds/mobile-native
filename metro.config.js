/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const blacklist = require('metro-config/src/defaults/blacklist');
const defaultSourceExts = require('metro-config/src/defaults/defaults')
  .sourceExts;

module.exports = {
  resolver: {
    extraNodeModules: require('@hawkingnetwork/node-libs-react-native'),
    blacklistRE: blacklist([
      /ios\/Pods\/JitsiMeetSDK\/Frameworks\/JitsiMeet.framework\/assets\/node_modules\/react-native\/.*/,
    ]),
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
