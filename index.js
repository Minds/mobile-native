import 'react-native-gesture-handler'; // fix ongesture handler error
// import 'node-libs-react-native/globals';
import './global';

import crypto from 'crypto'; // DO NOT REMOVE!

import React from 'react';
// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }
import { AppRegistry, Platform } from 'react-native';
import reanimated from 'react-native-reanimated';
import App from './App';
import { enableFreeze } from 'react-native-screens';
import '~/common/services/push/push-handlers';

enableFreeze(true);

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  if (Platform.OS === 'ios') {
    //TODO: remove when Intl is implemented on Hermes engine (iOS)
    require('@formatjs/intl-getcanonicallocales/polyfill').default;
    require('@formatjs/intl-locale/polyfill').default;
    require('@formatjs/intl-pluralrules/polyfill').default;
    require('@formatjs/intl-pluralrules/locale-data/en').default;
    require('@formatjs/intl-numberformat/polyfill').default;
    require('@formatjs/intl-numberformat/locale-data/en').default;
  }

  return <App />;
}

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

AppRegistry.registerComponent('Minds', () => HeadlessCheck);
