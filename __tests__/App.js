import 'react-native';
import React from 'react';
import App from '../App';
import sqliteStorageProviderService from '../src/common/services/sqlite-storage-provider.service';
import logService from '../src/common/services/log.service';
import {
  BackHandler,
} from 'react-native';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));


// mock backhandler
BackHandler.addEventListener = jest.fn();
jest.mock('../src/common/services/sqlite-storage-provider.service')
jest.mock('../src/common/services/log.service', () => {});
jest.mock('../src/common/services/push.service');
jest.mock('react-native-gesture-handler', () => {});

// use the web3 mock to prevent sintax error from node_tar
jest.mock('web3');

//mock notifications
jest.mock('react-native-notifications');
jest.mock('react-native-convert-ph-asset');
jest.mock('react-navigation');
jest.mock('react-navigation-tabs');
jest.mock('react-navigation-stack');

//mock i18n
jest.mock('react-native-video');

jest.mock('../src/blockchain/transaction-modal/BlockchainTransactionModalScreen', () => 'BlockchainTransactionModalScreen');
jest.mock('../src/keychain/KeychainModalScreen', () => 'KeychainModalScreen');

jest.mock('../src/common/services/translation.service');
jest.mock('../src/common/helpers/abortableFetch');
jest.mock('../src/tos/TosModal', () => 'TosModal');

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  );
});
