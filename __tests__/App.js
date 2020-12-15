import 'react-native';
import React from 'react';
import App from '../App';
import sqliteStorageProviderService from '../src/common/services/sqlite-storage-provider.service';
import logService from '../src/common/services/log.service';
import MindsVideoV2 from '../src/media/v2/mindsVideo/MindsVideo';
import {
  BackHandler,
} from 'react-native';
import ShareMenu from 'react-native-share-menu';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock(
  '../src/buy-tokens/transak-widget/TransakWidget',
  () => 'TransakWidget',
);

// mock backhandler
BackHandler.addEventListener = jest.fn();
jest.mock('../src/common/services/sqlite-storage-provider.service')
jest.mock('../src/common/services/log.service', () => {});
jest.mock('../src/common/services/push.service');

jest.mock('../src/media/v2/mindsVideo/MindsVideo', () => 'MindsVideoV2');

// use the web3 mock to prevent syntax error from node_tar
jest.mock('web3');

//mock packages
jest.mock('react-native-share-menu');
jest.mock('react-native-notifications');
jest.mock('react-navigation-shared-element', () => ({
  createSharedElementStackNavigator: jest.fn(),
}));
jest.mock('react-native-convert-ph-asset');
jest.mock('@react-navigation/native');
jest.mock('@react-navigation/bottom-tabs');
jest.mock('react-native-screens/native-stack');
jest.mock('react-native-file-share-intent');

//mock i18n
jest.mock('react-native-video');

jest.mock('../src/keychain/KeychainModalScreen', () => 'KeychainModalScreen');

jest.mock('../src/common/services/translation.service');
jest.mock('../src/common/helpers/abortableFetch');
jest.mock('../src/tos/TosModal', () => 'TosModal');

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  );
});
