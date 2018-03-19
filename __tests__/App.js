import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// use the web3 mock to prevent sintax error from node_tar
jest.mock('web3');

//mock notifications
jest.mock('react-native-notifications');

//mock i18n
jest.mock('react-native-video');

it('renders correctly', () => {
  const tree = renderer.create(
    <App />
  );
});
