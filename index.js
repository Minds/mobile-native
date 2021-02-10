import 'react-native-gesture-handler'; // fix ongesture handler error
// import 'node-libs-react-native/globals';
import 'mobx-react/batchingForReactNative';
import './global';
import crypto from 'crypto'; // DO NOT REMOVE!

import { AppRegistry } from 'react-native';
import App from './App';
import { enableScreens } from 'react-native-screens';
enableScreens();

// const modules = require.getModules();
// const moduleIds = Object.keys(modules);
// const loadedModuleNames = moduleIds
//   .filter(moduleId => modules[moduleId].isInitialized)
//   .map(moduleId => modules[moduleId].verboseName);
// const waitingModuleNames = moduleIds
//   .filter(moduleId => !modules[moduleId].isInitialized)
//   .map(moduleId => modules[moduleId].verboseName);

// // make sure that the modules you expect to be waiting are actually waiting
// console.log(
//   'loaded:',
//   loadedModuleNames.length,
//   'waiting:',
//   waitingModuleNames.length
// );

// // grab this text blob, and put it in a file named packager/modulePaths.js
// console.log(`module.exports = ${JSON.stringify(loadedModuleNames.sort())};`);

AppRegistry.registerComponent('Minds', () => App);
