import 'react-native';
import React from 'react';
import App from '../App';
import { BackHandler } from 'react-native';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { getStores } from '../AppStores';
import { View } from 'react-native';

jest.mock('../src/blockchain/v2/walletconnect/modal/registry');

jest.mock(
  '../src/buy-tokens/transak-widget/TransakWidget',
  () => 'TransakWidget',
);

jest.mock('react-native-exception-handler');

jest.mock('react-native-code-push', () => {
  const cp = () => app => app;
  Object.assign(cp, {
    InstallMode: {},
    CheckFrequency: {},
    SyncStatus: {},
    UpdateState: {},
    DeploymentStatus: {},
    DEFAULT_UPDATE_DIALOG: {},

    allowRestart: jest.fn(),
    checkForUpdate: jest.fn(() => Promise.resolve(null)),
    disallowRestart: jest.fn(),
    getCurrentPackage: jest.fn(() => Promise.resolve(null)),
    getUpdateMetadata: jest.fn(() => Promise.resolve(null)),
    notifyAppReady: jest.fn(() => Promise.resolve()),
    restartApp: jest.fn(),
    sync: jest.fn(() => Promise.resolve(1)),
    clearUpdates: jest.fn(),
  });
  return cp;
});

// mock backhandler
BackHandler.addEventListener = jest.fn();
jest.mock('../src/common/services/log.service', () => {});
jest.mock('../src/common/services/push.service');

jest.mock('../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');
jest.mock('../src/comments/v2/CommentBottomSheet', () => 'CommentBottomSheet');

// use the web3 mock to prevent syntax error from node_tar
jest.mock('web3');

//mock packages
jest.mock('react-native-share-menu');
jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    BottomSheetFlatList: react.FlatList,
  };
});
jest.mock('react-native-notifications');
jest.mock('react-native-convert-ph-asset');
jest.mock('@react-navigation/native');
jest.mock('@react-navigation/bottom-tabs');
jest.mock('react-native-screens/native-stack');
jest.mock('react-native-file-share-intent');
jest.mock('react-native-safe-area-context');
jest.mock('../src/common/services/translation.service');

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
