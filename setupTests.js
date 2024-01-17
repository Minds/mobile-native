/* eslint-disable no-undef */
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment-timezone';
import i18n from './src/common/services/i18n.service';

require('./node_modules/react-native-gesture-handler/jestSetup.js');

const XMLHttpRequest = {
  open: jest.fn(),
  abort: jest.fn(),
  onerror: jest.fn(),
};
global.XMLHttpRequest = XMLHttpRequest;

configure({ adapter: new Adapter() });

jest.mock('~/config/Version', () => ({
  Version: {
    VERSION: '3.8.0',
    BUILD: 111,
  },
}));

jest.mock('@react-native-cookies/cookies', () => ({
  get: jest.fn(),
  set: jest.fn(),
  clearByName: jest.fn(),
}));

jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  useAnimatedKeyboard: jest.fn().mockReturnValue({ height: 0 }),
}));

jest.mock('./src/common/services/analytics.service');
jest.mock('./src/newsfeed/NewsfeedService');

jest.mock('expo-font');

jest.mock('react-native-localize');
jest.mock('@react-native-camera-roll/camera-roll');
jest.mock('expo-image');
// jest.mock('react-native-device-info', () =>
//   require('./node_modules/react-native-device-info/jest/react-native-device-info-mock'),
// );
// jest.mock('@snowplow/react-native-tracker');
// jest.mock('mobx-react', () => require('mobx-react/custom'));
jest.mock('@react-native-community/netinfo', () => ({
  configure: jest.fn(),
  addEventListener: jest.fn(),
}));

jest.mock('./AppStores');
jest.mock('./AppMessageProvider');
jest.useFakeTimers();

jest.doMock('moment', () => {
  moment.tz.setDefault('America/Los_Angeles');
  return moment;
});

jest.doMock('moment-timezone', () => {
  moment.tz.setDefault('America/Los_Angeles');
  return moment;
});

i18n.setLocale('en', false);

// fix for snapshots and touchables

jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableOpacity.js',
  () => {
    const { View } = require('react-native');
    const MockTouchable = props => {
      return <View {...props} />;
    };

    MockTouchable.displayName = 'TouchableOpacity';

    return MockTouchable;
  },
);

jest.mock(
  'react-native/Libraries/Components/Touchable/TouchableHighlight.js',
  () => {
    const { View } = require('react-native');
    const MockTouchable = props => {
      return <View {...props} />;
    };

    MockTouchable.displayName = 'TouchableHighlight';

    return MockTouchable;
  },
);
jest.mock('react-native-system-setting', () => {
  return {
    getVolume: jest.fn(() => Promise.resolve()),
  };
});
jest.mock('react-native-silent-switch');
jest.mock('big.js', () => ({ Big: jest.fn() }));
jest.mock('react-native-mmkv-storage');
global.__reanimatedWorkletInit = jest.fn();

jest.mock('@stripe/stripe-react-native', () =>
  require('@stripe/stripe-react-native/jest/mock.js'),
);

jest.mock('expo-sensors', () => jest.fn());

jest.mock('react-native-exception-handler');

import ri18n from 'utils/locales';
ri18n.init();

// TAMAGUI
process.env.TAMAGUI_TARGET = 'native';

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// expo vector icons
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock(
  '@expo/vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);
jest.mock('@expo/vector-icons/FontAwesome5', () => 'FontAwesome5');
jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');
jest.mock('@expo/vector-icons/Ionicons', () => 'IonIcon');
jest.mock('@expo/vector-icons/Feather', () => 'Feather');
jest.mock('@expo/vector-icons/Fontisto', () => 'Fontisto');
jest.mock('@expo/vector-icons/Entypo', () => 'Entypo');
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: () => {
    return 'FontAwesome';
  },
}));
