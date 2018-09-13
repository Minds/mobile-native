import { AppRegistry } from 'react-native';
/*import App from './App';

AppRegistry.registerComponent('Minds', () => App);*/


import applyDecoratedDescriptor from '@babel/runtime/helpers/applyDecoratedDescriptor';
import initializerDefineProperty from '@babel/runtime/helpers/initializerDefineProperty';

Object.assign(babelHelpers, {
  applyDecoratedDescriptor,
  initializerDefineProperty,
});

// import App from './App';
// RN 0.56 Release version crashes
// Workaround: RN 0.56 Release version crashes
// Sources:
//      https://github.com/facebook/react-native/issues/19827
//      https://github.com/facebook/react-native/issues/20150
AppRegistry.registerComponent('Minds', () => require('./App').default);
