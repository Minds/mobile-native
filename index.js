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
import { AppRegistry } from 'react-native';
import reanimated from 'react-native-reanimated';
import App from './App';
import { enableFreeze } from 'react-native-screens';

enableFreeze(true);

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

AppRegistry.registerComponent('Minds', () => App);
