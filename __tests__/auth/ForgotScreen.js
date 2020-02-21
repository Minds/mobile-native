import 'react-native';
import React from 'react';

import ForgotScreen from '../../src/auth/ForgotScreen';

jest.mock('../../src/auth/AuthService');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('ForgotScreen component', () => {
  it('should renders correctly', () => {
    const navigation = {};
    const route = { params: {} };
    const forgotScreen = renderer
      .create(<ForgotScreen navigation={navigation} route={route} />)
      .toJSON();
    expect(forgotScreen).toMatchSnapshot();
  });
});
