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
LogBox.ignoreLogs([
  'Module RCTSilentSwitch requires main queue setup since it overrides',
  'Found screens with the same name nested inside one another',
  'Possible Unhandled Promise Rejection',
  'new NativeEventEmitter',
  'You have passed a style',
  'Non-serializable values were found in the navigation state',
  'Easing was renamed',
  'Require cycle: ',
]);

enableFreeze(true);

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

registerRootComponent(App);
