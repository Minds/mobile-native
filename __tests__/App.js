import 'react-native';
import React from 'react';
import App from '../App';
import videochat from '../src/common/services/videochat.service';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// use the web3 mock to prevent sintax error from node_tar
jest.mock('web3');

//mock notifications
jest.mock('react-native-notifications');

jest.mock('../src/common/services/videochat.service');

//mock i18n
jest.mock('react-native-video');

jest.mock('../src/blockchain/transaction-modal/BlockchainTransactionModalScreen', () => 'BlockchainTransactionModalScreen');
jest.mock('../src/keychain/KeychainModalScreen', () => 'KeychainModalScreen');

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  );
});
