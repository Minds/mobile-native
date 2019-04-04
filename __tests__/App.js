import 'react-native';
import React from 'react';
import App from '../App';
import videochat from '../src/common/services/videochat.service';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// fix react navigation v3 errors
jest.mock('react-native-gesture-handler', () => {});
jest.mock('react-navigation-stack', () => { Header: {} });
jest.mock('react-navigation', () => {
  return {
      createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {return null;}),
      createDrawerNavigator: jest.fn(),
      createMaterialTopTabNavigator: jest.fn().mockImplementation(x => ({router: 'router'})),
      createStackNavigator: jest.fn(),
      withNavigation: jest.fn(),
      StackActions: {
          push: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/PUSH"})),
          replace: jest.fn().mockImplementation(x => ({...x,  "type": "Navigation/REPLACE"})),
      },
      NavigationActions: {
          navigate: jest.fn().mockImplementation(x => x),
      }
  }
});

// use the web3 mock to prevent sintax error from node_tar
jest.mock('web3');

//mock notifications
jest.mock('react-native-notifications');

jest.mock('../src/common/services/videochat.service');

//mock i18n
jest.mock('react-native-video');

jest.mock('../src/blockchain/transaction-modal/BlockchainTransactionModalScreen', () => 'BlockchainTransactionModalScreen');
jest.mock('../src/keychain/KeychainModalScreen', () => 'KeychainModalScreen');

jest.mock('../src/common/services/translation.service');
jest.mock('../src/common/helpers/abortableFetch');

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  );
});
