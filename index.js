import 'react-native-gesture-handler'; // fix ongesture handler error
import 'react-native-image-keyboard';
// import 'node-libs-react-native/globals';
import './global';
import crypto from 'crypto'; // DO NOT REMOVE!
import 'intl-pluralrules';

import React from 'react';
// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }
import { AppRegistry, LogBox, Platform } from 'react-native';
import reanimated from 'react-native-reanimated';
import App from './App';
import { enableFreeze } from 'react-native-screens';

LogBox.ignoreAllLogs();

process.env.DEBUG === 'tamagui';
process.env.TAMAGUI_TARGET = 'native';
process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = 1;
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = 1;

enableFreeze(true);

if (Platform.OS === 'ios') {
  //TODO: remove when Intl is implemented on Hermes engine (iOS)
  require('@formatjs/intl-getcanonicallocales/polyfill').default;
  require('@formatjs/intl-locale/polyfill').default;
  require('@formatjs/intl-pluralrules/polyfill').default;
  require('@formatjs/intl-pluralrules/locale-data/en').default;
  require('@formatjs/intl-numberformat/polyfill').default;
  require('@formatjs/intl-numberformat/locale-data/en').default;
}

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

AppRegistry.registerComponent('Minds', () => App);
