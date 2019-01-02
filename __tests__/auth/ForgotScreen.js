import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';

import ForgotScreen from '../../src/auth/ForgotScreen';

jest.mock('../../src/auth/AuthService');
jest.mock('../../src/common/components/VideoBackground', () => 'VideoBackground');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('ForgotScreen component', () => {

  it('should renders correctly', () => {
    const forgotScreen = renderer.create(
      <ForgotScreen />
    ).toJSON();
    expect(forgotScreen).toMatchSnapshot();
  });
});
