import 'react-native';
import React from 'react';
import { Text, TouchableOpacity } from "react-native";
import { shallow } from 'enzyme';
import featuresService from '../../src/common/services/features.service';

import LoginScreen from '../../src/auth/LoginScreen';

jest.mock('../../src/auth/AuthService');

jest.mock('../../src/auth/LoginForm', () => 'LoginForm');
jest.mock('../../src/auth/ForgotPassword', () => 'ForgotPassword');

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('LoginScreen component', () => {

  beforeEach(() => {
    featuresService.features = {'homepage-december-2019': false};
  });

  it('should renders correctly', () => {
    const loginScreen = renderer.create(
      <LoginScreen />
    ).toJSON();
    expect(loginScreen).toMatchSnapshot();
  });

  it('should shows login form component', async () => {
    const wrapper = shallow(
      <LoginScreen hopFeatures={true} />
    );

    // search login form
    let render = wrapper.dive();
    const loginForms = render.find('LoginForm');

    // should contain 1 login form
    expect(loginForms.length).toBe(1);
  });

  it('should shows forgot password component if the user press the button', async () => {

    const navigation = {
      push: jest.fn()
    };

    const wrapper = shallow(
      <LoginScreen navigation={navigation} hopFeatures={true} />
    );

    // search login form
    let render = wrapper.dive();
    const loginForms = render.find('LoginForm');

    // should contain 1 login form
    expect(loginForms.length).toBe(1);

    // simulate forgot password component button press
    loginForms.at(0).props().onForgot();

    expect(navigation.push).toBeCalled();
  });
});
