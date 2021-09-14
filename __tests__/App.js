import 'react-native';
import React from 'react';
import App from '../App';
import { BackHandler } from 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getStores } from '../AppStores';
jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
}));
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('../src/blockchain/v2/walletconnect/modal/registry');

jest.mock(
  '../src/buy-tokens/transak-widget/TransakWidget',
  () => 'TransakWidget',
);

jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: jest.fn(({ children }) => children),
  CardField: jest.fn(() => null),
  presentPaymentSheet: jest.fn(),
  initPaymentSheet: jest.fn(),
}));

// mock backhandler
BackHandler.addEventListener = jest.fn();
jest.mock('../src/common/services/log.service', () => {});
jest.mock('../src/common/services/push.service');

jest.mock('../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock('../src/comments/v2/CommentBottomSheet', () => 'CommentBottomSheet');

// use the web3 mock to prevent syntax error from node_tar
jest.mock('web3');

jest.mock('react-native-system-setting', () => {
  return {
    getVolume: jest.fn(() => Promise.resolve()),
  };
});

//mock packages
jest.mock('react-native-share-menu');
jest.mock('react-native-silent-switch');
jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    BottomSheetFlatList: react.FlatList,
  };
});
jest.mock('react-native-notifications');
jest.mock('react-navigation-shared-element', () => ({
  createSharedElementStackNavigator: jest.fn(),
}));
jest.mock('react-native-convert-ph-asset');
jest.mock('@react-navigation/native');
jest.mock('@react-navigation/bottom-tabs');
jest.mock('react-native-screens/native-stack');
jest.mock('react-native-file-share-intent');
jest.mock('react-native-safe-area-context');
jest.mock('../src/common/services/translation.service');
jest.mock('../src/tos/TosModal', () => 'TosModal');

getStores.mockReturnValue({
  user: {
    me: {},
    load: jest.fn(),
    setUser: jest.fn(),
  },
});

it('renders correctly', () => {
  const tree = renderer.create(<App />);
});
