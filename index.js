import 'react-native-gesture-handler'; // fix ongesturehandler error
import 'react-native-image-keyboard';
import 'react-native-reanimated';

import './global';
import 'intl-pluralrules';

import { registerRootComponent } from 'expo';
// if (process.env.NODE_ENV === 'development') {
//   const whyDidYouRender = require('@welldone-software/why-did-you-render');
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }
import { LogBox } from 'react-native';
import App from './App';
import { enableFreeze } from 'react-native-screens';

LogBox.ignoreAllLogs();

process.env.DEBUG === 'tamagui';
process.env.TAMAGUI_TARGET = 'native';
process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = 1;
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = 1;

enableFreeze(true);

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

registerRootComponent(App);
