const extraNodeModules = require('node-libs-browser');
const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  extraNodeModules,
  resolver: {
    blacklistRE: blacklist([/react-native\/local-cli\/core\/__fixtures__.*/])
  },
};
